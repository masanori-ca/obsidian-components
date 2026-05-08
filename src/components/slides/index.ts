// Obsidian for PPT — Slide Components

// Design tokens
export { SLIDE, FONT, COLOR_SCHEMES, SPACING, SHADOW, LAYOUT, ACCENT_BAR, getSlideCSS } from './tokens';
export type { SlideColorScheme } from './tokens';

// Layout
export { SlideFrame } from './layout/SlideFrame';
export { SlideTitle } from './layout/SlideTitle';
export { SlideGrid } from './layout/SlideGrid';
export { SlideSplit } from './layout/SlideSplit';
export { SlideSection } from './layout/SlideSection';

// Data
export { SlideKpiCard } from './data/SlideKpiCard';
export { SlideKpiGrid } from './data/SlideKpiGrid';
export { SlideTable } from './data/SlideTable';

// Flow
export { SlideFlowPipeline } from './flow/SlideFlowPipeline';

// Comparison
export { SlideComparison } from './comparison/SlideComparison';

// Timeline
export { SlideTimeline } from './timeline/SlideTimeline';

// Decoration
export { SlideUseCaseCard } from './decoration/SlideUseCaseCard';

// Industrial
export { SlideSafetyBarrier } from './industrial/SlideSafetyBarrier';
