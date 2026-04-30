import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ActionRecommendation } from '@/lib/pck-client';

interface AgentApprovalDialogProps {
  action: ActionRecommendation;
  cbfPassed: boolean;
  proofSummary?: string;
  onApprove: () => void;
  onReject: (reason: string) => void;
  onClose: () => void;
}

const REJECT_REASONS = [
  '安全上の懸念',
  '他に優先すべき対応がある',
  'パラメータが不適切',
  '現場状況と合わない',
  'その他',
];

/**
 * Modal dialog for operator approval/rejection of an AI-recommended action.
 * Shows CBF status, proof summary, and collects rejection reason.
 */
export function AgentApprovalDialog({
  action,
  cbfPassed,
  proofSummary,
  onApprove,
  onReject,
  onClose,
}: AgentApprovalDialogProps) {
  const [mode, setMode] = useState<'confirm' | 'reject'>('confirm');
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState('');

  const handleReject = () => {
    const reason = selectedReason === 'その他' ? customReason : selectedReason;
    if (reason) onReject(reason);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Dialog */}
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] max-w-[90vw] obs-bg-primary border obs-border-primary rounded-xl shadow-2xl z-50"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold obs-text-primary">
              {mode === 'confirm' ? 'アクション承認確認' : '却下理由'}
            </h3>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded obs-text-muted hover:obs-text-secondary flex items-center justify-center text-sm"
            >
              ×
            </button>
          </div>

          {mode === 'confirm' ? (
            <>
              {/* Action details */}
              <div className="p-3 rounded-lg obs-bg-secondary border obs-border-secondary mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    action.priority === 'critical' ? 'bg-red-400/15 text-red-400' :
                    action.priority === 'high' ? 'bg-orange-400/15 text-orange-400' :
                    'bg-amber-400/15 text-amber-400'
                  }`}>
                    {action.priority.toUpperCase()}
                  </span>
                  <span className="text-xs font-medium obs-text-primary">
                    {action.action_type}
                  </span>
                </div>
                <p className="text-[11px] obs-text-tertiary mb-1">{action.reason}</p>
                <div className="text-[10px] obs-text-muted">
                  対象: <span className="obs-text-tertiary font-mono">{action.target_variable}</span>
                </div>
                {Object.keys(action.parameters).length > 0 && (
                  <div className="text-[10px] obs-text-muted mt-1">
                    パラメータ: {Object.entries(action.parameters).map(([k, v]) => `${k}=${v}`).join(', ')}
                  </div>
                )}
              </div>

              {/* CBF status */}
              <div className={`p-2.5 rounded-lg border mb-3 ${
                cbfPassed
                  ? 'bg-emerald-400/5 border-emerald-400/20'
                  : 'bg-red-400/5 border-red-400/20'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${cbfPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                    CBF: {cbfPassed ? 'PASS' : 'BLOCK'}
                  </span>
                  <span className="text-[10px] obs-text-muted">
                    {cbfPassed
                      ? 'L1(入力) ✓  L2(規制) ✓  L3(出力) ✓'
                      : '安全バリア違反あり — 実行非推奨'
                    }
                  </span>
                </div>
              </div>

              {/* Proof summary */}
              {proofSummary && (
                <div className="p-2.5 rounded-lg obs-bg-secondary border obs-border-secondary mb-4">
                  <div className="text-[10px] obs-text-muted mb-1">証跡サマリ</div>
                  <p className="text-[11px] obs-text-tertiary">{proofSummary}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={onApprove}
                  disabled={!cbfPassed}
                  className="flex-1 py-2 text-sm font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-lg hover:bg-emerald-400/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  承認して実行
                </button>
                <button
                  onClick={() => setMode('reject')}
                  className="flex-1 py-2 text-sm font-medium obs-text-tertiary obs-bg-secondary border obs-border-primary rounded-lg hover:obs-bg-tertiary transition-colors"
                >
                  却下
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Reject reason selection */}
              <div className="space-y-1.5 mb-3">
                {REJECT_REASONS.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg border transition-colors ${
                      selectedReason === reason
                        ? 'bg-amber-400/10 border-amber-400/30 text-amber-400'
                        : 'obs-bg-secondary obs-border-secondary obs-text-tertiary hover:obs-bg-secondary'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              {selectedReason === 'その他' && (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="理由を入力..."
                  className="w-full px-3 py-2 mb-3 text-xs obs-bg-secondary border obs-border-primary rounded-lg obs-text-primary placeholder:obs-text-muted focus:outline-none focus:border-amber-500/50 resize-none h-20"
                />
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setMode('confirm')}
                  className="flex-1 py-2 text-sm font-medium obs-text-tertiary obs-bg-secondary border obs-border-primary rounded-lg hover:obs-bg-tertiary transition-colors"
                >
                  戻る
                </button>
                <button
                  onClick={handleReject}
                  disabled={!selectedReason || (selectedReason === 'その他' && !customReason.trim())}
                  className="flex-1 py-2 text-sm font-medium text-red-400 bg-red-400/10 border border-red-400/30 rounded-lg hover:bg-red-400/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  却下する
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
