import { motion } from 'framer-motion';

interface DepNode {
  id: string;
  label: string;
  type: 'input' | 'equation' | 'output';
  level: number;
}

interface DepEdge {
  from: string;
  to: string;
}

interface DependencyGraphProps {
  nodes: DepNode[];
  edges: DepEdge[];
  highlightedPath?: string[];
  onNodeClick?: (nodeId: string) => void;
}

const TYPE_COLORS: Record<string, { fill: string; stroke: string }> = {
  input:    { fill: 'var(--obs-accent-bg)', stroke: 'var(--obs-accent)' },
  equation: { fill: 'rgba(167,139,250,0.1)', stroke: '#a78bfa' },
  output:   { fill: 'rgba(52,211,153,0.1)', stroke: '#34d399' },
};

/**
 * Equation dependency graph.
 * Shows inputs → equations → outputs as a layered DAG.
 */
export function DependencyGraph({ nodes, edges, highlightedPath = [], onNodeClick }: DependencyGraphProps) {
  const levels = Math.max(...nodes.map((n) => n.level), 0) + 1;
  const nodesPerLevel = Array.from({ length: levels }, (_, lvl) => nodes.filter((n) => n.level === lvl));
  const maxPerLevel = Math.max(...nodesPerLevel.map((ns) => ns.length), 1);

  const colWidth = 160;
  const rowHeight = 50;
  const width = levels * colWidth + 40;
  const height = maxPerLevel * rowHeight + 40;

  const nodePositions = new Map<string, { x: number; y: number }>();
  nodesPerLevel.forEach((lvlNodes, lvl) => {
    const startY = (height - lvlNodes.length * rowHeight) / 2;
    lvlNodes.forEach((n, i) => {
      nodePositions.set(n.id, { x: 20 + lvl * colWidth + colWidth / 2, y: startY + i * rowHeight + rowHeight / 2 });
    });
  });

  return (
    <div className="obs-card overflow-hidden">
      <div className="px-4 py-2.5" style={{ borderBottom: '1px solid var(--obs-border-primary)' }}>
        <h3 className="text-sm font-semibold obs-text-primary">依存グラフ</h3>
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: `${width}px`, height: `${height}px`, minWidth: '400px' }}>
          {/* Edges */}
          {edges.map((e, idx) => {
            const from = nodePositions.get(e.from);
            const to = nodePositions.get(e.to);
            if (!from || !to) return null;
            const isHighlighted = highlightedPath.includes(e.from) && highlightedPath.includes(e.to);
            return (
              <line key={idx} x1={from.x + 50} y1={from.y} x2={to.x - 50} y2={to.y}
                stroke={isHighlighted ? '#a78bfa' : 'var(--obs-border-primary)'}
                strokeWidth={isHighlighted ? 2 : 1}
                opacity={isHighlighted ? 0.8 : 0.4}
                markerEnd="url(#dep-arrow)"
              />
            );
          })}
          <defs>
            <marker id="dep-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="var(--obs-text-muted)" />
            </marker>
          </defs>

          {/* Nodes */}
          {nodes.map((node, idx) => {
            const pos = nodePositions.get(node.id);
            if (!pos) return null;
            const colors = TYPE_COLORS[node.type] ?? TYPE_COLORS.input;
            const isOnPath = highlightedPath.includes(node.id);

            return (
              <g key={node.id} onClick={() => onNodeClick?.(node.id)} className="cursor-pointer">
                <motion.rect
                  x={pos.x - 48} y={pos.y - 14} width={96} height={28} rx={6}
                  fill={colors.fill} stroke={isOnPath ? colors.stroke : 'var(--obs-border-primary)'} strokeWidth={isOnPath ? 2 : 1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.04 }}
                />
                <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle"
                  fill={colors.stroke} fontSize="9" fontFamily="monospace" fontWeight={isOnPath ? 'bold' : 'normal'}>
                  {node.label.length > 14 ? node.label.slice(0, 14) + '…' : node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
