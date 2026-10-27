import React, { useState, useMemo, useEffect } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  Keyboard,
  Search,
  Volume2,
} from 'lucide-react';
import {
  SESSIONS_BY_TRACK,
  TRACKS_META,
  TrackId,
  CurriculumSession,
  PartOfSpeech,
  SessionWordEntry,
} from '../data/curriculum50Sessions';
import {
  evaluateWrittenWordRecall,
  filterSessionsByPalier,
  filterSessionWords,
  searchGlobalTrackWords,
} from '../utils/sdmEngine';
import {
  speakEnglishText,
  stopEnglishSpeech,
  subscribeToSpeechState,
  SpeechSpeed,
  EnglishAccent,
} from '../utils/speechAudio';

interface SessionsCurriculumViewProps {
  activeTrackId: TrackId;
  onSelectTrack: (trackId: TrackId) => void;
  activeSessionNumber: number;
  onSelectSession: (sessionNum: number) => void;
  masteredWordIds: string[];
  onToggleMasteredWord: (wordId: string) => void;
  onMarkEntireSessionMastered: (sessionWordIds: string[], markAsMastered: boolean) => void;
  onOpenQuizForTrack: (trackId: TrackId) => void;
  onOpenInstallModal: () => void;
  totalCompletedSessions?: number;
  validatedCertificates?: Record<
    TrackId,
    { score: number; total: number; date: string } | null
  >;
}

const PALIER_TABS_BY_TRACK: Record<
  TrackId,
  Array<{ id: 'all' | 1 | 2 | 3 | 4; label: string; range: string; level: string }>
> = {
  b1_b2: [
    { id: 'all', label: 'Toutes (25)', range: 'S01–S25', level: 'B1 → B2+' },
    { id: 1, label: 'Partie I · Réunions', range: 'S01–S06', level: 'B1 → B1+' },
    { id: 2, label: 'Partie II · Coordination', range: 'S07–S13', level: 'B1+ → B2' },
    { id: 3, label: 'Partie III · Téléphonie IP/Mobile', range: 'S14–S19', level: 'B2' },
    { id: 4, label: 'Partie IV · Autonomie B2+', range: 'S20–S25', level: 'B2+' },
  ],
  b2_c1: [
    { id: 'all', label: 'Toutes (50)', range: 'S01–S50', level: 'B2 → C1+' },
    { id: 1, label: 'Partie I · Fondations', range: 'S01–S12', level: 'B2' },
    { id: 2, label: 'Partie II · Opérations', range: 'S13–S25', level: 'B2+' },
    { id: 3, label: 'Partie III · Négociation & Télécom', range: 'S26–S38', level: 'C1' },
    { id: 4, label: 'Partie IV · Direction & Comités', range: 'S39–S50', level: 'C1+' },
  ],
  c1_c2: [
    { id: 'all', label: 'Toutes (20)', range: 'S01–S20', level: 'C1+ → C2' },
    { id: 1, label: 'Partie I · Diplomatie COMEX', range: 'S01–S05', level: 'C1+ → C2' },
    { id: 2, label: 'Partie II · Crises & Contrats', range: 'S06–S10', level: 'C2' },
    { id: 3, label: 'Partie III · Arbitrage & Coûts', range: 'S11–S15', level: 'C2' },
    { id: 4, label: 'Partie IV · Maîtrise Exécutive', range: 'S16–S20', level: 'C2 Master' },
  ],
};

const POS_OPTIONS: Array<{ value: 'all' | PartOfSpeech; label: string }> = [
  { value: 'all', label: 'Toutes natures (30)' },
  { value: 'Verbe', label: 'Verbes' },
  { value: 'Nom', label: 'Noms' },
  { value: 'Adjectif', label: 'Adjectifs' },
  { value: 'Expression', label: 'Expressions pro' },
  { value: 'Connecteur', label: 'Connecteurs logiques' },
];

