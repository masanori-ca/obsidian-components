import { motion } from 'framer-motion';
import type { WSStatus } from '@/components/hooks/useAutopilotWS';

interface AgentTask {
  task_id: string;
  status: 'submitted' | 'working' | 'completed' | 'failed';
  agent_name: string;
  description?: string;
  started_at?: string;
  completed_at?: string;
}

interface AgentTaskMonitorProps {
  tasks: AgentTask[];
  wsStatus: WSStatus;
  onReconnect?: () => void;
}

const TASK_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  submitted:  { label: '送信済み', color: 'text-sky-400',     bg: 'bg-sky-400/15' },
  working:    { label: '実行中',   color: 'text-amber-400',   bg: 'bg-amber-400/15' },
  completed:  { label: '完了',     color: 'text-emerald-400', bg: 'bg-emerald-400/15' },
  failed:     { label: '失敗',     color: 'text-red-400',     bg: 'bg-red-400/15' },
};

const WS_STATUS_CONFIG: Record<WSStatus, { label: string; color: string }> = {
  disconnected: { label: '未接続',   color: 'bg-zinc-600' },
  connecting:   { label: '接続中',   color: 'bg-amber-400' },
  connected:    { label: '接続済み', color: 'bg-emerald-400' },
  error:        { label: 'エラー',   color: 'bg-red-400' },
};

/**
 * Monitors A2A agent tasks and WebSocket connection status.
 * Shows task lifecycle: submitted → working → completed/failed.
 */
export function AgentTaskMonitor({ tasks, wsStatus, onReconnect }: AgentTaskMonitorProps) {
  const wsConfig = WS_STATUS_CONFIG[wsStatus];

  return (
    <div className="rounded-xl border obs-border-primary obs-bg-card p-4">
      {/* Header with WS status */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold obs-text-primary">Agent Monitor</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <motion.div
              className={`w-2 h-2 rounded-full ${wsConfig.color}`}
              animate={wsStatus === 'connecting' ? { opacity: [1, 0.3, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-[10px] obs-text-muted">{wsConfig.label}</span>
          </div>
          {(wsStatus === 'disconnected' || wsStatus === 'error') && onReconnect && (
            <button
              onClick={onReconnect}
              className="text-[10px] text-sky-400 hover:text-sky-300 transition-colors"
            >
              再接続
            </button>
          )}
        </div>
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-xs obs-text-muted">実行中のタスクはありません</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {tasks.map((task, idx) => {
            const statusConfig = TASK_STATUS_CONFIG[task.status] ?? TASK_STATUS_CONFIG.submitted;
            return (
              <motion.div
                key={task.task_id}
                className="flex items-center justify-between p-2.5 rounded-lg obs-bg-secondary border obs-border-secondary"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${statusConfig.bg} ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs obs-text-secondary font-medium">{task.agent_name}</span>
                    {task.description && (
                      <p className="text-[10px] obs-text-muted truncate">{task.description}</p>
                    )}
                  </div>
                </div>
                <span className="text-[9px] obs-text-muted font-mono shrink-0">
                  {task.task_id.slice(0, 8)}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
