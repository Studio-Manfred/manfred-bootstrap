export type Plugin = {
  slug: string;
  pitch: string;
  skills: number;
  commands: number;
  group: 'design' | 'engineering' | 'knowledge';
};

export const PLUGINS: Plugin[] = [
  {
    slug: 'manfred-design-ops',
    pitch: 'Handoffs, reviews, sprints, team rituals, version control.',
    skills: 7,
    commands: 3,
    group: 'design',
  },
  {
    slug: 'manfred-design-research',
    pitch: 'Interviews, synthesis, archetypes, journeys, usability tests.',
    skills: 11,
    commands: 4,
    group: 'design',
  },
  {
    slug: 'manfred-design-systems',
    pitch: 'Build on Manfred\'s design system — tokens, components, a11y.',
    skills: 10,
    commands: 3,
    group: 'design',
  },
  {
    slug: 'manfred-dev',
    pitch: 'Ship Vite/React features with pre-merge QA and release flow.',
    skills: 3,
    commands: 0,
    group: 'engineering',
  },
  {
    slug: 'manfred-discovery',
    pitch: 'Shape product opportunities and run continuous discovery.',
    skills: 7,
    commands: 3,
    group: 'design',
  },
  {
    slug: 'manfred-interaction-design',
    pitch: 'Motion, feedback, gestures, loading, errors, state.',
    skills: 7,
    commands: 3,
    group: 'design',
  },
  {
    slug: 'manfred-knowledge',
    pitch: 'Obsidian vault linting, batch Markdown conversion, marketplace QA.',
    skills: 3,
    commands: 0,
    group: 'knowledge',
  },
  {
    slug: 'manfred-prototyping-testing',
    pitch: 'Choose how to test or prototype — click, A/B, heuristic, flows.',
    skills: 8,
    commands: 4,
    group: 'design',
  },
  {
    slug: 'manfred-toolkit',
    pitch: 'UX copy, case studies, rationales, presentations, DS adoption.',
    skills: 10,
    commands: 3,
    group: 'design',
  },
  {
    slug: 'manfred-ui-design',
    pitch: 'Layout, colour, type, responsive, dark mode, data viz.',
    skills: 9,
    commands: 4,
    group: 'design',
  },
  {
    slug: 'manfred-ux-strategy',
    pitch: 'Strategic direction: principles, vision, briefs, prioritisation.',
    skills: 8,
    commands: 3,
    group: 'design',
  },
];
