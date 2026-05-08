// Obsidian Components — PCK UI Component Library
// Phase 1: Foundation

// Providers
export { PCKTenantProvider, usePCKTenant } from './components/providers/PCKTenantProvider';
export { ThemeProvider, useTheme } from './components/providers/ThemeProvider';
export { ThemeToggle } from './components/providers/ThemeToggle';
export type { Theme } from './components/providers/ThemeProvider';

// Hooks
export { usePCKClient } from './components/hooks/usePCKClient';
export { useAlertSSE } from './components/hooks/useAlertSSE';
export { useChatSSE } from './components/hooks/useChatSSE';
export { useAutopilotWS } from './components/hooks/useAutopilotWS';

// Alert Components
export { ZoneIndicator } from './components/alert/ZoneIndicator';
export { EscalationTimeline } from './components/alert/EscalationTimeline';
export { AlertSSEProvider, useAlertContext } from './components/alert/AlertSSEProvider';
export { QuickCausePanel } from './components/alert/QuickCausePanel';
export { ActionResolvePanel } from './components/alert/ActionResolvePanel';

// Chat Components
export { PCKChatPanel } from './components/chat/PCKChatPanel';
export { PCKChatMessage } from './components/chat/PCKChatMessage';
export { ProofTraceDrawer } from './components/chat/ProofTraceDrawer';
export { PersonaSelector } from './components/chat/PersonaSelector';
export { ChatStageProgress } from './components/chat/ChatStageProgress';
export { ChatSuggestionChips } from './components/chat/ChatSuggestionChips';
export { InlineProofPreview } from './components/chat/InlineProofPreview';

// Chat Content Blocks
export { FormulaBlock } from './components/chat/blocks/FormulaBlock';
export { DeltaTable } from './components/chat/blocks/DeltaTable';
export { VariableChip } from './components/chat/blocks/VariableChip';
export { UnitStatusCard } from './components/chat/blocks/UnitStatusCard';
export { SafetyWarningBlock } from './components/chat/blocks/SafetyWarningBlock';
export { ComputeResultCard } from './components/chat/blocks/ComputeResultCard';
export { OptimizeResultCard } from './components/chat/blocks/OptimizeResultCard';
export { CausalPathInline } from './components/chat/blocks/CausalPathInline';
export { TKRuleCard } from './components/chat/blocks/TKRuleCard';
export { InlineChart } from './components/chat/blocks/InlineChart';

// Agent Components
export { AutopilotCyclePanel } from './components/agent/AutopilotCyclePanel';
export { AgentApprovalDialog } from './components/agent/AgentApprovalDialog';
export { AgentDecisionFlow } from './components/agent/AgentDecisionFlow';
export { AgentFeedbackCapture } from './components/agent/AgentFeedbackCapture';
export { AgentTaskMonitor } from './components/agent/AgentTaskMonitor';
export { WorkflowStep } from './components/agent/WorkflowStep';
export { CommandOutput } from './components/agent/CommandOutput';
export { SystemLog } from './components/agent/SystemLog';

// Brain Components
export { WhatIfSimulator } from './components/brain/WhatIfSimulator';
export { CBFBarrierStatus } from './components/brain/CBFBarrierStatus';
export { CausalDeltaOverlay } from './components/brain/CausalDeltaOverlay';

// Flow Components
export { PCKProcessFlow } from './components/flow/PCKProcessFlow';
export { CausalTraceHighlight } from './components/flow/CausalTraceHighlight';

// Icons - Unit
export {
  UnitIconWrapper,
  ReactorIcon,
  SettlerIcon,
  MembraneIcon,
  PumpIcon,
  AeratorIcon,
  TankIcon,
  STATE_COLORS,
} from './components/icons/units';
export type { UnitState, UnitIconProps } from './components/icons/units';

// Catalog Components
export { VariableSearchBar } from './components/catalog/VariableSearchBar';
export { DisciplineFilter } from './components/catalog/DisciplineFilter';
export { VariableBrowser } from './components/catalog/VariableBrowser';
export { VariableDetail } from './components/catalog/VariableDetail';
export { KnowledgeGraph } from './components/catalog/KnowledgeGraph';
export type { CatalogVariable } from './components/catalog/VariableBrowser';

