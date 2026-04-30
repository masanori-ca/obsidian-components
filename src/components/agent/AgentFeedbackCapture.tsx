import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ActionRecommendation } from '@/lib/pck-client';

interface AgentFeedbackCaptureProps {
  action: ActionRecommendation;
  onFeedback: (feedback: {
    was_beneficial: boolean;
    reason?: string;
    should_ai_learn: boolean;
  }) => void;
}

/**
 * Post-action feedback capture component.
 * Collects operator feedback on whether the AI action was beneficial,
 * to be sent to TK Service for learning.
 */
export function AgentFeedbackCapture({ action, onFeedback }: AgentFeedbackCaptureProps) {
  const [step, setStep] = useState<'ask' | 'reason' | 'done'>('ask');
  const [, setWasBeneficial] = useState<boolean | null>(null);
  const [reason, setReason] = useState('');
  const [shouldLearn, setShouldLearn] = useState(true);

  const handleBeneficial = (beneficial: boolean) => {
    setWasBeneficial(beneficial);
    if (beneficial) {
      onFeedback({ was_beneficial: true, should_ai_learn: true });
      setStep('done');
    } else {
      setStep('reason');
    }
  };

  const handleSubmitReason = () => {
    onFeedback({
      was_beneficial: false,
      reason: reason || undefined,
      should_ai_learn: shouldLearn,
    });
    setStep('done');
  };

  if (step === 'done') {
    return (
      <motion.div
        className="p-3 rounded-lg bg-emerald-400/5 border border-emerald-400/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <span className="text-sm">✓</span>
          <span>フィードバック記録済み{shouldLearn ? ' → TKに学習送信' : ''}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="rounded-lg border obs-border-primary obs-bg-secondary p-3"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {step === 'ask' && (
        <>
          <p className="text-xs obs-text-secondary mb-2">
            <span className="font-medium">{action.action_type}</span> の結果は良好でしたか？
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleBeneficial(true)}
              className="flex-1 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-md hover:bg-emerald-400/20 transition-colors"
            >
              はい
            </button>
            <button
              onClick={() => handleBeneficial(false)}
              className="flex-1 py-1.5 text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-md hover:bg-amber-400/20 transition-colors"
            >
              いいえ
            </button>
          </div>
        </>
      )}

      {step === 'reason' && (
        <>
          <p className="text-xs obs-text-secondary mb-2">何が問題でしたか？（任意）</p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="例: 曝気量の増加幅が不十分だった"
            className="w-full px-2.5 py-1.5 mb-2 text-xs obs-bg-secondary border obs-border-primary rounded-md obs-text-primary placeholder:obs-text-muted focus:outline-none focus:border-amber-500/50 resize-none h-16"
          />
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setShouldLearn(!shouldLearn)}
              className={`w-4 h-4 rounded border flex items-center justify-center text-[8px] transition-colors ${
                shouldLearn
                  ? 'bg-sky-400/20 border-sky-400/50 text-sky-400'
                  : 'obs-bg-secondary obs-border-primary obs-text-muted'
              }`}
            >
              {shouldLearn ? '✓' : ''}
            </button>
            <span className="text-[11px] obs-text-tertiary">AIに学習させる（TKルール化）</span>
          </div>
          <button
            onClick={handleSubmitReason}
            className="w-full py-1.5 text-xs font-medium text-sky-400 bg-sky-400/10 border border-sky-400/30 rounded-md hover:bg-sky-400/20 transition-colors"
          >
            送信
          </button>
        </>
      )}
    </motion.div>
  );
}