export const SessionsCurriculumView: React.FC<SessionsCurriculumViewProps> = ({
  activeTrackId,
  onSelectTrack,
  activeSessionNumber,
  onSelectSession,
  masteredWordIds,
  onToggleMasteredWord,
  onMarkEntireSessionMastered,
  onOpenQuizForTrack,
  validatedCertificates,
}) => {
  const [selectedPalier, setSelectedPalier] = useState<'all' | 1 | 2 | 3 | 4>('all');
  const [showTableOfContents, setShowTableOfContents] = useState(false);

  const [sessionSearchQuery, setSessionSearchQuery] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isGlobalSearchMode, setIsGlobalSearchMode] = useState(false);
  const [posFilter, setPosFilter] = useState<'all' | PartOfSpeech>('all');
  const [onlyUnmastered, setOnlyUnmastered] = useState(false);
  const [blindRecallMode, setBlindRecallMode] = useState(false);
  const [revealedIdsInBlindMode, setRevealedIdsInBlindMode] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // English Audio State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [speechSpeed, setSpeechSpeed] = useState<SpeechSpeed>(1);
  const [accent, setAccent] = useState<EnglishAccent>('en-US');

  // Per-row interactive written drill state
  const [openDrillId, setOpenDrillId] = useState<string | null>(null);
  const [drillWordInput, setDrillWordInput] = useState('');
  const [drillSentenceInput, setDrillSentenceInput] = useState('');

  useEffect(() => {
    const unsub = subscribeToSpeechState((id) => setPlayingId(id));
    return () => {
      unsub();
      stopEnglishSpeech();
    };
  }, []);

  const masteredSet = useMemo(() => new Set(masteredWordIds), [masteredWordIds]);

  const currentTrackMeta = TRACKS_META[activeTrackId];
  const currentTrackSessions = SESSIONS_BY_TRACK[activeTrackId];
  const palierTabs = PALIER_TABS_BY_TRACK[activeTrackId];

  const visibleSessions = useMemo(
    () => filterSessionsByPalier(currentTrackSessions, selectedPalier),
    [currentTrackSessions, selectedPalier]
  );

  const currentSession: CurriculumSession = useMemo(
    () =>
      currentTrackSessions.find((s) => s.sessionNumber === activeSessionNumber) ||
      currentTrackSessions[0],
    [currentTrackSessions, activeSessionNumber]
  );

  const filteredCurrentSessionWords = useMemo(
    () =>
      filterSessionWords(
        currentSession.words,
        sessionSearchQuery,
        posFilter,
        onlyUnmastered,
        masteredWordIds
      ),
    [currentSession.words, sessionSearchQuery, posFilter, onlyUnmastered, masteredWordIds]
  );

  const globalSearchResults = useMemo(() => {
    if (!isGlobalSearchMode || !globalSearchQuery.trim()) return [];
    return searchGlobalTrackWords(globalSearchQuery, 'all', selectedPalier, posFilter, 90);
  }, [isGlobalSearchMode, globalSearchQuery, selectedPalier, posFilter]);

  const currentSessionMasteredCount = useMemo(
    () => currentSession.words.filter((w) => masteredSet.has(w.id)).length,
    [currentSession.words, masteredSet]
  );

  const isAllCurrentSessionMastered =
    currentSessionMasteredCount === currentSession.words.length;

  const handleSwitchCategory = (trackId: TrackId) => {
    stopEnglishSpeech();
    setSelectedPalier('all');
    onSelectTrack(trackId);
  };

  const handleCopyEntry = (entry: SessionWordEntry) => {
    const text = [
      `[Jour ${String(entry.dayNumber).padStart(2, '0')} · Session ${String(entry.sessionNumber).padStart(2, '0')} · #${String(entry.indexInSession).padStart(2, '0')} · ${entry.level}]`,
      `MOT : EN: ${entry.wordEN} | FR: ${entry.wordFR} | AR: ${entry.wordAR}`,
      `PHRASE EN : ${entry.sentenceEN}`,
      `PHRASE FR : ${entry.sentenceFR}`,
      `PHRASE AR : ${entry.sentenceAR}`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const toggleRevealBlind = (wordId: string) => {
    setRevealedIdsInBlindMode((prev) =>
      prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [...prev, wordId]
    );
  };

  const handleOpenDrill = (entry: SessionWordEntry) => {
    if (openDrillId === entry.id) {
      setOpenDrillId(null);
      return;
    }
    setOpenDrillId(entry.id);
    setDrillWordInput('');
    setDrillSentenceInput('');
  };

  return (
    <div className="space-y-8">
      {/* 1. EDITORIAL FRONTISPIECE & THE 3 VOLUMES (Financial Times / Monocle / Assimil Book Style) */}
      <section className="border-b-2 border-stone-900 pb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-stone-300">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold">
              Méthode Intensive par l’Écrit & l’Écoute · 1 Session = 1 Jour · 2 850 Mots & Phrases
            </div>
            <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-950 tracking-tight leading-[1.1]">
              Apprendre et valider l’anglais professionnel en 90 jours.
            </h1>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed pt-1">
              Trois volumes progressifs conçus pour les réunions quotidiennes, la coordination d’équipe et la gestion de service (Téléphonie IP & Mobile). Chaque session présente <strong className="text-stone-900">30 mots ciblés</strong> et <strong className="text-stone-900">30 phrases complètes</strong> en anglais (avec écoute audio), français et arabe.
            </p>
          </div>

          {/* Global Dictionary Search */}
          <div className="w-full lg:w-80 shrink-0">
            <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1.5 font-semibold">
              Recherche dans l’index (2 850 entrées)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => {
                  setGlobalSearchQuery(e.target.value);
                  setIsGlobalSearchMode(e.target.value.trim().length > 0);
                }}
                placeholder="Mot en anglais, français ou arabe..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-400 text-stone-900 placeholder-stone-400 focus:border-stone-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* THE 3 VOLUMES (CATEGORIES) IN A CLEAN 3-COLUMN ARCHITECTURAL STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-300 pt-6">
          {(['b1_b2', 'b2_c1', 'c1_c2'] as TrackId[]).map((trackId, index) => {
            const meta = TRACKS_META[trackId];
            const sessions = SESSIONS_BY_TRACK[trackId];
            const isSelected = activeTrackId === trackId;
            const cert = validatedCertificates?.[trackId];

            const trackMasteredWords = sessions.reduce(
              (acc, s) => acc + s.words.filter((w) => masteredSet.has(w.id)).length,
              0
            );
            const trackPercent = Math.round((trackMasteredWords / meta.wordCount) * 100);
            const roman = index === 0 ? 'VOLUME I' : index === 1 ? 'VOLUME II' : 'VOLUME III';

            return (
              <div
                key={trackId}
                onClick={() => handleSwitchCategory(trackId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSwitchCategory(trackId);
                }}
                className={`p-5 transition-colors cursor-pointer flex flex-col justify-between ${
                  index === 0 ? 'md:pr-6' : index === 1 ? 'md:px-6' : 'md:pl-6'
                } ${
                  isSelected
                    ? 'bg-white border-t-4 border-t-[#9A3412] shadow-2xs'
                    : 'hover:bg-white/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono-tabular text-stone-500">
                    <span className={isSelected ? 'text-[#9A3412] font-bold' : 'font-semibold'}>
                      {roman} · {meta.dayRangeLabel.split('(')[0]}
                    </span>
                    <span>
                      {meta.sessionCount} Sessions · {meta.wordCount} Mots
                    </span>
                  </div>

                  <h2 className="font-serif-editorial text-xl font-semibold text-stone-950 mt-2">
                    {meta.shortTitleFR}
                  </h2>

                  <p dir="rtl" className="text-xs text-stone-600 font-arabic mt-1">
                    {meta.titleAR}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                  <span className="font-mono-tabular text-stone-600">
                    Acquis : <strong className="text-stone-950">{trackMasteredWords}/{meta.wordCount}</strong> ({trackPercent}%)
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQuizForTrack(trackId);
                    }}
                    className="text-[#9A3412] hover:underline font-semibold cursor-pointer"
                  >
                    {cert ? '✓ Certificat obtenu' : 'Examen de validation →'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* IF GLOBAL SEARCH IS ACTIVE */}
      {isGlobalSearchMode ? (
        <section className="bg-white border border-stone-300 p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold">
                Index Général (2 850 mots & phrases)
              </span>
              <h2 className="font-serif-editorial text-2xl text-stone-950 mt-1">
                {globalSearchResults.length} résultat(s) pour « {globalSearchQuery} »
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setGlobalSearchQuery('');
                setIsGlobalSearchMode(false);
              }}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white cursor-pointer"
            >
              Fermer la recherche
            </button>
          </div>

          <div className="divide-y divide-stone-200">
            {globalSearchResults.map((entry) => (
              <div key={entry.id} className="py-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                <div className="lg:col-span-4 space-y-1">
                  <div className="text-xs font-mono-tabular text-stone-500">
                    Jour {entry.dayNumber} · Session {entry.sessionNumber} · #{entry.indexInSession} ({entry.level})
                  </div>
                  <div className="flex items-center gap-3">
                    <strong className="font-serif-editorial text-lg text-stone-950">{entry.wordEN}</strong>
                    <button
                      type="button"
                      onClick={() => speakEnglishText(entry.wordEN, `gs-w-${entry.id}`, { rate: speechSpeed, accent })}
                      className="px-2 py-0.5 border border-stone-300 text-xs font-medium hover:bg-stone-100 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" /> Mot
                    </button>
                  </div>
                  <div className="text-xs text-stone-600">{entry.wordFR}</div>
                  <div dir="rtl" className="text-xs font-bold text-stone-800 font-arabic">{entry.wordAR}</div>
                </div>

                <div className="lg:col-span-6 space-y-1 text-xs">
                  <div className="text-stone-950 font-medium">“{entry.sentenceEN}”</div>
                  <div className="text-stone-600">« {entry.sentenceFR} »</div>
                  <div dir="rtl" className="text-stone-800 font-arabic">« {entry.sentenceAR} »</div>
                </div>

                <div className="lg:col-span-2 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setIsGlobalSearchMode(false);
                      setGlobalSearchQuery('');
                      onSelectTrack(entry.trackId);
                      onSelectSession(entry.sessionNumber);
                    }}
                    className="text-xs font-semibold text-[#9A3412] underline cursor-pointer"
                  >
                    Ouvrir Session {entry.sessionNumber} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* 2. ACTIVE CHAPTER (SESSION) HEADER & TABLE OF CONTENTS BAR */
        <section className="space-y-6">
          {/* Chapter Navigation Bar */}
          <div className="bg-[#EFECE4] border-y border-stone-400 p-5 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Direct Chapter / Session Selector */}
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-xs font-mono-tabular uppercase tracking-wider text-stone-600 shrink-0 font-semibold">
                  Chapitre / Session :
                </span>
                <select
                  value={currentSession.sessionNumber}
                  onChange={(e) => {
                    stopEnglishSpeech();
                    onSelectSession(Number(e.target.value));
                  }}
                  className="w-full sm:max-w-lg min-w-0 px-3.5 py-2.5 text-sm font-semibold bg-white border border-stone-400 text-stone-950 focus:border-stone-900 focus:outline-none cursor-pointer truncate"
                >
                  {currentTrackSessions.map((s) => {
                    const count = s.words.filter((w) => masteredSet.has(w.id)).length;
                    return (
                      <option key={s.id} value={s.sessionNumber}>
                        Session {String(s.sessionNumber).padStart(2, '0')}/{currentTrackMeta.sessionCount} (Jour {String(s.dayNumber).padStart(2, '0')}) — {s.titleFR} ({count}/30)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Prev / Next + Sommaire Toggle */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={currentSession.sessionNumber <= 1}
                  onClick={() => {
                    stopEnglishSpeech();
                    onSelectSession(Math.max(1, currentSession.sessionNumber - 1));
                  }}
                  className="px-3.5 py-2 bg-white border border-stone-400 hover:border-stone-900 disabled:opacity-40 text-xs font-semibold text-stone-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Session précédente</span>
                </button>

                <button
                  type="button"
                  disabled={currentSession.sessionNumber >= currentTrackMeta.sessionCount}
                  onClick={() => {
                    stopEnglishSpeech();
                    onSelectSession(
                      Math.min(currentTrackMeta.sessionCount, currentSession.sessionNumber + 1)
                    );
                  }}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-xs font-semibold text-[#F6F3EC] inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Session suivante (S{String(Math.min(currentTrackMeta.sessionCount, currentSession.sessionNumber + 1)).padStart(2, '0')})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowTableOfContents((v) => !v)}
                  className={`px-3.5 py-2 border text-xs font-semibold cursor-pointer ${
                    showTableOfContents
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-800 border-stone-400 hover:border-stone-900'
                  }`}
                >
                  {showTableOfContents
                    ? 'Fermer la table des matières'
                    : `Table des ${currentTrackMeta.sessionCount} sessions`}
                </button>
              </div>
            </div>

            {/* Collapsible Table of Contents (Clean Book Index) */}
            {showTableOfContents && (
              <div className="pt-4 border-t border-stone-300 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {palierTabs.map((tab) => {
                    const active = selectedPalier === tab.id;
                    return (
                      <button
                        key={String(tab.id)}
                        type="button"
                        onClick={() => setSelectedPalier(tab.id)}
                        className={`px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                          active
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-white text-stone-700 border-stone-300 hover:border-stone-600'
                        }`}
                      >
                        {tab.label} ({tab.range})
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-80 overflow-y-auto p-1">
                  {visibleSessions.map((session) => {
                    const masteredInSess = session.words.filter((w) =>
                      masteredSet.has(w.id)
                    ).length;
                    const isCurrent = session.sessionNumber === currentSession.sessionNumber;

                    return (
                      <button
                        key={session.id}
                        type="button"
                        onClick={() => {
                          stopEnglishSpeech();
                          onSelectSession(session.sessionNumber);
                          setShowTableOfContents(false);
                        }}
                        className={`text-left p-2.5 border transition-colors cursor-pointer flex items-baseline justify-between gap-2 ${
                          isCurrent
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-white text-stone-800 border-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <div className="truncate text-xs">
                          <strong className="font-mono-tabular mr-1.5">
                            S{String(session.sessionNumber).padStart(2, '0')} (J{String(session.dayNumber).padStart(2, '0')})
                          </strong>
                          <span>{session.titleFR}</span>
                        </div>
                        <span
                          className={`font-mono-tabular text-[11px] shrink-0 ${
                            isCurrent ? 'text-stone-300' : 'text-stone-500'
                          }`}
                        >
                          {masteredInSess}/30
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Active Session Editorial Title Block */}
          <div className="bg-white border border-stone-300 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-stone-200">
              <div className="space-y-1.5">
                <div className="text-xs font-mono-tabular uppercase tracking-widest text-[#9A3412] font-semibold">
                  Jour {String(currentSession.dayNumber).padStart(2, '0')} sur 95 · Session {String(currentSession.sessionNumber).padStart(2, '0')} sur {currentTrackMeta.sessionCount} · Niveau {currentSession.level}
                </div>
                <h2 className="font-serif-editorial text-2xl sm:text-3xl text-stone-950">
                  {currentSession.titleFR}
                </h2>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-stone-600 pt-1">
                  <span>Anglais : <strong className="text-stone-900 font-medium">{currentSession.titleEN}</strong></span>
                  <span dir="rtl" className="text-stone-800 font-arabic font-semibold">
                    {currentSession.titleAR}
                  </span>
                </div>
              </div>

              {/* Audio & Study Toolbar */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <div className="inline-flex items-center border border-stone-300 bg-[#F6F3EC] px-2.5 py-1.5 text-xs gap-2">
                  <Volume2 className="w-3.5 h-3.5 text-[#9A3412]" />
                  <span className="text-stone-600">Prononciation EN :</span>
                  <button
                    type="button"
                    onClick={() => setAccent(accent === 'en-US' ? 'en-GB' : 'en-US')}
                    className="font-mono-tabular font-bold text-stone-950 underline cursor-pointer"
                  >
                    {accent === 'en-US' ? 'US' : 'UK'}
                  </button>
                  <span className="text-stone-300">|</span>
                  <button
                    type="button"
                    onClick={() => setSpeechSpeed(speechSpeed === 1 ? 0.82 : 1)}
                    className="font-mono-tabular font-bold text-stone-950 underline cursor-pointer"
                  >
                    {speechSpeed === 1 ? 'Vitesse 1.0x' : 'Lent 0.85x'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBlindRecallMode((v) => !v);
                    setRevealedIdsInBlindMode([]);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold border inline-flex items-center gap-1.5 cursor-pointer ${
                    blindRecallMode
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-700 border-stone-300 hover:border-stone-800'
                  }`}
                >
                  {blindRecallMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{blindRecallMode ? 'Afficher l’anglais' : 'Masquer l’anglais (Auto-Test)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onMarkEntireSessionMastered(
                      currentSession.words.map((w) => w.id),
                      !isAllCurrentSessionMastered
                    )
                  }
                  className={`px-3 py-1.5 text-xs font-semibold border cursor-pointer ${
                    isAllCurrentSessionMastered
                      ? 'bg-[#14532D] text-white border-[#14532D]'
                      : 'bg-white text-stone-800 border-stone-300 hover:border-stone-800'
                  }`}
                >
                  {isAllCurrentSessionMastered
                    ? '✓ Session validée (30/30)'
                    : `Tout valider (${currentSessionMasteredCount}/30)`}
                </button>
              </div>
            </div>

            {/* Filter Row */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative w-60">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={sessionSearchQuery}
                    onChange={(e) => setSessionSearchQuery(e.target.value)}
                    placeholder="Filtrer dans ces 30 mots..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F6F3EC] border border-stone-300 text-stone-900 placeholder-stone-400 focus:border-stone-900 focus:bg-white focus:outline-none"
                  />
                </div>

                <select
                  value={posFilter}
                  onChange={(e) => setPosFilter(e.target.value as 'all' | PartOfSpeech)}
                  className="px-3 py-1.5 text-xs bg-[#F6F3EC] border border-stone-300 text-stone-800 focus:outline-none cursor-pointer"
                >
                  {POS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setOnlyUnmastered((v) => !v)}
                  className={`px-3 py-1.5 text-xs font-medium border cursor-pointer ${
                    onlyUnmastered
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-[#F6F3EC] text-stone-700 border-stone-300'
                  }`}
                >
                  {onlyUnmastered ? 'Non acquis uniquement' : 'Afficher les 30 entrées'}
                </button>
              </div>

              <div className="text-xs font-mono-tabular text-stone-500">
                {filteredCurrentSessionWords.length} / 30 entrées affichées
              </div>
            </div>

            {/* 3. THE 30 WORDS & 30 DAILY SENTENCES: CLEAN EDITORIAL BOOK REGISTER (SIDE-BY-SIDE, ZERO CLUTTER) */}
            <div className="mt-6 border-t-2 border-stone-900">
              {/* Desktop Column Headers */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-6 py-3 px-4 bg-[#EFECE4] border-b border-stone-300 text-[11px] font-mono-tabular uppercase tracking-wider text-stone-600 font-semibold">
                <div className="lg:col-span-4">
                  I. Expression Professionnelle (EN · FR · AR)
                </div>
                <div className="lg:col-span-6">
                  II. Phrase Quotidienne en Réunion (EN · FR · AR)
                </div>
                <div className="lg:col-span-2 text-right">
                  Suivi & Écrit
                </div>
              </div>

              {/* The 30 Rows */}
              <div className="divide-y divide-stone-200">
                {filteredCurrentSessionWords.map((entry) => {
                  const isMastered = masteredSet.has(entry.id);
                  const isBlindHidden =
                    blindRecallMode && !revealedIdsInBlindMode.includes(entry.id);
                  const isDrillOpen = openDrillId === entry.id;
                  const recallCheck = evaluateWrittenWordRecall(entry.wordEN, drillWordInput);

                  const wordPlayId = `word-${entry.id}`;
                  const sentencePlayId = `sent-${entry.id}`;
                  const isPlayingWord = playingId === wordPlayId;
                  const isPlayingSentence = playingId === sentencePlayId;

                  return (
                    <div
                      key={entry.id}
                      className={`py-5 px-4 transition-colors ${
                        isMastered ? 'bg-[#F2F6F3]' : 'bg-white hover:bg-[#FAF8F4]'
                      }`}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* COLUMN 1 (4/12): THE WORD IN 3 LANGUAGES + WORD AUDIO */}
                        <div className="lg:col-span-4 space-y-2">
                          <div className="flex items-baseline justify-between gap-2">
                            <div className="flex items-baseline gap-2.5">
                              <span className="font-serif-editorial text-lg font-bold text-[#9A3412]">
                                {String(entry.indexInSession).padStart(2, '0')}.
                              </span>
                              {isBlindHidden ? (
                                <button
                                  type="button"
                                  onClick={() => toggleRevealBlind(entry.id)}
                                  className="px-2.5 py-1 bg-stone-900 text-white text-xs font-semibold cursor-pointer"
                                >
                                  Révéler l’anglais
                                </button>
                              ) : (
                                <h3 className="font-serif-editorial text-xl font-bold text-stone-950 tracking-tight">
                                  {entry.wordEN}
                                </h3>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                speakEnglishText(entry.wordEN, wordPlayId, {
                                  rate: speechSpeed,
                                  accent,
                                })
                              }
                              className={`px-2.5 py-1 text-xs font-semibold border inline-flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors ${
                                isPlayingWord
                                  ? 'bg-[#9A3412] text-white border-[#9A3412]'
                                  : 'bg-[#F6F3EC] hover:bg-stone-200 text-stone-900 border-stone-300'
                              }`}
                              title={`Écouter "${entry.wordEN}" en anglais`}
                            >
                              <Volume2 className="w-3.5 h-3.5 text-[#9A3412]" />
                              <span>{isPlayingWord ? 'Stop' : 'Mot EN'}</span>
                            </button>
                          </div>

                          <div className="pl-7 space-y-1">
                            <p className="text-sm font-semibold text-stone-700">
                              <span className="text-[10px] font-mono-tabular uppercase text-stone-400 mr-1.5">
                                FR
                              </span>
                              {entry.wordFR}
                            </p>
                            <p dir="rtl" className="text-base font-bold text-[#14532D] font-arabic text-right">
                              {entry.wordAR}
                            </p>
                            <span className="inline-block text-[11px] font-mono-tabular text-stone-400">
                              {entry.partOfSpeechLabelFR} · #{entry.globalIndex}/{currentTrackMeta.wordCount}
                            </span>
                          </div>
                        </div>

                        {/* COLUMN 2 (6/12): THE DAILY SENTENCE IN 3 LANGUAGES + SENTENCE AUDIO */}
                        <div className="lg:col-span-6 lg:border-l lg:border-stone-200 lg:pl-6 space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            {isBlindHidden ? (
                              <button
                                type="button"
                                onClick={() => toggleRevealBlind(entry.id)}
                                className="text-xs text-[#9A3412] underline cursor-pointer"
                              >
                                Afficher la phrase en anglais
                              </button>
                            ) : (
                              <p className="text-[15px] font-semibold text-stone-950 leading-relaxed">
                                “{entry.sentenceEN}”
                              </p>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                speakEnglishText(entry.sentenceEN, sentencePlayId, {
                                  rate: speechSpeed,
                                  accent,
                                })
                              }
                              className={`px-2.5 py-1 text-xs font-semibold border inline-flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors ${
                                isPlayingSentence
                                  ? 'bg-[#9A3412] text-white border-[#9A3412]'
                                  : 'bg-[#F6F3EC] hover:bg-stone-200 text-stone-900 border-stone-300'
                              }`}
                              title="Écouter la phrase complète en anglais"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-[#9A3412]" />
                              <span>{isPlayingSentence ? 'Stop' : 'Phrase EN'}</span>
                            </button>
                          </div>

                          <p className="text-sm text-stone-600 leading-relaxed">
                            « {entry.sentenceFR} »
                          </p>

                          <p dir="rtl" className="text-sm font-medium text-stone-800 font-arabic leading-relaxed text-right">
                            « {entry.sentenceAR} »
                          </p>
                        </div>

                        {/* COLUMN 3 (2/12): SUBTLE ACTIONS */}
                        <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-end justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onToggleMasteredWord(entry.id)}
                            className={`px-3 py-1.5 text-xs font-semibold border inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                              isMastered
                                ? 'bg-[#14532D] text-white border-[#14532D]'
                                : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isMastered ? 'Acquis' : 'Marquer acquis'}</span>
                          </button>

                          <div className="flex items-center gap-3 text-xs text-stone-500 pt-1">
                            <button
                              type="button"
                              onClick={() => handleOpenDrill(entry)}
                              className={`hover:text-stone-950 inline-flex items-center gap-1 cursor-pointer ${
                                isDrillOpen ? 'text-[#9A3412] font-bold' : ''
                              }`}
                            >
                              <Keyboard className="w-3.5 h-3.5" />
                              <span>Écrire</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopyEntry(entry)}
                              className="hover:text-stone-950 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>{copiedId === entry.id ? 'Copié' : 'Copier'}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* OPTIONAL WRITTEN PRACTICE DRAWER */}
                      {isDrillOpen && (
                        <div className="mt-4 pt-4 border-t border-stone-200 bg-[#F6F3EC] p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              1. Tapez l’expression en anglais ({entry.wordFR}) :
                            </label>
                            <input
                              type="text"
                              value={drillWordInput}
                              onChange={(e) => setDrillWordInput(e.target.value)}
                              placeholder={entry.wordEN}
                              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 focus:border-stone-900 focus:outline-none"
                            />
                            {drillWordInput.trim().length > 0 && (
                              <p
                                className={`text-xs font-semibold mt-1 ${
                                  recallCheck.isMatch ? 'text-[#14532D]' : 'text-[#9A3412]'
                                }`}
                              >
                                {recallCheck.isMatch ? '✓ Exact' : `Modèle : ${entry.wordEN}`}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              2. Réécrivez la phrase en anglais :
                            </label>
                            <input
                              type="text"
                              value={drillSentenceInput}
                              onChange={(e) => setDrillSentenceInput(e.target.value)}
                              placeholder={entry.sentenceEN}
                              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 focus:border-stone-900 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Chapter Navigation */}
            <div className="mt-8 pt-6 border-t-2 border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-mono-tabular text-stone-600">
                Fin de la Session {String(currentSession.sessionNumber).padStart(2, '0')}/{currentTrackMeta.sessionCount} (Jour {String(currentSession.dayNumber).padStart(2, '0')}/95) ·{' '}
                <strong className="text-stone-950">{currentSessionMasteredCount}/30 expressions acquises</strong>
              </div>

              <div className="flex items-center gap-3">
                {currentSession.sessionNumber > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      stopEnglishSpeech();
                      onSelectSession(currentSession.sessionNumber - 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 border border-stone-400 text-xs font-semibold text-stone-900 hover:border-stone-900 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Session {currentSession.sessionNumber - 1}</span>
                  </button>
                )}

                {currentSession.sessionNumber < currentTrackMeta.sessionCount ? (
                  <button
                    type="button"
                    onClick={() => {
                      stopEnglishSpeech();
                      onSelectSession(currentSession.sessionNumber + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-[#F6F3EC] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Passer à la Session {currentSession.sessionNumber + 1} (Jour {currentSession.dayNumber + 1})</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      stopEnglishSpeech();
                      onOpenQuizForTrack(activeTrackId);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 bg-[#9A3412] hover:bg-[#7C2D12] text-white text-xs font-semibold cursor-pointer"
                  >
                    Passer l’examen de validation {currentTrackMeta.targetLevel} →
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
