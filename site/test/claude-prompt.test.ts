import { describe, expect, test } from 'vitest'
import {
  MAX_PROMPT_CHARS,
  buildClaudePrompt,
} from '../src/lib/claude-prompt'
import { buildGuideContext } from '../src/lib/guide-context'
import { PLUGINS_URL, SITE_URL } from '../src/content/guide'

describe('buildClaudePrompt', () => {
  const prompt = buildClaudePrompt()

  test('contains the live guide URL and plugins URL', () => {
    expect(prompt).toContain(SITE_URL)
    expect(prompt).toContain(PLUGINS_URL)
  })

  test('contains the generated guide context', () => {
    expect(prompt).toContain(buildGuideContext())
  })

  test('tells Claude to ask one question at a time', () => {
    expect(prompt).toMatch(/Ställ bara en fråga åt gången/)
  })

  test('tells the chat to be a friendly guide', () => {
    expect(prompt).toMatch(/vänlig/)
    expect(prompt).toMatch(/INSTRUKTION TILL AI-ASSISTENTEN/)
  })

  test('opens by explaining the purpose, then offers options with short descriptions, not an open question', () => {
    expect(prompt).toMatch(/syftet med Manfred Bootstrap/)
    expect(prompt).toMatch(/Förstå Bootstrap: /)
    expect(prompt).toMatch(/Starta ett nytt projekt: /)
    expect(prompt).toMatch(/Lägga till i ett befintligt repo: /)
    expect(prompt).not.toMatch(/Vad vill du få hjälp med:/)
    expect(prompt).not.toMatch(/Vad vill du göra\?/)
  })

  test('asks for experience in concrete terms and for the kind of guidance wanted', () => {
    expect(prompt).toMatch(/Hur van är du att sätta upp ett repo/)
    expect(prompt).toMatch(/Hur vill personen bli guidad\?/)
  })

  test('has no unreplaced placeholder', () => {
    expect(prompt).not.toContain('{{GUIDE_CONTEXT}}')
  })

  test('stays under the character limit', () => {
    expect(prompt.length).toBeLessThan(MAX_PROMPT_CHARS)
  })

  test('falls back to a compact plugin list when the full context does not fit', () => {
    const tight = buildClaudePrompt({ maxChars: prompt.length - 1 })
    expect(tight.length).toBeLessThan(prompt.length)
    expect(tight).toContain(PLUGINS_URL)
  })

  test('throws if even the smallest context does not fit', () => {
    expect(() => buildClaudePrompt({ maxChars: 500 })).toThrow()
  })
})
