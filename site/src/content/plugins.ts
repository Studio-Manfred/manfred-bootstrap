export type Plugin = {
  slug: string;
  pitch: string;
  skills: readonly string[]; // kebab-case, no slash
  commands: readonly string[]; // slash-prefixed, e.g. "/kickoff"
  group: 'design' | 'engineering' | 'knowledge';
};

export const PLUGINS: Plugin[] = [
  {
    slug: 'manfred-design-ops',
    pitch: 'Handoffs, reviews, sprints, team rituals, version control.',
    skills: ['handoff-spec', 'design-critique', 'design-qa-checklist', 'design-review-process', 'design-sprint-plan', 'team-workflow', 'version-control-strategy'],
    commands: ['/handoff', '/plan-sprint', '/setup-workflow'],
    group: 'design',
  },
  {
    slug: 'manfred-design-research',
    pitch: 'Interviews, synthesis, archetypes, journeys, usability tests.',
    skills: ['interview-script', 'summarize-interview', 'affinity-diagram', 'card-sort-analysis', 'diary-study-plan', 'empathy-map', 'jobs-to-be-done', 'usability-test-plan', 'journey-map', 'user-archetype', 'transcript-anonymizer'],
    commands: ['/discover', '/interview', '/synthesize', '/test-plan'],
    group: 'design',
  },
  {
    slug: 'manfred-design-systems',
    pitch: 'Build on Manfred\'s design system — tokens, components, a11y.',
    skills: ['design-token', 'component-spec', 'documentation-template', 'icon-system', 'naming-convention', 'pattern-library', 'theming-system', 'a11y-design', 'a11y-dev', 'a11y-qa'],
    commands: ['/audit-system', '/create-component', '/tokenize'],
    group: 'design',
  },
  {
    slug: 'manfred-dev',
    pitch: 'Ship Vite/React features (pre-merge QA, deploy, release) and bootstrap new Manfred projects or install the plugin marketplace.',
    skills: ['test-my-code', 'deploy', 'release', 'bootstrap-manfred-project', 'install-manfred-claude-skills'],
    commands: [],
    group: 'engineering',
  },
  {
    slug: 'manfred-discovery',
    pitch: 'Shape product opportunities and run continuous discovery.',
    skills: ['cagan-risks', 'opportunity-solution-tree', 'assumption-test', 'customer-touchpoint-plan', 'product-brief', 'discovery-readout', 'discovery-rituals'],
    commands: ['/kickoff', '/weekly', '/risk-check'],
    group: 'design',
  },
  {
    slug: 'manfred-interaction-design',
    pitch: 'Motion, feedback, gestures, loading, errors, state.',
    skills: ['animation-principles', 'error-handling-ux', 'feedback-patterns', 'gesture-patterns', 'loading-states', 'micro-interaction-spec', 'state-machine'],
    commands: ['/design-interaction', '/error-flow', '/map-states'],
    group: 'design',
  },
  {
    slug: 'manfred-knowledge',
    pitch: 'Obsidian vault linting, batch Markdown conversion, marketplace QA.',
    skills: ['markitdown-convert', 'clippings-linter', 'lint-marketplace'],
    commands: [],
    group: 'knowledge',
  },
  {
    slug: 'manfred-prototyping-testing',
    pitch: 'Choose how to test or prototype — click, A/B, heuristic, flows.',
    skills: ['a-b-test-design', 'accessibility-test-plan', 'click-test-plan', 'heuristic-evaluation', 'prototype-strategy', 'test-scenario', 'user-flow-diagram', 'wireframe-spec'],
    commands: ['/evaluate', '/experiment', '/prototype-plan', '/test-plan'],
    group: 'design',
  },
  {
    slug: 'manfred-toolkit',
    pitch: 'UX copy, case studies, rationales, presentations, DS adoption.',
    skills: ['ux-writing', 'case-study', 'design-rationale', 'design-system-adoption', 'design-token-audit', 'meeting-summary', 'presentation-deck', 'linkedin-reflect', 'linkedin-show-and-tell', 'linkedin-teach'],
    commands: ['/build-presentation', '/write-case-study', '/write-rationale'],
    group: 'design',
  },
  {
    slug: 'manfred-ui-design',
    pitch: 'Layout, colour, type, responsive, dark mode, data viz.',
    skills: ['color-system', 'dark-mode-design', 'data-visualization', 'illustration-style', 'layout-grid', 'responsive-design', 'spacing-system', 'typography-scale', 'visual-hierarchy'],
    commands: ['/color-palette', '/design-screen', '/responsive-audit', '/type-system'],
    group: 'design',
  },
  {
    slug: 'manfred-ux-strategy',
    pitch: 'Strategic direction: principles, vision, briefs, prioritisation.',
    skills: ['design-principles', 'north-star-vision', 'competitive-analysis', 'design-brief', 'experience-map', 'metrics-definition', 'opportunity-framework', 'stakeholder-alignment'],
    commands: ['/benchmark', '/frame-problem', '/strategize'],
    group: 'design',
  },
];
