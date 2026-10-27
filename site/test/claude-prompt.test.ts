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

  test('tells the chat to ask one question at a time', () => {
    expect(prompt).toMatch(/one question at a time/i)
  })

  test('is written in English and tells the chat to be a friendly guide', () => {
    expect(prompt).toMatch(/INSTRUCTIONS FOR THE AI ASSISTANT/)
    expect(prompt).toMatch(/friendly/i)
    expect(prompt).not.toMatch(/Ställ bara en fråga|Du är en vänlig/)
  })

  test('opens by explaining the purpose, then offers options with short descriptions, not an open question', () => {
    expect(prompt).toMatch(/purpose of Manfred Bootstrap/)
    expect(prompt).toMatch(/Understand Bootstrap: /)
    expect(prompt).toMatch(/Start a new project: /)
    expect(prompt).toMatch(/Add it to an existing repo: /)
    expect(prompt).not.toMatch(/What do you want to do\?/)
  })

  test('asks for experience in concrete terms and always establishes goal and level', () => {
    expect(prompt).toMatch(/How comfortable are you setting up a repo/)
    expect(prompt).toMatch(/Always establish the goal and the experience level/)
  })

  test('offers numbered options that also work in a plain chat', () => {
    expect(prompt).toMatch(/numbered/i)
  })

  test('warns about the three known errors in the guide, without changing commands', () => {
    const section = prompt.slice(prompt.indexOf('KNOWN ISSUES'), prompt.indexOf('FORMAT'))
    expect(section).toMatch(/--yes/)
    expect(section).toMatch(/docs\/ways-of-working-overview\.md/)
    expect(section).toMatch(/package\.json/)
  })

  test('requires confirmation before changes and does not point to a Slack channel at the end', () => {
    expect(prompt).toMatch(/Ask the user to confirm before/)
    expect(prompt).toMatch(/Do not end by pointing the user to a Slack channel/)
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
