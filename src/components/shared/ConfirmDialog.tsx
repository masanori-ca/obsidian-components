import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Reusable confirmation dialog with danger/warning/default variants.
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = '確認',
  cancelLabel = 'キャンセル',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmColors = {
    danger:  { color: 'var(--obs-danger)', bg: 'var(--obs-danger-bg)' },
    warning: { color: 'var(--obs-warning)', bg: 'var(--obs-warning-bg)' },
    default: { color: 'var(--obs-accent)', bg: 'var(--obs-accent-bg)' },
  }[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'var(--obs-bg-overlay)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] max-w-[90vw] rounded-xl shadow-2xl z-50 p-5"
            style={{ backgroundColor: 'var(--obs-bg-secondary)', border: '1px solid var(--obs-border-primary)' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <h3 className="text-sm font-semibold obs-text-primary mb-2">{title}</h3>
            <p className="text-xs obs-text-tertiary mb-4">{message}</p>
            <div className="flex gap-2">
              <button
                onClick={onConfirm}
                className="flex-1 py-2 text-xs font-medium rounded-lg transition-opacity"
                style={{ color: confirmColors.color, backgroundColor: confirmColors.bg, border: `1px solid ${confirmColors.color}44` }}
              >
                {confirmLabel}
              </button>
              <button
                onClick={onCancel}
                className="flex-1 py-2 text-xs font-medium rounded-lg obs-text-tertiary transition-opacity"
                style={{ backgroundColor: 'var(--obs-bg-tertiary)', border: '1px solid var(--obs-border-primary)' }}
              >
                {cancelLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
