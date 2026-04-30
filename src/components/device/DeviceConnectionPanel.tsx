import { motion } from 'framer-motion';

export type ProtocolType = 'modbus' | 'opcua' | 'mqtt' | 'dataserver2';

export interface DeviceConnection {
  id: string;
  name: string;
  protocol: ProtocolType;
  host: string;
  port: number;
  status: 'connected' | 'disconnected' | 'error' | 'connecting';
  latency?: number;
  lastSeen?: string;
  tagCount?: number;
}

interface DeviceConnectionPanelProps {
  connections: DeviceConnection[];
  onConnect?: (id: string) => void;
  onDisconnect?: (id: string) => void;
  onConfigure?: (connection: DeviceConnection) => void;
}

const PROTOCOL_LABELS: Record<ProtocolType, { label: string; color: string }> = {
  modbus:      { label: 'Modbus TCP', color: '#38bdf8' },
  opcua:       { label: 'OPC-UA',     color: '#a78bfa' },
  mqtt:        { label: 'MQTT',       color: '#34d399' },
  dataserver2: { label: 'DataServer2', color: '#fb923c' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  connected:    { label: '接続中', color: 'var(--obs-success)', dot: 'var(--obs-success)' },
  disconnected: { label: '未接続', color: 'var(--obs-text-muted)', dot: 'var(--obs-text-muted)' },
  error:        { label: 'エラー', color: 'var(--obs-danger)', dot: 'var(--obs-danger)' },
  connecting:   { label: '接続中...', color: 'var(--obs-warning)', dot: 'var(--obs-warning)' },
};

/**
 * Device/Protocol connection management panel.
 * Shows OPC-UA, Modbus, MQTT, DataServer2 connections with status.
 */
export function DeviceConnectionPanel({ connections, onConnect, onDisconnect, onConfigure }: DeviceConnectionPanelProps) {
  return (
    <div className="obs-card overflow-hidden">
      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--obs-border-primary)' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold obs-text-primary">デバイス接続</h3>
          <span className="text-[10px] obs-text-muted">
            {connections.filter((c) => c.status === 'connected').length}/{connections.length} 接続中
          </span>
        </div>
      </div>

      <div className="divide-y" style={{ borderColor: 'var(--obs-border-subtle)' }}>
        {connections.map((conn, idx) => {
          const protocol = PROTOCOL_LABELS[conn.protocol] ?? PROTOCOL_LABELS.modbus;
          const status = STATUS_CONFIG[conn.status] ?? STATUS_CONFIG.disconnected;

          return (
            <motion.div
              key={conn.id}
              className="px-4 py-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: status.dot }}
                    animate={conn.status === 'connecting' ? { opacity: [1, 0.3, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <div>
                    <span className="text-xs font-medium obs-text-primary">{conn.name}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: `${protocol.color}15`, color: protocol.color }}>
                        {protocol.label}
                      </span>
                      <span className="text-[9px] font-mono obs-text-muted">{conn.host}:{conn.port}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] font-medium" style={{ color: status.color }}>{status.label}</span>
                    {conn.latency !== undefined && (
                      <div className="text-[9px] obs-text-muted">{conn.latency}ms</div>
                    )}
                  </div>
                  {conn.status === 'connected' && onDisconnect ? (
                    <button onClick={() => onDisconnect(conn.id)} className="text-[9px] px-2 py-1 rounded obs-text-muted" style={{ backgroundColor: 'var(--obs-bg-tertiary)' }}>
                      切断
                    </button>
                  ) : conn.status !== 'connecting' && onConnect ? (
                    <button onClick={() => onConnect(conn.id)} className="text-[9px] px-2 py-1 rounded" style={{ backgroundColor: 'var(--obs-success-bg)', color: 'var(--obs-success)' }}>
                      接続
                    </button>
                  ) : null}
                  {onConfigure && (
                    <button onClick={() => onConfigure(conn)} className="text-[9px]" style={{ color: 'var(--obs-accent)' }}>
                      設定
                    </button>
                  )}
                </div>
              </div>

              {conn.tagCount !== undefined && (
                <div className="mt-1.5 text-[9px] obs-text-muted ml-5">
                  {conn.tagCount} タグ登録 {conn.lastSeen && `• 最終: ${conn.lastSeen}`}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
