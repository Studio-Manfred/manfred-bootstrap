import { PLUGINS } from '../src/content/plugins';

test('has exactly 11 plugins', () => {
  expect(PLUGINS).toHaveLength(11);
});

test('includes all expected slugs', () => {
  const slugs = PLUGINS.map(p => p.slug).sort();
  expect(slugs).toEqual([
    'manfred-design-ops', 'manfred-design-research', 'manfred-design-systems',
    'manfred-dev', 'manfred-discovery', 'manfred-interaction-design',
    'manfred-knowledge', 'manfred-prototyping-testing', 'manfred-toolkit',
    'manfred-ui-design', 'manfred-ux-strategy',
  ]);
});

test('every plugin has pitch and group', () => {
  for (const p of PLUGINS) {
    expect(p.pitch.length).toBeGreaterThan(0);
    expect(['design', 'engineering', 'knowledge']).toContain(p.group);
  }
});

test('skills are kebab-case names and commands are slash-prefixed kebab-case', () => {
  for (const p of PLUGINS) {
    expect(Array.isArray(p.skills)).toBe(true);
    expect(Array.isArray(p.commands)).toBe(true);
    for (const s of p.skills) expect(s).toMatch(/^[a-z0-9-]+$/);
    for (const c of p.commands) expect(c).toMatch(/^\/[a-z0-9-]+$/);
  }
});
