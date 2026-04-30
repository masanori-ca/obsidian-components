# Obsidian Components

Industrial AI UI component library for the [PCK (Process Causal Knowledge)](https://github.com/masanori-ca/pck) platform.

React + TypeScript + Tailwind CSS + Framer Motion. Day/Night theme support.

## Quick Start

```bash
npm install obsidian-components
```

```tsx
import { PCKTenantProvider, ThemeProvider, ZoneIndicator, ReactorIcon } from 'obsidian-components';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <PCKTenantProvider baseUrl="http://localhost:8080" tenant="kurita">
        <ZoneIndicator zone="WW" deviationPct={15.2} variable="CSTR6_DO" />
        <ReactorIcon state="warning" size={80} label="CSTR6" />
      </PCKTenantProvider>
    </ThemeProvider>
  );
}
```

## Storybook

```bash
git clone https://github.com/masanori-ca/obsidian-components.git
cd obsidian-components
npm install
npx storybook dev -p 6006
```

## Components (63)

### Providers & Hooks

| Component | Description |
|---|---|
| `PCKTenantProvider` | PCK tenant context (baseUrl + X-Tenant-ID) |
| `ThemeProvider` | Day/Night/System theme with CSS variables |
| `ThemeToggle` | Theme switch button |
| `usePCKClient` | PCKClient instance hook |
| `useAlertSSE` | Alert SSE stream with auto-reconnect |
| `useChatSSE` | ProTwin2 3-stage SSE chat pipeline |
| `useAutopilotWS` | WebSocket for Brain autopilot + What-If |

### Alert (5)

Real-time alert monitoring with PCK's 5-zone / 4-level escalation system.

| Component | Description |
|---|---|
| `ZoneIndicator` | 5-level zone badge: N / W / WW / H / C |
| `EscalationTimeline` | 4-level state machine: L1 → L2 → L3 → L4 |
| `AlertSSEProvider` | Alert SSE context for child components |
| `QuickCausePanel` | Surrogate sensitivity analysis results |
| `ActionResolvePanel` | Remediation action recommendations |

### Chat (4)

ProTwin2 AI conversation with Proof Trace (Provenance of Thought).

| Component | Description |
|---|---|
| `PCKChatPanel` | Full chat UI with SSE streaming |
| `PCKChatMessage` | Message bubble with fired nodes |
| `ProofTraceDrawer` | PoT drawer: sources, CBF, constraints, DAG |
| `PersonaSelector` | Agent persona picker |

### Agent (5)

Brain Autopilot 5-phase cycle with operator approval.

| Component | Description |
|---|---|
| `AutopilotCyclePanel` | Monitor → Diagnose → Predict → Optimize → Control |
| `AgentApprovalDialog` | Action approval with CBF status |
| `AgentDecisionFlow` | Sense → Diagnose → Decide → Act → Learn flow |
| `AgentFeedbackCapture` | Post-action feedback → TK learning |
| `AgentTaskMonitor` | A2A task lifecycle monitor |

### Brain (3)

Causal inference visualization and What-If simulation.

| Component | Description |
|---|---|
| `WhatIfSimulator` | Interactive parameter sliders → chain/what-if |
| `CBFBarrierStatus` | 3-layer safety barrier (L1/L2/L3) |
| `CausalDeltaOverlay` | What-If deltas overlaid on process flow |

### Flow (2)

Process topology from PCK Flow Service DAG.

| Component | Description |
|---|---|
| `PCKProcessFlow` | Unit DAG with zone coloring + causal trace |
| `CausalTraceHighlight` | Upstream causal path chain |

### Catalog (5)

Browse PCK's 87,170 universal variables across 18 disciplines.

| Component | Description |
|---|---|
| `VariableSearchBar` | Typeahead search with Catalog API |
| `DisciplineFilter` | Multi-select discipline filter |
| `VariableBrowser` | Scrollable variable list |
| `VariableDetail` | Variable metadata + related equations |
| `KnowledgeGraph` | Interactive variable/equation network |

### Equation (3)

PCK Equation Registry with 315+ evaluable formulas.

| Component | Description |
|---|---|
| `EquationBrowser` | Searchable equation list |
| `EquationDetail` | Formula display with I/O variables |
| `DependencyGraph` | Equation dependency DAG |

### TK - Tacit Knowledge (2)

Expert knowledge rule management.

| Component | Description |
|---|---|
| `TKRuleList` | IF/THEN rules with confidence + source |
| `TKRuleEditor` | Create/edit TK rules |

### Baseline (3)

Baseline version management and threshold editing.

| Component | Description |
|---|---|
| `BaselineVersionList` | Version history with activate/compare |
| `BaselineComparison` | Side-by-side version diff |
| `ThresholdEditor` | Per-variable LL/L/H/HH threshold editor |

### Device (3)

OPC-UA / Modbus / MQTT device connectivity.

| Component | Description |
|---|---|
| `DeviceConnectionPanel` | Multi-protocol connection manager |
| `TagMappingEditor` | SCADA tag → PCK variable mapping |
| `LiveDataIndicator` | Real-time data flow indicator |

### Map (3)

Plant location visualization with Leaflet.

| Component | Description |
|---|---|
| `PlantMap` | Leaflet map with status markers |
| `PlantMapMarker` | Animated status marker |
| `PlantMapCluster` | Multi-plant cluster with status ring |

### Icons - Animated Unit Icons (11)

Process unit icons with state-driven animations (normal/stopped/warning/high/critical/blocked).

| Icon | Animation |
|---|---|
| `ReactorIcon` | Bubbling + agitator rotation |
| `SettlerIcon` | Particle settling |
| `MembraneIcon` | Filtration flow |
| `PumpIcon` | Impeller rotation |
| `AeratorIcon` | Rising bubbles + fan |
| `TankIcon` | Liquid level oscillation |
| `HeatExchangerIcon` | Hot/cold stream flow |
| `FilterIcon` | Particle trapping |
| `ValveIcon` | Open/close + flow |
| `MixerIcon` | Paddle rotation + vortex |
| `InfluentEffluentIcon` | Directional flow arrow |

### Icons - Conceptual (3 sets)

| Set | Icons |
|---|---|
| `BrainServiceIcon` | brain, causal, equation, compile, grow, whatif, optimize, autopilot, proof |
| `SafetyIcon` | cbf-shield, barrier-l1, barrier-l2, barrier-l3, escalation |
| `FlowArrow` / `PipeConnector` | Animated directional arrows + pipe junctions |

### Shared UI (6)

| Component | Description |
|---|---|
| `SensorGauge` | Radial gauge with threshold coloring |
| `SparklineChart` | Compact trend line with thresholds |
| `StatusBadge` | Status indicator with pulse animation |
| `DataTable` | Sortable table with selection |
| `ConfirmDialog` | Confirmation modal (danger/warning/default) |
| `LoadingOverlay` | Loading state (spinner/dots/bar) |

## Theming

All components support Day/Night mode via CSS custom properties:

```tsx
<ThemeProvider defaultTheme="system">
  <App />
</ThemeProvider>
```

Toggle programmatically:

```tsx
const { toggleTheme, resolvedTheme } = useTheme();
```

### Design Tokens

```css
--obs-bg-primary       /* Page background */
--obs-bg-secondary     /* Card background */
--obs-text-primary     /* Primary text */
--obs-text-secondary   /* Secondary text */
--obs-text-muted       /* Muted text */
--obs-border-primary   /* Primary border */
--obs-success          /* Normal / success */
--obs-warning          /* Warning state */
--obs-danger           /* Critical / error */
--obs-accent           /* Interactive elements */
--obs-zone-n/w/ww/h/c  /* PCK Alert zones */
```

## PCK Integration

This library connects to the PCK platform (21 microservices) via Kong API Gateway:

```
PCK Services → Kong (:8080) → Obsidian Components
```

Key APIs consumed:
- `POST /api/brain/chain/what-if` — Causal What-If simulation
- `POST /api/brain/autopilot/cycle` — 5-phase autonomous cycle
- `POST /api/alert/evaluate` — 5-zone alert evaluation
- `GET /api/alert/stream` — SSE alert stream
- `POST /api/protwin2/chat` — 3-stage SSE AI conversation
- `POST /api/action/resolve` — Remediation actions
- `POST /api/safety/verify` — CBF 3-layer safety barrier
- `GET /api/catalog/search` — Variable catalog search

## Architecture

```
obsidian-components/
├── src/
│   ├── components/
│   │   ├── providers/    Context providers
│   │   ├── hooks/        PCK connection hooks
│   │   ├── alert/        Alert → Action escalation
│   │   ├── chat/         ProTwin2 AI conversation
│   │   ├── agent/        Brain Autopilot interaction
│   │   ├── brain/        Causal inference visualization
│   │   ├── flow/         Process flow topology
│   │   ├── catalog/      Variable catalog browser
│   │   ├── equation/     Equation registry
│   │   ├── tk/           Tacit knowledge editor
│   │   ├── baseline/     Baseline management
│   │   ├── device/       Device connectivity
│   │   ├── map/          Plant location map
│   │   ├── icons/        Animated industrial icons
│   │   └── shared/       Reusable UI primitives
│   ├── styles/
│   │   └── globals.css   Day/Night CSS tokens
│   └── lib/
│       └── pck-client.ts TypeScript SDK
└── .storybook/           Storybook configuration
```

## License

MIT
