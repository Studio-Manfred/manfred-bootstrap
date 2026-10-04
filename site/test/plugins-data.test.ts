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

test('every plugin has pitch, skills count, commands count, group', () => {
  for (const p of PLUGINS) {
    expect(p.pitch.length).toBeGreaterThan(0);
    expect(p.skills).toBeGreaterThan(0);
    expect(['design', 'engineering', 'knowledge']).toContain(p.group);
  }
});
