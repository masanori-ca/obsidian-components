import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

type ToastType = 'success' | 'warning' | 'error' | 'info';

interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'bottom-right' | 'top-center';
}

const TYPE_STYLES: Record<ToastType, { color: string; bg: string; icon: string }> = {
  success: { color: 'var(--obs-status-success)', bg: 'var(--obs-status-successBg)', icon: '✓' },
  warning: { color: 'var(--obs-status-warning)', bg: 'var(--obs-status-warningBg)', icon: '!' },
  error:   { color: 'var(--obs-status-danger)',  bg: 'var(--obs-status-dangerBg)',  icon: '✗' },
  info:    { color: 'var(--obs-status-info)',     bg: 'var(--obs-status-infoBg)',    icon: 'i' },
};

const POSITION_CLASSES: Record<string, string> = {
  'top-right': 'fixed top-4 right-4',
  'bottom-right': 'fixed bottom-4 right-4',
  'top-center': 'fixed top-4 left-1/2 -translate-x-1/2',
};

/**
 * Toast notification container and individual toast component.
 */
export function ToastContainer({ toasts, onDismiss, position = 'top-right' }: ToastContainerProps) {
  return (
    <div className={`${POSITION_CLASSES[position]} z-50 space-y-2 w-[340px] max-w-[90vw]`}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  const style = TYPE_STYLES[toast.type];

  useEffect(() => {
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      const timer = setTimeout(() => onDismiss(toast.id), duration);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <motion.div
      className="flex items-start gap-2.5 p-3 rounded-lg"
      style={{
        backgroundColor: 'var(--obs-bg-card)',
        border: `1px solid ${style.color}33`,
        boxShadow: 'var(--obs-shadow-lg)',
      }}
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      layout
    >
      <span
        className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
        style={{ backgroundColor: style.bg, color: style.color }}
      >
        {style.icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold obs-text-primary">{toast.title}</div>
        {toast.message && <p className="text-[11px] obs-text-tertiary mt-0.5">{toast.message}</p>}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-xs obs-text-muted shrink-0 hover:obs-text-secondary"
      >
        ×
      </button>
    </motion.div>
  );
}

/**
 * Hook for managing toasts.
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    setToasts((prev) => [...prev, { ...toast, id: crypto.randomUUID() }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, dismissToast };
}
