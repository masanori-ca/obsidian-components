import { motion, AnimatePresence } from 'framer-motion';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  variant?: 'spinner' | 'dots' | 'bar';
}

/**
 * Full-area loading overlay with multiple animation variants.
 */
export function LoadingOverlay({ isLoading, message, variant = 'spinner' }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center"
          style={{ backgroundColor: 'var(--obs-bg-overlay)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {variant === 'spinner' && (
            <motion.div
              className="w-8 h-8 border-2 border-t-transparent rounded-full"
              style={{ borderColor: 'var(--obs-accent)', borderTopColor: 'transparent' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          )}

          {variant === 'dots' && (
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: 'var(--obs-accent)' }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          )}

          {variant === 'bar' && (
            <div className="w-32 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--obs-border-primary)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: 'var(--obs-accent)' }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          )}

          {message && (
            <p className="text-xs obs-text-tertiary mt-3">{message}</p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
