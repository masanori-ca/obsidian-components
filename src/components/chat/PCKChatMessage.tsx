import { motion } from 'framer-motion';
import type { ProofTrace } from '@/components/hooks/useChatSSE';

interface PCKChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  proofTrace?: ProofTrace | null;
  onShowProofTrace?: () => void;
  firedNodes?: string[];
  timestamp?: string;
}

/**
 * Single chat message bubble for ProTwin2 conversation.
 * Assistant messages show data source labels and proof trace link.
 */
export function PCKChatMessage({
  role,
  content,
  isStreaming = false,
  proofTrace,
  onShowProofTrace,
  firedNodes,
  timestamp,
}: PCKChatMessageProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`max-w-[85%] ${isUser ? 'order-1' : 'order-0'}`}>
        {/* Message bubble */}
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-sky-500/20 obs-text-primary rounded-br-md'
              : 'obs-bg-secondary/70 obs-text-primary border obs-border-primary rounded-bl-md'
          }`}
        >
          {content}
          {isStreaming && (
            <motion.span
              className="inline-block w-1.5 h-4 ml-0.5 bg-sky-400 rounded-sm"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          )}
        </div>

        {/* Assistant metadata */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-1.5 px-1">
            {timestamp && (
              <span className="text-[10px] obs-text-muted">{timestamp}</span>
            )}

            {/* Fired nodes */}
            {firedNodes && firedNodes.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                {firedNodes.slice(0, 5).map((node) => (
                  <span
                    key={node}
                    className="px-1.5 py-0.5 text-[9px] font-mono rounded obs-bg-secondary border obs-border-primary obs-text-tertiary"
                  >
                    {node}
                  </span>
                ))}
                {firedNodes.length > 5 && (
                  <span className="text-[9px] obs-text-muted">
                    +{firedNodes.length - 5}
                  </span>
                )}
              </div>
            )}

            {/* Proof trace link */}
            {proofTrace && onShowProofTrace && (
              <button
                onClick={onShowProofTrace}
                className="text-[10px] text-sky-400 hover:text-sky-300 transition-colors"
              >
                証跡を見る
              </button>
            )}
          </div>
        )}

        {/* User timestamp */}
        {isUser && timestamp && (
          <div className="text-right mt-1 px-1">
            <span className="text-[10px] obs-text-muted">{timestamp}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
