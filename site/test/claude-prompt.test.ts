import { describe, expect, test } from 'vitest'
import {
  MAX_PROMPT_CHARS,
  buildClaudePrompt,
  buildPromptExcerpt,
} from '../src/lib/claude-prompt'
import { buildGuideContext } from '../src/lib/guide-context'
import { PLUGINS_URL, SITE_URL } from '../src/content/guide'

describe('buildClaudePrompt', () => {
  const prompt = buildClaudePrompt()

  test('contains the live guide URL and plugins URL', () => {
    expect(prompt).toContain(SITE_URL)
    expect(prompt).toContain(PLUGINS_URL)
  })

  test('contains the generated guide context (full or compact plugin list)', () => {
    const full = buildGuideContext({ pluginDetail: 'full' })
    const compact = buildGuideContext({ pluginDetail: 'compact' })
    expect(prompt.includes(full) || prompt.includes(compact)).toBe(true)
  })

  test('explains the Code tab in Claude Desktop and what the guide does not cover', () => {
    expect(prompt).toMatch(/Code tab in Claude Desktop/)
    expect(prompt).toMatch(/https:\/\/code\.claude\.com\/docs\/en\/desktop-quickstart/)
    expect(prompt).toMatch(/not in the Bootstrap guide/)
    expect(prompt).toMatch(/cannot run commands/)
    expect(prompt).toMatch(/expected, not verified/)
  })

  test('tells the chat to ask one question at a time', () => {
    expect(prompt).toMatch(/one question at a time/i)
  })

  test('is written in English and tells the chat to be a friendly guide', () => {
    expect(prompt).toMatch(/INSTRUCTIONS FOR THE AI ASSISTANT/)
    expect(prompt).toMatch(/friendly/i)
    expect(prompt).not.toMatch(/Ställ bara en fråga|Du är en vänlig/)
  })

  test('opens by explaining the purpose, then asks the experience question first', () => {
    const start = prompt.slice(prompt.indexOf('\nSTART\n'), prompt.indexOf('MARKDOWN SNAPSHOT'))
    expect(start).toMatch(/purpose of Manfred Bootstrap/)
    expect(start).toMatch(/experience question/)
    expect(prompt).toMatch(/How comfortable are you setting up a repo/)
    expect(start).not.toMatch(/Understand Bootstrap: /)
    expect(prompt.indexOf('Experience.')).toBeLessThan(prompt.indexOf('Goal ('))
  })

  test('asks the goal second, with options and short descriptions, not an open question', () => {
    expect(prompt).toMatch(/Understand Bootstrap: /)
    expect(prompt).toMatch(/Start a new project: /)
    expect(prompt).toMatch(/Add it to an existing repo: /)
    expect(prompt).not.toMatch(/What do you want to do\?/)
  })

  test('adapts the language of the guidance to the experience level from then on', () => {
    expect(prompt).toMatch(/adapt your language to the experience level/i)
  })

  test('always establishes the experience level and the goal', () => {
    expect(prompt).toMatch(/Always establish the experience level and the goal/)
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

  test('uses the full plugin list when there is room, and the compact list when there is not', () => {
    const full = buildClaudePrompt({ maxChars: 100_000 })
    expect(full).toContain(PLUGINS_URL)
    expect(full).toContain('skills:')
    const compact = buildClaudePrompt({ maxChars: full.length - 1 })
    expect(compact.length).toBeLessThan(full.length)
    expect(compact).not.toContain('skills:')
    expect(compact).toContain(PLUGINS_URL)
  })

  test('throws if even the smallest context does not fit', () => {
    expect(() => buildClaudePrompt({ maxChars: 500 })).toThrow()
  })
})

describe('buildPromptExcerpt', () => {
  const prompt = buildClaudePrompt()
  const excerpt = buildPromptExcerpt(prompt)

  test('is the real start of the prompt, cut at a word, ending in an ellipsis', () => {
    expect(excerpt.endsWith('...')).toBe(true)
    expect(prompt.startsWith(excerpt.slice(0, -3))).toBe(true)
    expect(excerpt.length).toBeLessThan(prompt.length)
  })

  test('stays short enough for a preview box', () => {
    expect(excerpt.length).toBeLessThanOrEqual(260)
  })

  test('returns a short prompt unchanged', () => {
    expect(buildPromptExcerpt('short text')).toBe('short text')
  })
})
