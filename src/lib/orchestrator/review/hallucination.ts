import { runPerplexity } from '../adapters/perplexity'
import { mergeProjectState } from '@/lib/utils/projectState'
import type {
  OrchestratorTask,
  ProjectStateDoc,
} from '@/types'

// --- Trigger detection ---
// Scans a prompt for signals that external dependencies need verification
// before any code is written.
const HALLUCINATION_TRIGGERS: RegExp[] = [
  // Package managers
  /\b(npm|yarn|pnpm|pip|cargo|gem)\b/i,
  // Import / require patterns
  /\b(import|require|from)\s+['"][^'"]+['"]/i,
  // Explicit library names commonly hallucinated
  /\b(mongoose|prisma|drizzle|typeorm|sequelize)\b/i,
  /\b(next-auth|nextauth|@auth\/|lucia|clerk)\b/i,
  /\b(stripe|paypal|square|braintree)\b/i,
  /\b(redis|ioredis|upstash|bullmq|bull)\b/i,
  /\b(openai|anthropic|@google\/|mistral|perplexity)\b/i,
  /\b(zod|yup|joi|valibot)\b/i,
  /\b(react-query|tanstack|swr|zustand|jotai|recoil)\b/i,
  /\b(framer-motion|motion|gsap|three\.?js)\b/i,
  /\b(axios|ky|got|node-fetch|undici)\b/i,
  /\b(jest|vitest|playwright|cypress|testing-library)\b/i,
  // Version-specific language
  /\bv\d+\.\d+/i,
  /\b(version|release|upgrade|migrate|breaking change)\b/i,
  // API / endpoint language
  /\b(API|SDK|endpoint|webhook|REST|GraphQL|gRPC)\b/i,
]

export function shouldFireHallucinationCheck(prompt: string): boolean {
  return HALLUCINATION_TRIGGERS.some((pattern) => pattern.test(prompt))
}

