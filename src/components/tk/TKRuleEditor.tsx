import { useState } from 'react';
import type { TKRule } from './TKRuleList';

interface TKRuleEditorProps {
  rule?: TKRule;
  onSave: (rule: Omit<TKRule, 'id'>) => void;
  onCancel: () => void;
}

/**
 * Editor for creating/editing TK rules.
 * IF condition THEN action format with confidence and tags.
 */
export function TKRuleEditor({ rule, onSave, onCancel }: TKRuleEditorProps) {
  const [condition, setCondition] = useState(rule?.condition ?? '');
  const [action, setAction] = useState(rule?.action ?? '');
  const [confidence, setConfidence] = useState(rule?.confidence ?? 0.8);
  const [contributor, setContributor] = useState(rule?.contributor ?? '');
  const [tags, setTags] = useState(rule?.tags?.join(', ') ?? '');
  const [source, setSource] = useState<TKRule['source']>(rule?.source ?? 'expert');

  const handleSave = () => {
    if (!condition.trim() || !action.trim()) return;
    onSave({
      condition: condition.trim(),
      action: action.trim(),
      confidence,
      contributor: contributor || undefined,
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      source,
    });
  };

  return (
    <div className="obs-card p-4 space-y-3">
      <h3 className="text-sm font-semibold obs-text-primary">
        {rule ? 'ルール編集' : '新規ルール作成'}
      </h3>

      <div>
        <label className="text-[10px] obs-text-muted uppercase">IF (条件)</label>
        <textarea
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          placeholder="例: 冬季(水温15℃以下) かつ SVI > 150"
          className="w-full mt-1 px-2.5 py-2 text-xs rounded-md obs-text-primary resize-none h-16"
          style={{ backgroundColor: 'var(--obs-bg-secondary)', border: '1px solid var(--obs-border-primary)' }}
        />
      </div>

      <div>
        <label className="text-[10px] obs-text-muted uppercase">THEN (アクション)</label>
        <textarea
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="例: MLSS目標値を+500 mg/L上げる"
          className="w-full mt-1 px-2.5 py-2 text-xs rounded-md obs-text-primary resize-none h-16"
          style={{ backgroundColor: 'var(--obs-bg-secondary)', border: '1px solid var(--obs-border-primary)' }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] obs-text-muted uppercase">信頼度</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={confidence}
            onChange={(e) => setConfidence(parseFloat(e.target.value))}
            className="w-full mt-1 accent-amber-400"
          />
          <div className="text-right text-[10px] font-mono obs-text-muted">{(confidence * 100).toFixed(0)}%</div>
        </div>
        <div>
          <label className="text-[10px] obs-text-muted uppercase">ソース</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as TKRule['source'])}
            className="w-full mt-1 px-2 py-1.5 text-xs rounded-md obs-text-primary"
            style={{ backgroundColor: 'var(--obs-bg-secondary)', border: '1px solid var(--obs-border-primary)' }}
          >
            <option value="expert">専門家</option>
            <option value="sensor_pattern">センサーパターン</option>
            <option value="llm_inference">LLM推論</option>
            <option value="legal">法令</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-[10px] obs-text-muted uppercase">貢献者</label>
        <input
          type="text"
          value={contributor}
          onChange={(e) => setContributor(e.target.value)}
          placeholder="例: 田中主任"
          className="w-full mt-1 px-2.5 py-1.5 text-xs rounded-md obs-text-primary"
          style={{ backgroundColor: 'var(--obs-bg-secondary)', border: '1px solid var(--obs-border-primary)' }}
        />
      </div>

      <div>
        <label className="text-[10px] obs-text-muted uppercase">タグ (カンマ区切り)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="例: safety, winter, sludge"
          className="w-full mt-1 px-2.5 py-1.5 text-xs rounded-md obs-text-primary"
          style={{ backgroundColor: 'var(--obs-bg-secondary)', border: '1px solid var(--obs-border-primary)' }}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSave}
          disabled={!condition.trim() || !action.trim()}
          className="flex-1 py-2 text-xs font-medium rounded-lg transition-colors disabled:opacity-30"
          style={{ backgroundColor: 'var(--obs-warning-bg)', color: 'var(--obs-warning)', border: '1px solid var(--obs-warning)' }}
        >
          保存
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-2 text-xs font-medium rounded-lg obs-text-tertiary transition-colors"
          style={{ backgroundColor: 'var(--obs-bg-tertiary)', border: '1px solid var(--obs-border-primary)' }}
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
