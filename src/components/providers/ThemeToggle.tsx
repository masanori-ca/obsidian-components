import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  className?: string;
}

/**
 * Simple Day/Night toggle button.
 */
export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme, setTheme, theme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={toggleTheme}
        className={`
          relative w-12 h-6 rounded-full transition-colors
          ${isDark ? 'obs-bg-tertiary' : 'bg-sky-200'}
        `}
        title={isDark ? 'ライトモードに切替' : 'ダークモードに切替'}
      >
        <div
          className={`
            absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300
            ${isDark ? 'left-6 bg-zinc-300' : 'left-0.5 bg-amber-400'}
          `}
        >
          <span className="flex items-center justify-center h-full text-[10px]">
            {isDark ? '🌙' : '☀️'}
          </span>
        </div>
      </button>

      {/* System option */}
      <button
        onClick={() => setTheme('system')}
        className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
          theme === 'system'
            ? 'bg-sky-400/20 text-sky-400'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        auto
      </button>
    </div>
  );
}
