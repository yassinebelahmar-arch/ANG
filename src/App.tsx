import { useState, useEffect, useMemo } from 'react';
import {
  ALL_95_SESSIONS,
  TRACKS_META,
  TrackId,
} from './data/curriculum50Sessions';
import { SessionsCurriculumView } from './components/SessionsCurriculumView';
import { LevelValidationQuizView } from './components/LevelValidationQuizView';
import { PWAInstallModal } from './components/PWAInstallModal';
import { usePWAInstall } from './utils/usePWAInstall';

type MainViewMode = 'curriculum' | 'validation-quizzes';

const STORAGE_KEY_V3 = 'pro_english_90days_v3_state';

interface PersistedStateV3 {
  activeTrackId: TrackId;
  activeSessionByTrack: Record<TrackId, number>;
  masteredWordIds: string[];
  validatedCertificates: Record<
    TrackId,
    { score: number; total: number; date: string } | null
  >;
}

const DEFAULT_STATE: PersistedStateV3 = {
  activeTrackId: 'b2_c1',
  activeSessionByTrack: {
    b1_b2: 1,
    b2_c1: 1,
    c1_c2: 1,
  },
  masteredWordIds: [
    'b1_b2-s01-w01',
    'b1_b2-s01-w02',
    'b2_c1-s01-w01',
    'b2_c1-s01-w02',
  ],
  validatedCertificates: {
    b1_b2: null,
    b2_c1: null,
    c1_c2: null,
  },
};

