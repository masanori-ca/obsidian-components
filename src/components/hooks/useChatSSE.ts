import { useState, useRef, useCallback } from 'react';
import { usePCKTenant } from '@/components/providers/PCKTenantProvider';
import type { ChatRequest } from '@/lib/pck-client';

export type ChatStage = 'idle' | 'extracting' | 'computing' | 'rendering' | 'done' | 'error';

export interface ChatIntent {
  topic_nodes: string[];
  question_type: string;
  what_if?: Record<string, number> | null;
}

export interface CausalContextSummary {
  nodes: number;
  constraints: number;
  safety_violations: number;
  cbf_blocks: number;
  tk_count: number;
  has_what_if: boolean;
  what_if_blocked?: boolean;
  dag_path: string[];
}

export interface ProofTrace {
  sources: Record<string, string>;
  judgments: Array<{ status: string; reason: string }>;
  constraints: Array<{ label: string; violated: boolean; description: string; severity?: string }>;
  cbf: Array<{ variable: string; status: string; description: string }>;
  dag: string[];
}

interface UseChatSSEReturn {
  stage: ChatStage;
  streamedText: string;
  intent: ChatIntent | null;
  causalContext: CausalContextSummary | null;
  proofTrace: ProofTrace | null;
  isStreaming: boolean;
  send: (request: ChatRequest) => void;
  abort: () => void;
}

/**
 * Hook for ProTwin2 3-stage SSE chat pipeline.
 * POST /api/protwin2/chat with SSE response.
 */
export function useChatSSE(): UseChatSSEReturn {
  const { baseUrl, tenant } = usePCKTenant();
  const [stage, setStage] = useState<ChatStage>('idle');
  const [streamedText, setStreamedText] = useState('');
  const [intent, setIntent] = useState<ChatIntent | null>(null);
  const [causalContext, setCausalContext] = useState<CausalContextSummary | null>(null);
  const [proofTrace, setProofTrace] = useState<ProofTrace | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
    setStage('idle');
  }, []);

  const send = useCallback(
    (request: ChatRequest) => {
      abort();

      setStreamedText('');
      setIntent(null);
      setCausalContext(null);
      setProofTrace(null);
      setStage('extracting');
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      fetch(`${baseUrl}/api/protwin2/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': tenant,
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      })
        .then(async (resp) => {
          if (!resp.ok) {
            throw new Error(`Chat request failed: ${resp.status}`);
          }

          const reader = resp.body?.getReader();
          if (!reader) throw new Error('No response body');

          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            let currentEvent = '';

            for (const line of lines) {
              if (line.startsWith('event: ')) {
                currentEvent = line.slice(7).trim();
              } else if (line.startsWith('data: ') && currentEvent) {
                const data = line.slice(6);
                try {
                  const parsed = JSON.parse(data);
                  switch (currentEvent) {
                    case 'stage':
                      setStage(parsed.stage as ChatStage);
                      break;
                    case 'intent':
                      setIntent(parsed as ChatIntent);
                      break;
                    case 'causal_context':
                      setCausalContext(parsed as CausalContextSummary);
                      break;
                    case 'pot':
                      setProofTrace(parsed as ProofTrace);
                      break;
                    case 'content':
                      setStreamedText((prev) => prev + parsed.text);
                      break;
                    case 'done':
                      setStage('done');
                      setIsStreaming(false);
                      break;
                  }
                } catch {
                  // skip malformed JSON
                }
                currentEvent = '';
              } else if (line === '') {
                currentEvent = '';
              }
            }
          }

          setIsStreaming(false);
          setStage((s) => (s === 'rendering' ? 'done' : s));
        })
        .catch((err) => {
          if (err instanceof DOMException && err.name === 'AbortError') return;
          console.error('Chat SSE error:', err);
          setStage('error');
          setIsStreaming(false);
        });
    },
    [baseUrl, tenant, abort],
  );

  return { stage, streamedText, intent, causalContext, proofTrace, isStreaming, send, abort };
}
