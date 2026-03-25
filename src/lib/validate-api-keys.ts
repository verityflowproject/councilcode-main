import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { Mistral } from '@mistralai/mistralai'
import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Each function instantiates a fresh client with the candidate key,
 * makes the cheapest possible live request, and returns true on success.
 * All errors are caught — these functions never throw.
 */

export async function validateAnthropicKey(key: string): Promise<boolean> {
  try {
    const client = new Anthropic({ apiKey: key })
    await client.models.list()
    return true
  } catch {
    return false
  }
}

export async function validateOpenAiKey(key: string): Promise<boolean> {
  try {
    const client = new OpenAI({ apiKey: key })
    await client.models.list()
    return true
  } catch {
    return false
  }
}

export async function validateMistralKey(key: string): Promise<boolean> {
  try {
    const client = new Mistral({ apiKey: key })
    await client.models.list()
    return true
  } catch {
    return false
  }
}

export async function validateGoogleAiKey(key: string): Promise<boolean> {
  try {
    const genAI = new GoogleGenerativeAI(key)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'hi' }] }],
      generationConfig: { maxOutputTokens: 1 },
    })
    return true
  } catch {
    return false
  }
}

export async function validatePerplexityKey(key: string): Promise<boolean> {
  try {
    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [{ role: 'user', content: 'hi' }],
        max_tokens: 1,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}
