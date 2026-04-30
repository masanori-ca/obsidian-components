import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface SidebarItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: number | string;
  children?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
  activeId?: string;
  collapsed?: boolean;
  onSelect?: (id: string) => void;
  onToggleCollapse?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
  width?: number;
}

/**
 * Dark sidebar navigation matching Obsidian Design System.
 * Supports nested items, badges, collapse, and icons.
 */
export function Sidebar({
  items,
  activeId,
  collapsed = false,
  onSelect,
  onToggleCollapse,
  header,
  footer,
  width = 240,
}: SidebarProps) {
  return (
    <motion.aside
      className="flex flex-col h-full overflow-hidden"
      style={{
        width: collapsed ? 56 : width,
        backgroundColor: 'var(--obs-bg-secondary)',
        borderRight: '1px solid var(--obs-border-primary)',
      }}
      animate={{ width: collapsed ? 56 : width }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      {header && (
        <div className="px-3 py-3 shrink-0" style={{ borderBottom: '1px solid var(--obs-border-subtle)' }}>
          {header}
        </div>
      )}

      {/* Collapse toggle */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="mx-2 mt-2 p-1.5 rounded-md text-[10px] transition-colors"
          style={{ color: 'var(--obs-text-muted)', backgroundColor: 'var(--obs-bg-tertiary)' }}
        >
          {collapsed ? '→' : '←'}
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {items.map((item) => (
          <SidebarNavItem
            key={item.id}
            item={item}
            activeId={activeId}
            collapsed={collapsed}
            onSelect={onSelect}
            depth={0}
          />
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="px-3 py-3 shrink-0" style={{ borderTop: '1px solid var(--obs-border-subtle)' }}>
          {footer}
        </div>
      )}
    </motion.aside>
  );
}

function SidebarNavItem({
  item,
  activeId,
  collapsed,
  onSelect,
  depth,
}: {
  item: SidebarItem;
  activeId?: string;
  collapsed: boolean;
  onSelect?: (id: string) => void;
  depth: number;
}) {
  const isActive = item.id === activeId;
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <button
        onClick={() => onSelect?.(item.id)}
        className="w-full flex items-center gap-2 rounded-md transition-colors"
        style={{
          padding: collapsed ? '8px' : `8px 10px 8px ${10 + depth * 12}px`,
          backgroundColor: isActive ? 'var(--obs-accent-bg)' : 'transparent',
          color: isActive ? 'var(--obs-accent-default)' : 'var(--obs-text-secondary)',
        }}
      >
        {item.icon && <span className="shrink-0 w-4 h-4 flex items-center justify-center">{item.icon}</span>}
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              className="text-xs font-medium truncate flex-1 text-left"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
        {!collapsed && item.badge !== undefined && (
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
            style={{ backgroundColor: 'var(--obs-accent-bg)', color: 'var(--obs-accent-default)' }}
          >
            {item.badge}
          </span>
        )}
      </button>

      {hasChildren && !collapsed && (
        <div className="mt-0.5">
          {item.children!.map((child) => (
            <SidebarNavItem key={child.id} item={child} activeId={activeId} collapsed={collapsed} onSelect={onSelect} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
