import { motion } from 'framer-motion';

interface LiveDataIndicatorProps {
  isReceiving: boolean;
  samplesPerSecond?: number;
  lastTimestamp?: string;
  quality?: 'good' | 'uncertain' | 'bad';
  className?: string;
}

const QUALITY_CONFIG: Record<string, { label: string; color: string }> = {
  good:      { label: 'Good', color: 'var(--obs-success)' },
  uncertain: { label: 'Uncertain', color: 'var(--obs-warning)' },
  bad:       { label: 'Bad', color: 'var(--obs-danger)' },
};

/**
 * Compact live data receiving indicator.
 * Shows real-time data flow status with quality.
 */
export function LiveDataIndicator({ isReceiving, samplesPerSecond, lastTimestamp, quality = 'good', className = '' }: LiveDataIndicatorProps) {
  const qualityConfig = QUALITY_CONFIG[quality] ?? QUALITY_CONFIG.good;

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${className}`} style={{ backgroundColor: 'var(--obs-bg-secondary)', border: '1px solid var(--obs-border-primary)' }}>
      {/* Activity indicator */}
      <div className="relative">
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: isReceiving ? qualityConfig.color : 'var(--obs-text-muted)' }}
          animate={isReceiving ? { opacity: [1, 0.3, 1] } : {}}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        {isReceiving && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: `1px solid ${qualityConfig.color}` }}
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}
      </div>

      <span className="text-[10px] font-medium" style={{ color: isReceiving ? qualityConfig.color : 'var(--obs-text-muted)' }}>
        {isReceiving ? 'LIVE' : 'OFFLINE'}
      </span>

      {isReceiving && (
        <>
          {samplesPerSecond !== undefined && (
            <span className="text-[9px] font-mono obs-text-muted">{samplesPerSecond}/s</span>
          )}
          <span className="text-[8px] px-1 py-0.5 rounded" style={{ backgroundColor: `${qualityConfig.color}15`, color: qualityConfig.color }}>
            {qualityConfig.label}
          </span>
        </>
      )}

      {lastTimestamp && (
        <span className="text-[9px] obs-text-muted">{lastTimestamp}</span>
      )}
    </div>
  );
}
