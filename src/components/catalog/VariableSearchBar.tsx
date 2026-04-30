import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePCKClient } from '@/components/hooks/usePCKClient';

interface Variable {
  id: string;
  symbol: string;
  name: string;
  unit?: string;
  discipline?: string;
}

interface VariableSearchBarProps {
  onSelect?: (variable: Variable) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Typeahead search bar for PCK Catalog variables.
 * Calls GET /api/catalog/search?q=...
 */
export function VariableSearchBar({ onSelect, placeholder = '変数を検索 (例: NH4, DO, flow)...', className = '' }: VariableSearchBarProps) {
  const client = usePCKClient();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Variable[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setIsLoading(true);
    try {
      const res = await client.searchVariables(q, 15);
      setResults((res as { variables?: Variable[] }).variables ?? []);
      setIsOpen(true);
    } catch { setResults([]); }
    finally { setIsLoading(false); }
  }, [client]);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  const handleSelect = (v: Variable) => {
    setQuery(v.symbol);
    setIsOpen(false);
    onSelect?.(v);
  };

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-3 py-2 pl-8 text-sm rounded-lg obs-card obs-text-primary placeholder:obs-text-muted focus:outline-none focus:ring-1 focus:ring-sky-500/50"
          style={{ backgroundColor: 'var(--obs-bg-secondary)', borderColor: 'var(--obs-border-primary)' }}
        />
        <svg className="absolute left-2.5 top-2.5 w-4 h-4 obs-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        {isLoading && (
          <motion.div className="absolute right-2.5 top-2.5 w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
            <motion.div
              className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-30 overflow-hidden max-h-[300px] overflow-y-auto"
              style={{ backgroundColor: 'var(--obs-bg-secondary)', border: '1px solid var(--obs-border-primary)' }}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
            >
              {results.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleSelect(v)}
                  className="w-full text-left px-3 py-2 hover:bg-sky-400/10 transition-colors"
                  style={{ borderBottom: '1px solid var(--obs-border-subtle)' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold obs-text-primary">{v.symbol}</span>
                      <span className="text-[11px] obs-text-secondary ml-2">{v.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {v.unit && <span className="text-[10px] obs-text-muted">{v.unit}</span>}
                      {v.discipline && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded obs-text-muted" style={{ backgroundColor: 'var(--obs-accent-bg)' }}>
                          {v.discipline}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
