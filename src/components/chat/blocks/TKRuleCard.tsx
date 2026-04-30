import { motion } from 'framer-motion';

interface TKRuleCardProps {
  condition: string;
  action: string;
  confidence: number;
  contributor?: string;
  source?: 'expert' | 'sensor_pattern' | 'llm_inference' | 'legal';
}

const SOURCE_STYLES: Record<string, { label: string; color: string }> = {
  expert:         { label: '専門家', color: '#34d399' },
  sensor_pattern: { label: 'パターン', color: '#38bdf8' },
  llm_inference:  { label: 'LLM', color: '#a78bfa' },
  legal:          { label: '法令', color: '#fbbf24' },
};

/**
 * Inline TK rule display for chat messages.
 * IF/THEN format with confidence and source.
 */
export function TKRuleCard({ condition, action, confidence, contributor, source = 'expert' }: TKRuleCardProps) {
  const srcStyle = SOURCE_STYLES[source] ?? SOURCE_STYLES.expert;

  return (
    <motion.div
      className="rounded-lg overflow-hidden my-2"
      style={{ border: `1px solid ${srcStyle.color}33`, backgroundColor: `${srcStyle.color}08` }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${srcStyle.color}22`, color: srcStyle.color }}>
            TK
          </span>
          <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ color: srcStyle.color, backgroundColor: `${srcStyle.color}15` }}>
            {srcStyle.label}
          </span>
          <span className="text-[9px] font-mono obs-text-muted ml-auto">{(confidence * 100).toFixed(0)}%</span>
        </div>

        <div className="space-y-1 ml-0.5">
          <div className="text-[10px]">
            <span className="obs-text-muted font-semibold">IF </span>
            <span className="obs-text-secondary">{condition}</span>
          </div>
          <div className="text-[10px]">
            <span className="obs-text-muted font-semibold">THEN </span>
            <span className="obs-text-primary font-medium">{action}</span>
          </div>
        </div>

        {contributor && (
          <div className="mt-1.5 text-[8px] obs-text-muted">by {contributor}</div>
        )}
      </div>
    </motion.div>
  );
}
