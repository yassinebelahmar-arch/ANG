import { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Award,
  Smartphone,
  CheckCircle2,
  Volume2,
  Calendar,
} from 'lucide-react';
import {
  ALL_95_SESSIONS,
  SESSIONS_BY_TRACK,
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
  activeTrackId: 'b1_b2',
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

  // Load persisted state
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

  // Save state
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

  const totalMasteredCount = masteredWordIds.length;
  const totalWordsCount = 2850;
  const totalCompletedSessions = useMemo(
    () =>
      ALL_95_SESSIONS.filter(
        (s) => s.words.every((w) => masteredSet.has(w.id))
      ).length,
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
    <div className="min-h-screen bg-[#F8F7F4] text-slate-900 flex flex-col">
      {/* Top Executive Navigation Header */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3.5 gap-3">
            {/* Brand Title */}
            <div className="flex items-center justify-between gap-3">
              <div
                onClick={() => setViewMode('curriculum')}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center font-mono font-bold text-sm tracking-tight text-white shrink-0 shadow-inner">
                  90J
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold tracking-tight text-base sm:text-lg text-white">
                      ProEnglish 90 Jours · Accéléré & Certifiant
                    </span>
                    <span className="hidden sm:inline-block font-mono text-[11px] uppercase px-2 py-0.5 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded">
                      EN 🔊 · FR · AR
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    1 Session = 1 Jour · 2 850 Mots & 2 850 Phrases Pro (B1 → B2+ · B2 → C1+ · C1+ → C2)
                  </p>
                </div>
              </div>

              {/* Mobile Install Quick Button */}
              <button
                type="button"
                onClick={() => setIsInstallModalOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>App</span>
              </button>
            </div>

            {/* Right Stats & Install App Button */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono text-xs text-slate-300">
                    Jours validés : <strong className="text-white">{totalCompletedSessions}/95</strong>
                  </span>
                </div>
                <span className="text-slate-700">|</span>
                <span className="font-mono text-xs text-teal-400 font-semibold">
                  {totalMasteredCount} / {totalWordsCount} mots
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsInstallModalOpen(true)}
                className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-teal-400" />
                <span>
                  {isInstalled ? 'Application Mobile Installée' : 'Application Android / iOS'}
                </span>
              </button>
            </div>
          </div>

          {/* Primary Navigation Bar: 3 Category Tracks + Validation Quizzes */}
          <nav
            aria-label="Navigation principale"
            className="flex items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-800/80"
          >
            {(['b1_b2', 'b2_c1', 'c1_c2'] as TrackId[]).map((trackId) => {
              const meta = TRACKS_META[trackId];
              const isSelected = viewMode === 'curriculum' && activeTrackId === trackId;
              const cert = validatedCertificates[trackId];

              return (
                <button
                  key={trackId}
                  type="button"
                  onClick={() => {
                    setActiveTrackId(trackId);
                    setViewMode('curriculum');
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Catégorie {meta.categoryNumber} : {meta.shortTitleFR}
                  </span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-black/25 text-teal-100' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {meta.sessionCount} Sessions · {meta.wordCount} Mots
                  </span>
                  {cert && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}

            {/* Official Level Validation Quizzes Tab */}
            <button
              type="button"
              onClick={() => setViewMode('validation-quizzes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ml-auto ${
                viewMode === 'validation-quizzes'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>Quiz de Validation des Niveaux (B2+ · C1+ · C2)</span>
              {certificatesCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono text-[10px] font-bold">
                  {certificatesCount}/3
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-teal-700" />
            <span>
              <strong>ProEnglish 90 Jours</strong> — 95 Sessions Quotidiennes (25 B1→B2+ · 50 B2→C1+ · 20 C1+→C2) · 2 850 Mots & 2 850 Phrases Pro
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsInstallModalOpen(true)}
              className="text-teal-700 font-semibold hover:underline cursor-pointer flex items-center gap-1"
            >
              <Smartphone className="w-3.5 h-3.5" />
              Installer sur Android / iOS
            </button>
            <span className="font-mono text-slate-400">
              EN (Audio) · FR (C1) · AR (العربية)
            </span>
          </div>
        </div>
      </footer>

      {/* PWA Mobile Installation Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}