export default function App() {
  const [viewMode, setViewMode] = useState<MainViewMode>('curriculum');
  const [activeTrackId, setActiveTrackId] = useState<TrackId>(DEFAULT_STATE.activeTrackId);
  const [activeSessionByTrack, setActiveSessionByTrack] = useState<Record<TrackId, number>>(
    DEFAULT_STATE.activeSessionByTrack
  );
  const [masteredWordIds, setMasteredWordIds] = useState<string[]>(
    DEFAULT_STATE.masteredWordIds
  );
  const [validatedCertificates, setValidatedCertificates] = useState<
    Record<TrackId, { score: number; total: number; date: string } | null>
  >(DEFAULT_STATE.validatedCertificates);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const { isInstalled } = usePWAInstall();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_V3);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<PersistedStateV3>;
      if (
        parsed.activeTrackId === 'b1_b2' ||
        parsed.activeTrackId === 'b2_c1' ||
        parsed.activeTrackId === 'c1_c2'
      ) {
        setActiveTrackId(parsed.activeTrackId);
      }
      if (parsed.activeSessionByTrack) {
        setActiveSessionByTrack((prev) => ({
          ...prev,
          ...parsed.activeSessionByTrack,
        }));
      }
      if (Array.isArray(parsed.masteredWordIds)) {
        setMasteredWordIds(parsed.masteredWordIds);
      }
      if (parsed.validatedCertificates) {
        setValidatedCertificates((prev) => ({
          ...prev,
          ...parsed.validatedCertificates,
        }));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      const toSave: PersistedStateV3 = {
        activeTrackId,
        activeSessionByTrack,
        masteredWordIds,
        validatedCertificates,
      };
      localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(toSave));
    } catch {
      // Ignore storage errors
    }
  }, [activeTrackId, activeSessionByTrack, masteredWordIds, validatedCertificates]);

  const masteredSet = useMemo(() => new Set(masteredWordIds), [masteredWordIds]);

  const totalCompletedSessions = useMemo(
    () =>
      ALL_95_SESSIONS.filter((s) => s.words.every((w) => masteredSet.has(w.id)))
        .length,
    [masteredSet]
  );

  const handleToggleMasteredWord = (wordId: string) => {
    setMasteredWordIds((prev) =>
      prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [...prev, wordId]
    );
  };

  const handleMarkEntireSessionMastered = (
    sessionWordIds: string[],
    markAsMastered: boolean
  ) => {
    setMasteredWordIds((prev) => {
      const set = new Set(prev);
      for (const id of sessionWordIds) {
        if (markAsMastered) {
          set.add(id);
        } else {
          set.delete(id);
        }
      }
      return Array.from(set);
    });
  };

  const handleSelectSession = (sessionNum: number) => {
    setActiveSessionByTrack((prev) => ({
      ...prev,
      [activeTrackId]: sessionNum,
    }));
  };

  const handleSaveCertificate = (trackId: TrackId, score: number, total: number) => {
    setValidatedCertificates((prev) => ({
      ...prev,
      [trackId]: {
        score,
        total,
        date: new Date().toLocaleDateString('fr-FR'),
      },
    }));
  };

  const handleOpenQuizForTrack = (trackId: TrackId) => {
    setActiveTrackId(trackId);
    setViewMode('validation-quizzes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpToTrackSessions = (trackId: TrackId) => {
    setActiveTrackId(trackId);
    setViewMode('curriculum');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeSessionNumber = activeSessionByTrack[activeTrackId] || 1;
  const certificatesCount = Object.values(validatedCertificates).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#1C1917] flex flex-col">
      {/* Editorial Broadsheet Masthead (Strict 3-Zone Contract, Zero Blue, Zero AI Pills) */}
      <header className="bg-[#F6F3EC] border-b border-stone-900 sticky top-0 z-30">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Editorial Wordmark */}
          <button
            type="button"
            onClick={() => setViewMode('curriculum')}
            className="font-serif-editorial text-xl font-bold tracking-tight text-stone-950 whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            L’Anglais Pro en 90 Jours
          </button>

          {/* Zone 2: Clean Editorial Navigation Links */}
          <nav
            aria-label="Navigation principale"
            className="flex items-center gap-5 overflow-x-auto py-1 text-sm"
          >
            {(['b1_b2', 'b2_c1', 'c1_c2'] as TrackId[]).map((trackId) => {
              const meta = TRACKS_META[trackId];
              const isSelected = viewMode === 'curriculum' && activeTrackId === trackId;
              const cert = validatedCertificates[trackId];

              const navLabel =
                trackId === 'b1_b2'
                  ? 'I. B1 → B2+ (25 Sessions)'
                  : trackId === 'b2_c1'
                  ? 'II. B2 → C1+ (50 Sessions)'
                  : 'III. C1+ → C2 (20 Sessions)';

              return (
                <button
                  key={trackId}
                  type="button"
                  onClick={() => {
                    setActiveTrackId(trackId);
                    setViewMode('curriculum');
                  }}
                  title={meta.titleFR}
                  className={`relative py-5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'text-stone-950 font-bold'
                      : 'text-stone-600 hover:text-stone-950 font-medium'
                  }`}
                >
                  <span>{navLabel}</span>
                  {cert && <span className="ml-1.5 text-emerald-800">✓</span>}
                  {isSelected && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#9A3412]" />
                  )}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setViewMode('validation-quizzes')}
              className={`relative py-5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'validation-quizzes'
                  ? 'text-stone-950 font-bold'
                  : 'text-stone-600 hover:text-stone-950 font-medium'
              }`}
            >
              <span>Examens de Niveau ({certificatesCount}/3)</span>
              {viewMode === 'validation-quizzes' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#9A3412]" />
              )}
            </button>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsInstallModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#F6F3EC] bg-stone-900 hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isInstalled ? 'App Installée' : 'Version Mobile (App)'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1380px] w-full mx-auto px-4 sm:px-8 py-8">
        {viewMode === 'curriculum' && (
          <SessionsCurriculumView
            activeTrackId={activeTrackId}
            onSelectTrack={(trackId) => setActiveTrackId(trackId)}
            activeSessionNumber={activeSessionNumber}
            onSelectSession={handleSelectSession}
            masteredWordIds={masteredWordIds}
            onToggleMasteredWord={handleToggleMasteredWord}
            onMarkEntireSessionMastered={handleMarkEntireSessionMastered}
            onOpenQuizForTrack={handleOpenQuizForTrack}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
            totalCompletedSessions={totalCompletedSessions}
            validatedCertificates={validatedCertificates}
          />
        )}

        {viewMode === 'validation-quizzes' && (
          <LevelValidationQuizView
            initialTrackId={activeTrackId}
            validatedCertificates={validatedCertificates}
            onSaveCertificate={handleSaveCertificate}
            onJumpToTrackSessions={handleJumpToTrackSessions}
          />
        )}
      </main>

      {/* Editorial Colophon Footer */}
      <footer className="border-t border-stone-300 mt-16 bg-[#EFECE4]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
          <div>
            <strong className="font-serif-editorial text-stone-950 text-sm">L’Anglais Pro en 90 Jours</strong> · Recueil intégral de 95 sessions quotidiennes (2 850 mots et 2 850 phrases professionnelles)
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setViewMode('validation-quizzes')}
              className="hover:text-stone-950 underline underline-offset-4 cursor-pointer"
            >
              Examens de validation B2+ · C1+ · C2
            </button>
            <button
              type="button"
              onClick={() => setIsInstallModalOpen(true)}
              className="hover:text-stone-950 underline underline-offset-4 cursor-pointer"
            >
              Installer sur Android & iOS
            </button>
          </div>
        </div>
      </footer>

      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}
