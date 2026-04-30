/**
 * PCK TypeScript SDK — browser client for the PCK causal engine.
 *
 * Based on C:\PCK\sdk\js\pck-client.js, rewritten in TypeScript
 * with full type definitions for all PCK service APIs.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DeviationResult {
  variable: string;
  baseline: number;
  actual: number;
  deviation_pct: number;
  zone: 'N' | 'W' | 'WW' | 'H' | 'C';
}

export interface EscalationSeverity {
  current_level: number;
  previous_level: number;
  consecutive_violations: number;
  consecutive_compliant: number;
  escalated: boolean;
}

export interface QuickCause {
  cause_variable: string;
  deviation_pct: number;
  if_reset_to_baseline: number;
}

export interface AlertEvaluateResponse {
  checks: DeviationResult[];
  overall_level: 'N' | 'W' | 'WW' | 'H' | 'C';
  severity: EscalationSeverity;
  baseline_version_id?: string;
  remediation?: ActionResolveResponse;
  quick_causes: QuickCause[];
  cbf_violations: CBFViolation[];
  causal_impact?: {
    deltas_count: number;
    deltas: Record<string, WhatIfDelta>;
    cbf_from_brain?: CBFVerifyResponse;
  };
  missing_variables: string[];
}

export interface ActionRecommendation {
  action_type: string;
  target_variable: string;
  parameters: Record<string, unknown>;
  priority: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
}

export interface ActionResolveResponse {
  profile?: Record<string, unknown>;
  recommended_action?: string;
  actions: ActionRecommendation[];
  scenarios: Record<string, unknown>[];
  message: string;
}

export interface WhatIfDelta {
  baseline: number;
  what_if: number;
  delta: number;
  delta_pct: number;
}

export interface WhatIfResponse {
  status: string;
  overrides: Record<string, number>;
  deltas_count: number;
  deltas: Record<string, WhatIfDelta>;
  cbf?: CBFVerifyResponse;
  baseline_summary?: Record<string, unknown>;
  whatif_summary?: Record<string, unknown>;
}

export interface CBFViolation {
  variable: string;
  layer: string;
  operator: string;
  threshold: number;
  actual: number;
  description?: string;
}

export interface CBFVerifyResponse {
  passed: boolean;
  violations: CBFViolation[];
}

export interface AutopilotCycleResult {
  cycle_id: string;
  timestamp: string;
  elapsed_ms: number;
  overall_zone: string;
  deviations: DeviationResult[];
  critical_count: number;
  warning_count: number;
  diagnoses?: Record<string, unknown>;
  predictions?: Record<string, unknown>;
  early_warnings?: Record<string, unknown>[];
  top_scenario?: Record<string, unknown>;
  scenarios_evaluated?: number;
  actions?: ActionRecommendation[];
}

export interface ChatRequest {
  equipment_id: string;
  message: string;
  session_id?: string;
  persona_id?: string;
  persona_name?: string;
  history?: Array<{ role: string; content: string }>;
}

export interface SurrogatePredict {
  predictions: Record<string, number>;
  algorithm: string;
  execution_time_ms: number;
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export class PCKClient {
  readonly baseUrl: string;
  readonly tenant: string;

  constructor(baseUrl = 'http://localhost:8080', tenant = 'kurita') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.tenant = tenant;
  }

  private async _fetch<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
    const { method = 'GET', body } = options;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Tenant-ID': this.tenant,
    };
    const resp = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!resp.ok) {
      throw new Error(`PCK ${method} ${path} failed: ${resp.status} ${await resp.text()}`);
    }
    return resp.json() as Promise<T>;
  }

  // -- Brain ------------------------------------------------------------------

  chainEvaluate(siteId: string, stateVector: Record<string, number>) {
    return this._fetch<Record<string, unknown>>('/api/brain/chain/evaluate', {
      method: 'POST',
      body: { site_id: siteId, initial_state_vector: stateVector },
    });
  }

  whatIf(siteId: string, baseState: Record<string, number>, overrides: Record<string, number>) {
    return this._fetch<WhatIfResponse>('/api/brain/chain/what-if', {
      method: 'POST',
      body: { site_id: siteId, base_state: baseState, overrides },
    });
  }

  optimize(
    siteId: string,
    baseState: Record<string, number>,
    targets: Array<{ variable: string; operator: string; target_value: number }>,
    tunableParams: string[] = [],
    paramBounds: Record<string, [number, number]> = {},
  ) {
    return this._fetch<Record<string, unknown>>('/api/brain/agent/optimize', {
      method: 'POST',
      body: { site_id: siteId, base_state: baseState, targets, tunable_params: tunableParams, param_bounds: paramBounds },
    });
  }

  autopilotCycle(siteId: string, stateVector: Record<string, number>, includePredict = true, includeOptimize = true) {
    return this._fetch<AutopilotCycleResult>('/api/brain/autopilot/cycle', {
      method: 'POST',
      body: { site_id: siteId, state_vector: stateVector, include_predict: includePredict, include_optimize: includeOptimize },
    });
  }

  // -- Alert ------------------------------------------------------------------

  alertEvaluate(projectId: string, stateVector: Record<string, number>, specification?: Record<string, number>) {
    return this._fetch<AlertEvaluateResponse>('/api/alert/evaluate', {
      method: 'POST',
      body: { project_id: projectId, state_vector: stateVector, specification },
    });
  }

  alertStatus() {
    return this._fetch<{ level: number; zone: string }>('/api/alert/status');
  }

  alertHistory() {
    return this._fetch<Array<Record<string, unknown>>>('/api/alert/history');
  }

  // -- Action -----------------------------------------------------------------

  actionResolve(siteId: string, severityLevel: number, deviations: DeviationResult[]) {
    return this._fetch<ActionResolveResponse>('/api/action/resolve', {
      method: 'POST',
      body: { site_id: siteId, severity_level: severityLevel, deviations },
    });
  }

  actionExecute(actionId: string, inputData: Record<string, unknown> = {}) {
    return this._fetch<Record<string, unknown>>(`/api/action/execute/${actionId}`, {
      method: 'POST',
      body: { input_data: inputData },
    });
  }

  // -- CBF --------------------------------------------------------------------

  verifySafety(values: Record<string, number>) {
    return this._fetch<CBFVerifyResponse>('/api/safety/verify', {
      method: 'POST',
      body: { values },
    });
  }

  // -- Surrogate --------------------------------------------------------------

  surrogatePredict(modelId: string, inputs: Record<string, number>) {
    return this._fetch<SurrogatePredict>('/api/surrogate/predict', {
      method: 'POST',
      body: { model_id: modelId, inputs },
    });
  }

  // -- Catalog ----------------------------------------------------------------

  searchVariables(q: string, limit = 20) {
    return this._fetch<Record<string, unknown>>(`/api/catalog/search?q=${encodeURIComponent(q)}&limit=${limit}`);
  }

  // -- ProTwin2 Chat ----------------------------------------------------------

  chatSSE(_request: ChatRequest): EventSource {
    // SSE via POST requires fetch + ReadableStream (EventSource only supports GET).
    // Callers should use useChatSSE hook instead.
    throw new Error('Use useChatSSE hook for streaming chat. This method is not supported directly.');
  }

  chatSessionCreate(equipmentId?: string, personaId?: string) {
    return this._fetch<{ session_id: string; status: string }>('/api/protwin2/sessions', {
      method: 'POST',
      body: { equipment_id: equipmentId, persona_id: personaId },
    });
  }

  chatSessionGet(sessionId: string) {
    return this._fetch<Record<string, unknown>>(`/api/protwin2/sessions/${sessionId}`);
  }

  chatSessionMessages(sessionId: string, message: { role: string; content: string; fired_nodes?: string[]; causal_context?: Record<string, unknown> }) {
    return this._fetch<{ message_id: string }>(`/api/protwin2/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: message,
    });
  }

  potGet(messageId: string) {
    return this._fetch<Record<string, unknown>>(`/api/protwin2/pot/${messageId}`);
  }

  personas() {
    return this._fetch<{ personas: Array<Record<string, unknown>>; count: number }>('/api/protwin2/personas');
  }

  // -- Alert SSE Stream -------------------------------------------------------

  alertStream(onAlert: (data: Record<string, unknown>) => void): EventSource {
    const es = new EventSource(`${this.baseUrl}/api/alert/stream`);
    es.addEventListener('alert', (e) => onAlert(JSON.parse(e.data)));
    es.addEventListener('heartbeat', () => { /* keep-alive */ });
    return es;
  }
}