// --- Extract package names from prompt ---
// Pulls out likely package/library names for targeted verification.
const PACKAGE_PATTERNS: RegExp[] = [
  // import X from 'package-name'
  /from\s+['"](@?[a-z0-9][a-z0-9\-_./@]*)['"]/gi,
  // require('package-name')
  /require\s*\(\s*['"](@?[a-z0-9][a-z0-9\-_./@]*)['"]]/gi,
  // @scope/package or plain-package
  /\b(@[a-z0-9\-_.]+\/[a-z0-9\-_.]+|[a-z][a-z0-9\-_.]{2,})\b/gi,
]

export function extractPackageNames(prompt: string): string[] {
  const found = new Set<string>()
  for (const pattern of PACKAGE_PATTERNS) {
    const matches = prompt.matchAll(pattern)
    for (const match of matches) {
      const name = match[1]
      if (name && name.length > 2 && !isCommonWord(name)) {
        found.add(name)
      }
    }
  }
  return Array.from(found)
}

// Filter out common English words that match package-like patterns
const COMMON_WORDS = new Set([
  'the', 'and', 'for', 'not', 'with', 'this', 'that', 'from',
  'have', 'will', 'your', 'use', 'all', 'can', 'but', 'are',
  'was', 'one', 'our', 'out', 'get', 'has', 'him', 'his',
  'how', 'its', 'now', 'see', 'two', 'way', 'who', 'did',
  'new', 'any', 'may', 'day', 'too', 'via', 'set', 'add',
])

function isCommonWord(word: string): boolean {
  return COMMON_WORDS.has(word.toLowerCase())
}

// --- Firewall result ---
export interface HallucinationFirewallResult {
  passed: boolean
  verifiedPackages: { package: string; version: string; notes: string }[]
  warnings: { package: string; issue: string }[]
  unverified: string[]
  enrichedPrompt: string
  tokensUsed: number
  blocked: boolean
  blockReason?: string
}

// --- Core firewall function ---
export async function runHallucinationFirewall(
  task: OrchestratorTask,
  projectState: Partial<ProjectStateDoc>
): Promise<HallucinationFirewallResult> {
  // Skip if no triggers found
  if (!shouldFireHallucinationCheck(task.prompt)) {
    return {
      passed: true,
      verifiedPackages: [],
      warnings: [],
      unverified: [],
      enrichedPrompt: task.prompt,
      tokensUsed: 0,
      blocked: false,
    }
  }

  // Extract packages to verify
  const extractedPackages = extractPackageNames(task.prompt)
  const knownPackages = projectState.dependencies?.packages ?? []
  const allPackages = Array.from(new Set([...extractedPackages, ...knownPackages]))

  // Build research prompt
  const researchPrompt = `
Verify the following packages and APIs referenced in this coding task.

Task context:
${task.prompt.slice(0, 500)}

Packages/libraries to verify:
${allPackages.length > 0 ? allPackages.join(', ') : 'Detect from task context'}

For each package:
1. Confirm the current stable version as of today
2. Note any breaking changes in recent major versions
3. Flag any methods, imports, or patterns in the task that are incorrect or deprecated
4. If you cannot verify a package exists, mark it as unverified

Return ONLY valid JSON:
{
  "verified": [{ "package": string, "version": string, "notes": string }],
  "warnings": [{ "package": string, "issue": string }],
  "unverified": string[]
}
`.trim()

  const researchTask: OrchestratorTask = {
    projectId: task.projectId,
    taskType: 'research',
    prompt: researchPrompt,
    assignedModel: 'perplexity',
    context: {
      projectId: task.projectId,
      dependencies: projectState.dependencies,
      currentTask: task.context.currentTask,
    },
    userId: task.userId,
  }

  let researchResponse
  try {
    researchResponse = await runPerplexity(researchTask)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('[HallucinationFirewall] Perplexity call failed:', err)
    // Fail open — don't block if the firewall itself errors
    return {
      passed: true,
      verifiedPackages: [],
      warnings: [],
      unverified: [],
      enrichedPrompt: task.prompt,
      tokensUsed: 0,
      blocked: false,
      blockReason: `Firewall check failed: ${err.message}`,
    }
  }

  // Parse Perplexity's structured JSON response
  let verified: { package: string; version: string; notes: string }[] = []
  let warnings: { package: string; issue: string }[] = []
  let unverified: string[] = []

  try {
    const cleaned = researchResponse.output
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    const parsed = JSON.parse(cleaned)
    verified = Array.isArray(parsed.verified) ? parsed.verified : []
    warnings = Array.isArray(parsed.warnings) ? parsed.warnings : []
    unverified = Array.isArray(parsed.unverified) ? parsed.unverified : []
  } catch {
    // Could not parse — treat as inconclusive, fail open
    return {
      passed: true,
      verifiedPackages: [],
      warnings: [{ package: 'all', issue: 'Firewall response could not be parsed — manual review recommended' }],
      unverified: [],
      enrichedPrompt: task.prompt,
      tokensUsed: researchResponse.tokensUsed,
      blocked: false,
    }
  }

  // --- Block decision ---
  // Block execution only if a core package is unverified AND
  // it appears to be directly used in the task (not just mentioned).
  // We fail open for warnings to avoid over-blocking.
  const criticalUnverified = unverified.filter((pkg) =>
    task.prompt.toLowerCase().includes(pkg.toLowerCase())
  )
  const blocked = criticalUnverified.length > 0
  const blockReason = blocked
    ? `Cannot proceed — the following packages could not be verified and are directly referenced in the task: ${criticalUnverified.join(', ')}. Please verify these packages exist and are correctly named before retrying.`
    : undefined

  // --- Enrich the downstream prompt with verified dependency info ---
  const verifiedSection = verified.length > 0
    ? `\n\n--- Verified dependency info (use these exact versions and patterns) ---\n${verified
        .map((v) => `• ${v.package}@${v.version}: ${v.notes}`)
        .join('\n')}`
    : ''

  const warningsSection = warnings.length > 0
    ? `\n\n--- Dependency warnings (take note) ---\n${warnings
        .map((w) => `⚠ ${w.package}: ${w.issue}`)
        .join('\n')}`
    : ''

  const enrichedPrompt = blocked
    ? task.prompt
    : `${task.prompt}${verifiedSection}${warningsSection}`

  // Update project state with newly verified packages
  if (!blocked && verified.length > 0) {
    const versionMap: Record<string, string> = {}
    const packageNames: string[] = []
    for (const v of verified) {
      versionMap[v.package] = v.version
      packageNames.push(v.package)
    }
    await mergeProjectState(task.projectId, {
      dependencies: {
        packages: Array.from(new Set([...knownPackages, ...packageNames])),
        versions: {
          ...(projectState.dependencies?.versions ?? {}),
          ...versionMap,
        },
        knownGotchas: [
          ...(projectState.dependencies?.knownGotchas ?? []),
          ...warnings.map((w) => `${w.package}: ${w.issue}`),
        ],
      },
    }).catch((err) =>
      console.error('[HallucinationFirewall] state merge failed:', err)
    )
  }

  return {
    passed: !blocked,
    verifiedPackages: verified,
    warnings,
    unverified,
    enrichedPrompt,
    tokensUsed: researchResponse.tokensUsed,
    blocked,
    blockReason,
  }
}
