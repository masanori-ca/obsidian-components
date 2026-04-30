import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatSSE, type ChatStage } from '@/components/hooks/useChatSSE';
import { PCKChatMessage } from './PCKChatMessage';
import { ProofTraceDrawer } from './ProofTraceDrawer';
import { PersonaSelector } from './PersonaSelector';
import { ChatStageProgress } from './ChatStageProgress';
import { ChatSuggestionChips } from './ChatSuggestionChips';
import { InlineProofPreview } from './InlineProofPreview';
import type { ProofTrace } from '@/components/hooks/useChatSSE';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  firedNodes?: string[];
  proofTrace?: ProofTrace | null;
  timestamp: string;
}

interface PCKChatPanelProps {
  equipmentId: string;
  sessionId?: string;
  defaultPersonaId?: string;
  suggestions?: string[];
  className?: string;
}

const DEFAULT_SUGGESTIONS = [
  '現在の状態を教えて',
  '曝気量を30%削減したら？',
  'NH4が高い原因は？',
  '最適な運転パラメータは？',
  'CBF安全制約を確認',
];

/**
 * Full ProTwin2 chat panel with 3-stage progress, suggestion chips,
 * inline proof preview, and streaming response.
 */
export function PCKChatPanel({
  equipmentId,
  sessionId,
  defaultPersonaId,
  suggestions = DEFAULT_SUGGESTIONS,
  className = '',
}: PCKChatPanelProps) {
  const { stage, streamedText, intent, causalContext, proofTrace, isStreaming, send, abort } = useChatSSE();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [personaId, setPersonaId] = useState(defaultPersonaId);
  const [drawerTrace, setDrawerTrace] = useState<ProofTrace | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamedText]);

  useEffect(() => {
    if (stage === 'done' && streamedText) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: streamedText,
          firedNodes: intent?.topic_nodes,
          proofTrace,
          timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [stage, streamedText, intent, proofTrace]);

  const handleSend = useCallback((text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isStreaming) return;

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: 'user',
        content: msg,
        timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInput('');

    const history = messages.slice(-10).map((m) => ({ role: m.role, content: m.content }));
    send({ equipment_id: equipmentId, message: msg, session_id: sessionId, persona_id: personaId, history });
  }, [input, isStreaming, messages, equipmentId, sessionId, personaId, send]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showDrawer = (trace: ProofTrace | null) => {
    if (trace) { setDrawerTrace(trace); setIsDrawerOpen(true); }
  };

  const showSuggestions = messages.length === 0 && !isStreaming;

  return (
    <div className={`flex flex-col rounded-xl overflow-hidden ${className}`} style={{ border: '1px solid var(--obs-border-primary)', backgroundColor: 'var(--obs-bg-card)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid var(--obs-border-primary)', backgroundColor: 'var(--obs-bg-secondary)' }}>
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--obs-success)' }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <h3 className="text-sm font-semibold obs-text-primary">ProTwin2</h3>
          <span className="text-[10px] obs-text-muted">{equipmentId}</span>
        </div>
        <PersonaSelector selectedId={personaId} onSelect={(p) => setPersonaId(p.id)} />
      </div>

      {/* Stage progress */}
      <AnimatePresence>
        {isStreaming && <ChatStageProgress stage={stage} causalContext={causalContext} />}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[300px] max-h-[500px]">
        {/* Welcome state */}
        {messages.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--obs-accent-bg)' }}>
              <span className="text-xl" style={{ color: 'var(--obs-accent)' }}>P</span>
            </div>
            <h4 className="text-sm font-medium obs-text-primary mb-1">ProTwin2</h4>
            <p className="text-[11px] obs-text-muted text-center max-w-[280px]">
              PCK因果推論エンジンに質問してください。<br/>
              全回答にProof Trace（証跡）が付きます。
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id}>
            <PCKChatMessage
              role={msg.role}
              content={msg.content}
              firedNodes={msg.firedNodes}
              proofTrace={msg.proofTrace}
              onShowProofTrace={() => showDrawer(msg.proofTrace ?? null)}
              timestamp={msg.timestamp}
            />
            {msg.role === 'assistant' && msg.proofTrace && (
              <div className="ml-0 mt-1.5 max-w-[85%]">
                <InlineProofPreview proofTrace={msg.proofTrace} onExpand={() => showDrawer(msg.proofTrace ?? null)} />
              </div>
            )}
          </div>
        ))}

        {/* Streaming message */}
        {isStreaming && streamedText && (
          <PCKChatMessage role="assistant" content={streamedText} isStreaming firedNodes={intent?.topic_nodes} />
        )}

        {/* Loading dots */}
        {isStreaming && !streamedText && (stage as ChatStage) !== 'idle' && (
          <motion.div className="flex items-center gap-2 px-3 py-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--obs-accent)' }}
                  animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <ChatSuggestionChips suggestions={suggestions} onSelect={(s) => handleSend(s)} disabled={isStreaming} />
      )}

      {/* Input */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid var(--obs-border-primary)', backgroundColor: 'var(--obs-bg-secondary)' }}>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="質問を入力..."
            disabled={isStreaming}
            className="flex-1 px-3 py-2 text-sm rounded-lg obs-text-primary disabled:opacity-50 focus:outline-none"
            style={{ backgroundColor: 'var(--obs-bg-tertiary)', border: '1px solid var(--obs-border-secondary)' }}
          />
          {isStreaming ? (
            <button onClick={abort} className="px-3 py-2 text-xs font-medium rounded-lg"
              style={{ color: 'var(--obs-danger)', backgroundColor: 'var(--obs-danger-bg)', border: '1px solid var(--obs-danger)' }}>
              停止
            </button>
          ) : (
            <button onClick={() => handleSend()} disabled={!input.trim()}
              className="px-3 py-2 text-xs font-medium rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: 'var(--obs-accent)', backgroundColor: 'var(--obs-accent-bg)', border: '1px solid var(--obs-accent)' }}>
              送信
            </button>
          )}
        </div>
      </div>

      <ProofTraceDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} proofTrace={drawerTrace} />
    </div>
  );
}
