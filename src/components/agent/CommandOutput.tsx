interface Command {
  tag: string;
  action: string;
}

interface CommandOutputProps {
  title?: string;
  commands: Command[];
  appliedRule?: string;
  onExecute?: () => void;
  blocked?: boolean;
  checkResults?: Array<{ name: string; value: string; threshold: string; passed: boolean }>;
  passCount?: number;
  totalCount?: number;
}

/**
 * Command output panel matching Figma AI Agent design.
 * Shows Tag → Action commands with Execute button.
 * Optionally shows safety check results with pass/fail.
 */
export function CommandOutput({ title = 'Command output', commands, appliedRule, onExecute, blocked = false, checkResults, passCount, totalCount }: CommandOutputProps) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--obs-bg-card)', border: '1px solid var(--obs-border-primary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid var(--obs-border-subtle)' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs obs-text-muted">⌘</span>
          <span className="text-xs font-medium obs-text-primary">{title}</span>
        </div>
        {blocked && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--obs-status-dangerBg)', color: 'var(--obs-status-danger)' }}>
            Blocked
          </span>
        )}
      </div>

      {/* Progress bar */}
      {passCount !== undefined && totalCount !== undefined && (
        <div className="px-4 py-2" style={{ borderBottom: '1px solid var(--obs-border-subtle)' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono obs-text-secondary">{passCount} / {totalCount}</span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--obs-bg-tertiary)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(passCount / totalCount) * 100}%`,
                  backgroundColor: passCount === totalCount ? 'var(--obs-status-success)' : 'var(--obs-status-warning)',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Check results */}
      {checkResults && (
        <div>
          {checkResults.map((check, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: '1px solid var(--obs-border-subtle)' }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: check.passed ? 'var(--obs-status-success)' : 'var(--obs-status-danger)' }}>
                  {check.passed ? '✓' : '✗'}
                </span>
                <span className="text-xs obs-text-primary">{check.name}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="font-mono font-bold" style={{ color: check.passed ? 'var(--obs-status-success)' : 'var(--obs-status-danger)' }}>
                  {check.value}
                </span>
                <span className="obs-text-muted">/ {check.threshold}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Commands */}
      {commands.length > 0 && (
        <div className="px-4 py-2.5 space-y-1.5">
          {commands.map((cmd, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className="font-mono" style={{ color: 'var(--obs-accent-default)' }}>{cmd.tag}</span>
              <span className="obs-text-muted">→</span>
              <span className="font-mono obs-text-primary">{cmd.action}</span>
            </div>
          ))}
        </div>
      )}

      {/* Applied rule */}
      {appliedRule && (
        <div className="px-4 py-1.5" style={{ borderTop: '1px solid var(--obs-border-subtle)' }}>
          <span className="text-[10px] obs-text-muted">Applicable rules: {appliedRule}</span>
        </div>
      )}

      {/* Execute button */}
      {onExecute && (
        <div className="px-4 py-2.5" style={{ borderTop: '1px solid var(--obs-border-subtle)' }}>
          <button
            onClick={onExecute}
            disabled={blocked}
            className="w-full py-2 text-sm font-medium rounded-lg transition-opacity disabled:opacity-30"
            style={{
              backgroundColor: 'var(--obs-accent-default)',
              color: 'var(--obs-text-inverse)',
            }}
          >
            Execute
          </button>
        </div>
      )}
    </div>
  );
}