// Equation Components
export { EquationBrowser } from './components/equation/EquationBrowser';
export { EquationDetail } from './components/equation/EquationDetail';
export { DependencyGraph } from './components/equation/DependencyGraph';
export type { CatalogEquation } from './components/equation/EquationBrowser';

// TK Components
export { TKRuleList } from './components/tk/TKRuleList';
export { TKRuleEditor } from './components/tk/TKRuleEditor';
export type { TKRule } from './components/tk/TKRuleList';

// Baseline Components
export { BaselineVersionList } from './components/baseline/BaselineVersionList';
export { BaselineComparison } from './components/baseline/BaselineComparison';
export { ThresholdEditor } from './components/baseline/ThresholdEditor';
export type { BaselineVersion } from './components/baseline/BaselineVersionList';

// Device Components
export { DeviceConnectionPanel } from './components/device/DeviceConnectionPanel';
export { TagMappingEditor } from './components/device/TagMappingEditor';
export { LiveDataIndicator } from './components/device/LiveDataIndicator';
export type { DeviceConnection, ProtocolType } from './components/device/DeviceConnectionPanel';

// Map Components
export { PlantMap } from './components/map/PlantMap';
export { PlantMapMarker } from './components/map/PlantMapMarker';
export { PlantMapCluster } from './components/map/PlantMapCluster';
export type { PlantMarkerData } from './components/map/PlantMapMarker';

// Icons - Flow
export { FlowArrow } from './components/icons/flow/FlowArrow';
export { PipeConnector } from './components/icons/flow/PipeConnector';

// Icons - Brain
export { BrainServiceIcon } from './components/icons/brain/BrainServiceIcon';

// Icons - Safety
export { SafetyIcon } from './components/icons/safety/SafetyIcons';

// Shared UI
export { SensorGauge } from './components/shared/SensorGauge';
export { SparklineChart } from './components/shared/SparklineChart';
export { StatusBadge } from './components/shared/StatusBadge';
export { DataTable } from './components/shared/DataTable';
export { ConfirmDialog } from './components/shared/ConfirmDialog';
export { LoadingOverlay } from './components/shared/LoadingOverlay';
export { Button } from './components/shared/Button';
export { Input } from './components/shared/Input';
export { NumberBadge } from './components/shared/NumberBadge';
export { ZoneDistributionBar } from './components/shared/ZoneDistributionBar';
export { DonutGauge } from './components/shared/DonutGauge';
export { Sidebar } from './components/shared/Sidebar';
export { Card } from './components/shared/Card';
export { ToastContainer, useToast } from './components/shared/Toast';
export { Tabs } from './components/shared/Tabs';
export { Toggle } from './components/shared/Toggle';
export { Dropdown } from './components/shared/Dropdown';

// SDK
export { PCKClient } from './lib/pck-client';

// Types
export type {
  DeviationResult,
  EscalationSeverity,
  QuickCause,
  AlertEvaluateResponse,
  ActionRecommendation,
  ActionResolveResponse,
  WhatIfDelta,
  WhatIfResponse,
  CBFViolation,
  CBFVerifyResponse,
  AutopilotCycleResult,
  ChatRequest,
  SurrogatePredict,
} from './lib/pck-client';

export type {
  AlertSSEStatus,
} from './components/hooks/useAlertSSE';

export type {
  ChatStage,
  ChatIntent,
  CausalContextSummary,
  ProofTrace,
} from './components/hooks/useChatSSE';

export type {
  WSStatus,
} from './components/hooks/useAutopilotWS';

export type {
  Zone,
} from './components/alert/ZoneIndicator';

// Slide Components (PPT)
export {
  SLIDE, FONT, COLOR_SCHEMES, SPACING, SHADOW, LAYOUT, ACCENT_BAR, getSlideCSS,
  SlideFrame, SlideTitle, SlideGrid, SlideSplit, SlideSection,
  SlideKpiCard, SlideKpiGrid, SlideTable,
  SlideFlowPipeline, SlideComparison, SlideTimeline,
  SlideUseCaseCard, SlideSafetyBarrier,
} from './components/slides';
export type { SlideColorScheme } from './components/slides';
