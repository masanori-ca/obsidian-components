import { motion } from 'framer-motion';

interface GraphNode {
  id: string;
  label: string;
  type: 'variable' | 'equation' | 'tk' | 'cbf';
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
  type: 'causal' | 'input' | 'output' | 'constraint';
}

interface KnowledgeGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId?: string | null;
  onNodeClick?: (nodeId: string) => void;
  width?: number;
  height?: number;
}

const NODE_COLORS: Record<string, { fill: string; stroke: string }> = {
  variable: { fill: 'var(--obs-accent-bg)', stroke: 'var(--obs-accent)' },
  equation: { fill: 'rgba(167,139,250,0.1)', stroke: '#a78bfa' },
  tk:       { fill: 'rgba(251,191,36,0.1)', stroke: '#fbbf24' },
  cbf:      { fill: 'rgba(248,113,113,0.1)', stroke: '#f87171' },
};

const EDGE_COLORS: Record<string, string> = {
  causal: 'var(--obs-accent)',
  input: '#71717a',
  output: '#34d399',
  constraint: '#f87171',
};

/**
 * Interactive knowledge graph visualization.
 * Shows variables, equations, TK rules, and CBF constraints as a network.
 */
export function KnowledgeGraph({ nodes, edges, selectedNodeId, onNodeClick, width = 600, height = 400 }: KnowledgeGraphProps) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="obs-card overflow-hidden">
      <div className="px-4 py-2.5" style={{ borderBottom: '1px solid var(--obs-border-primary)' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold obs-text-primary">知識グラフ</h3>
          <div className="flex items-center gap-3 text-[9px] obs-text-muted">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#38bdf8' }} /> 変数</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#a78bfa' }} /> 方程式</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#fbbf24' }} /> TK</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f87171' }} /> CBF</span>
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: `${height}px` }}>
        {/* Edges */}
        {edges.map((edge, idx) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);
          if (!from || !to) return null;
          const color = EDGE_COLORS[edge.type] ?? '#52525b';

          return (
            <g key={idx}>
              <line
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={color}
                strokeWidth={1}
                opacity={0.4}
                markerEnd="url(#kg-arrow)"
              />
            </g>
          );
        })}

        {/* Arrow marker */}
        <defs>
          <marker id="kg-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--obs-text-muted)" />
          </marker>
        </defs>

        {/* Nodes */}
        {nodes.map((node, idx) => {
          const colors = NODE_COLORS[node.type] ?? NODE_COLORS.variable;
          const isSelected = node.id === selectedNodeId;
          const r = node.type === 'variable' ? 20 : 16;

          return (
            <g key={node.id} onClick={() => onNodeClick?.(node.id)} className="cursor-pointer">
              {/* Selection ring */}
              {isSelected && (
                <motion.circle
                  cx={node.x} cy={node.y} r={r + 6}
                  fill="none" stroke="var(--obs-accent)" strokeWidth="1.5"
                  animate={{ r: [r + 4, r + 8, r + 4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              <motion.circle
                cx={node.x} cy={node.y} r={r}
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth={isSelected ? 2 : 1.2}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              />

              <text
                x={node.x} y={node.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={colors.stroke}
                fontSize={node.type === 'variable' ? '8' : '7'}
                fontFamily="monospace"
                fontWeight={isSelected ? 'bold' : 'normal'}
              >
                {node.label.length > 8 ? node.label.slice(0, 8) + '…' : node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
