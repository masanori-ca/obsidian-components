import { useState, useEffect } from 'react';
import { usePCKClient } from '@/components/hooks/usePCKClient';

interface Persona {
  id: string;
  name: string;
  name_ja?: string;
  speaking_style?: {
    tone_description?: string;
    speech_samples?: string[];
  };
}

interface PersonaSelectorProps {
  selectedId?: string;
  onSelect: (persona: Persona) => void;
}

/**
 * Dropdown selector for ProTwin2 personas.
 * Fetches from GET /api/protwin2/personas.
 */
export function PersonaSelector({ selectedId, onSelect }: PersonaSelectorProps) {
  const client = usePCKClient();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    client.personas()
      .then((res) => {
        setPersonas(res.personas as unknown as Persona[]);
      })
      .catch(() => {
        setPersonas([]);
      })
      .finally(() => setIsLoading(false));
  }, [client]);

  const selected = personas.find((p) => p.id === selectedId);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg obs-bg-secondary border obs-border-primary obs-text-secondary hover:obs-bg-tertiary transition-colors"
      >
        <span className="w-5 h-5 rounded-full bg-purple-400/20 flex items-center justify-center text-[10px] text-purple-400 font-bold">
          {selected?.name?.[0] ?? 'P'}
        </span>
        <span>{selected?.name_ja ?? selected?.name ?? 'ペルソナ選択'}</span>
        <span className="obs-text-muted text-[10px]">▼</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-1 w-56 rounded-lg shadow-xl z-40 overflow-hidden" style={{ backgroundColor: 'var(--obs-bg-secondary)', border: '1px solid var(--obs-border-primary)' }}>
            {isLoading ? (
              <div className="p-3 text-xs obs-text-muted">読み込み中...</div>
            ) : personas.length === 0 ? (
              <div className="p-3 text-xs obs-text-muted">ペルソナが登録されていません</div>
            ) : (
              personas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => {
                    onSelect(persona);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 hover:obs-bg-tertiary transition-colors border-b obs-border-secondary last:border-0 ${
                    persona.id === selectedId ? 'obs-bg-tertiary' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-400/20 flex items-center justify-center text-[11px] text-purple-400 font-bold shrink-0">
                      {persona.name[0]}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-medium obs-text-primary">
                        {persona.name_ja ?? persona.name}
                      </div>
                      {persona.speaking_style?.tone_description && (
                        <div className="text-[10px] obs-text-muted truncate">
                          {persona.speaking_style.tone_description}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
