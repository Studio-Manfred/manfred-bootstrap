import { describe, expect, test } from 'vitest'
import {
  CLAUDE_DEEP_LINK_PREFIX,
  MAX_PROMPT_CHARS,
  buildClaudeDeepLink,
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

describe('buildClaudeDeepLink', () => {
  const prompt = buildClaudePrompt()
  const link = buildClaudeDeepLink(prompt)

  test('starts with the claude:// new-chat prefix', () => {
    expect(link.startsWith('claude://claude.ai/new?q=')).toBe(true)
    expect(CLAUDE_DEEP_LINK_PREFIX).toBe('claude://claude.ai/new?q=')
  })

  test('round-trips through decodeURIComponent', () => {
    expect(decodeURIComponent(link.slice(CLAUDE_DEEP_LINK_PREFIX.length))).toBe(prompt)
  })
})
