import { motion } from 'framer-motion';

interface ChatSuggestionChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  disabled?: boolean;
}

/**
 * Suggestion chips shown above the chat input.
 * Provides quick-access to common queries and What-If scenarios.
 */
export function ChatSuggestionChips({ suggestions, onSelect, disabled = false }: ChatSuggestionChipsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex gap-1.5 flex-wrap px-4 py-2" style={{ borderTop: '1px solid var(--obs-border-subtle)' }}>
      {suggestions.map((s, idx) => (
        <motion.button
          key={s}
          onClick={() => !disabled && onSelect(s)}
          disabled={disabled}
          className="px-2.5 py-1 text-[10px] rounded-full transition-colors disabled:opacity-30"
          style={{
            backgroundColor: 'var(--obs-bg-tertiary)',
            border: '1px solid var(--obs-border-secondary)',
            color: 'var(--obs-text-tertiary)',
          }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          whileHover={!disabled ? { scale: 1.02, backgroundColor: 'var(--obs-accent-bg)' } : {}}
        >
          {s}
        </motion.button>
      ))}
    </div>
  );
}
