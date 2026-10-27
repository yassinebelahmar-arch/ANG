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
  CheckSquare,
  Square,
  ArrowUpRight,
  Volume2,
  Calendar,
  Award,
  Smartphone,
  Sparkles,
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
}

const PALIER_TABS_BY_TRACK: Record<
  TrackId,
  Array<{ id: 'all' | 1 | 2 | 3 | 4; label: string; range: string; level: string }>
> = {
  b1_b2: [
    { id: 'all', label: 'Toutes les 25 Sessions', range: 'S01–S25 · 750 mots · Jours 01–25', level: 'B1/B1+ → B2+' },
    { id: 1, label: 'Étape 1 · Bases Pro & Réunions', range: 'Sessions 01–06 · 180 mots', level: 'B1 → B1+' },
    { id: 2, label: 'Étape 2 · Coordination & E-mails', range: 'Sessions 07–13 · 210 mots', level: 'B1+ → B2' },
    { id: 3, label: 'Étape 3 · Téléphonie IP & Mobile', range: 'Sessions 14–19 · 180 mots', level: 'Niveau B2' },
    { id: 4, label: 'Étape 4 · Validation Autonomie B2+', range: 'Sessions 20–25 · 180 mots', level: 'Niveau B2+' },
  ],
  b2_c1: [
    { id: 'all', label: 'Toutes les 50 Sessions', range: 'S01–S50 · 1 500 mots · Jours 26–75', level: 'B2 → C1+' },
    { id: 1, label: 'Palier 1 · Fondations & Réunions', range: 'Sessions 01–12 · 360 mots', level: 'Niveau B2' },
    { id: 2, label: 'Palier 2 · Opérations & Projets', range: 'Sessions 13–25 · 390 mots', level: 'Niveau B2+' },
    { id: 3, label: 'Palier 3 · Négociation & Télécom', range: 'Sessions 26–38 · 390 mots', level: 'Niveau C1' },
    { id: 4, label: 'Palier 4 · Leadership & Comités', range: 'Sessions 39–50 · 360 mots', level: 'Niveau C1+' },
  ],
  c1_c2: [
    { id: 'all', label: 'Toutes les 20 Sessions', range: 'S01–S20 · 600 mots · Jours 76–95', level: 'C1+ → C2' },
    { id: 1, label: 'Étape 1 · Diplomatie & Nuance COMEX', range: 'Sessions 01–05 · 150 mots', level: 'C1+ → C2' },
    { id: 2, label: 'Étape 2 · Négociation & Crises C-Level', range: 'Sessions 06–10 · 150 mots', level: 'Niveau C2' },
    { id: 3, label: 'Étape 3 · Arbitrage & Architecture', range: 'Sessions 11–15 · 150 mots', level: 'Niveau C2' },
    { id: 4, label: 'Étape 4 · Maîtrise Exécutive Native', range: 'Sessions 16–20 · 150 mots', level: 'C2 Master' },
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
  onOpenInstallModal,
}) => {
  const [selectedPalier, setSelectedPalier] = useState<'all' | 1 | 2 | 3 | 4>('all');
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
    <div className="space-y-6">
      {/* 1. HERO BANNER: APPRENDRE L'ANGLAIS PROFESSIONNEL EN 90 JOURS (AVEC VISUEL ATTRACTIF) */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 items-center">
          {/* Left 8 cols: Compelling Copy & Value Proposition */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Programme Accéléré · 1 Session = 1 Jour
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-xs font-semibold">
                25 + 50 + 20 Sessions · 2 850 Mots & 2 850 Phrases
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
              Apprendre & Valider l’Anglais Professionnel en{' '}
              <span className="text-teal-400 underline decoration-teal-500/50 underline-offset-4">
                90 Jours
              </span>{' '}
              : Parler, Écrire & Réussir vos Réunions
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Une méthode intensive pensée pour les responsables opérationnels, chefs de projet et Service Delivery Managers :{' '}
              <strong className="text-white">30 mots ciblés + 30 phrases professionnelles quotidiennes par jour</strong>, traduits en{' '}
              <strong className="text-teal-300">Anglais (avec écoute audio native)</strong>,{' '}
              <strong className="text-white">Français (C1)</strong> et{' '}
              <strong className="text-amber-300">Arabe</strong>, pour valider successivement les niveaux{' '}
              <strong className="text-white">B2+, C1+ et C2 Exécutif</strong>.
            </p>

            {/* Key Quick Actions & Audio / Mobile App Highlight */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onOpenQuizForTrack(activeTrackId)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-sm"
              >
                <Award className="w-4 h-4" />
                Valider mon Niveau ({currentTrackMeta.targetLevel})
              </button>

              <button
                type="button"
                onClick={onOpenInstallModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-teal-400" />
                Télécharger l’Application (Android & iOS)
              </button>
            </div>
          </div>

          {/* Right 4 cols: Attention-Grabbing Visual Illustration (90-Day Roadmap SVG Graphic) */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="w-full max-w-sm rounded-xl bg-slate-950/90 border border-slate-800 p-4 shadow-inner">
              <svg
                viewBox="0 0 360 220"
                className="w-full h-auto"
                role="img"
                aria-label="Trajectoire 90 Jours B1 vers C2"
              >
                <defs>
                  <linearGradient id="roadGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="55%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
                {/* Background Grid */}
                <g stroke="#1e293b" strokeWidth="1">
                  <line x1="20" y1="40" x2="340" y2="40" />
                  <line x1="20" y1="90" x2="340" y2="90" />
                  <line x1="20" y1="140" x2="340" y2="140" />
                  <line x1="20" y1="190" x2="340" y2="190" />
                </g>

                {/* Header label inside graphic */}
                <text x="20" y="24" fill="#94a3b8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  PARCOURS CERTIFIANT · 1 JOUR = 30 MOTS & 30 PHRASES
                </text>

                {/* Ascending Mastery Curve */}
                <path
                  d="M 35 175 Q 115 160, 145 120 T 255 70 T 325 38"
                  fill="none"
                  stroke="url(#roadGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Milestone 1: B1 -> B2+ */}
                <circle cx="55" cy="168" r="8" fill="#0d9488" stroke="#ccfbf1" strokeWidth="2" />
                <rect x="22" y="128" width="96" height="30" rx="5" fill="#0f766e" />
                <text x="30" y="141" fill="#ffffff" fontSize="9" fontWeight="bold">
                  1. B1/B1+ → B2+
                </text>
                <text x="30" y="152" fill="#99f6e4" fontSize="8" fontFamily="monospace">
                  25 Jours · 750 mots
                </text>

                {/* Milestone 2: B2 -> C1+ */}
                <circle cx="185" cy="100" r="9" fill="#d97706" stroke="#fef3c7" strokeWidth="2" />
                <rect x="132" y="56" width="108" height="32" rx="5" fill="#b45309" />
                <text x="140" y="70" fill="#ffffff" fontSize="9" fontWeight="bold">
                  2. B2 → C1 / C1+
                </text>
                <text x="140" y="81" fill="#fde68a" fontSize="8" fontFamily="monospace">
                  50 Jours · 1 500 mots
                </text>

                {/* Milestone 3: C1+ -> C2 */}
                <circle cx="320" cy="40" r="10" fill="#4f46e5" stroke="#e0e7ff" strokeWidth="2.5" />
                <rect x="236" y="72" width="108" height="32" rx="5" fill="#3730a3" />
                <text x="244" y="86" fill="#ffffff" fontSize="9" fontWeight="bold">
                  3. C1+ → C2 Master
                </text>
                <text x="244" y="97" fill="#c7d2fe" fontSize="8" fontFamily="monospace">
                  20 Jours · 600 mots
                </text>

                {/* Bottom Audio + Trilingual Badge */}
                <rect x="20" y="186" width="320" height="24" rx="4" fill="#0f172a" stroke="#334155" />
                <text x="32" y="202" fill="#38bdf8" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                  🔊 Écoute Audio EN (Mot + Phrase) · Traduction FR & AR
                </text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 3 CATEGORY CARDS (B1->B2+ [25 SESSIONS] | B2->C1+ [50 SESSIONS] | C1+->C2 [20 SESSIONS]) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['b1_b2', 'b2_c1', 'c1_c2'] as TrackId[]).map((trackId) => {
          const meta = TRACKS_META[trackId];
          const sessions = SESSIONS_BY_TRACK[trackId];
          const isSelected = activeTrackId === trackId;

          const trackMasteredWords = sessions.reduce(
            (acc, s) => acc + s.words.filter((w) => masteredSet.has(w.id)).length,
            0
          );
          const trackPercent = Math.round((trackMasteredWords / meta.wordCount) * 100);

          return (
            <div
              key={trackId}
              onClick={() => handleSwitchCategory(trackId)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleSwitchCategory(trackId);
              }}
              className={`rounded-xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-teal-500/40'
                  : 'bg-white hover:bg-stone-50 text-slate-900 border-stone-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : 'bg-stone-100 text-slate-700 border border-stone-200'
                    }`}
                  >
                    {meta.badgeLabel}
                  </span>
                  <span
                    className={`text-xs font-mono font-semibold flex items-center gap-1 ${
                      isSelected ? 'text-amber-300' : 'text-teal-800'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {meta.dayRangeLabel}
                  </span>
                </div>

                <h2 className="text-lg font-bold mt-3 tracking-tight">
                  Catégorie {meta.categoryNumber} : {meta.shortTitleFR}
                </h2>
                <p
                  className={`text-xs mt-1 leading-relaxed ${
                    isSelected ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {meta.subtitleFR}
                </p>
                <p
                  dir="rtl"
                  className={`text-xs font-medium mt-1.5 ${
                    isSelected ? 'text-teal-300' : 'text-teal-900'
                  }`}
                >
                  {meta.titleAR}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={isSelected ? 'text-slate-300' : 'text-slate-600'}>
                    Progression : {trackMasteredWords} / {meta.wordCount} mots ({trackPercent}%)
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQuizForTrack(trackId);
                    }}
                    className={`underline font-semibold cursor-pointer ${
                      isSelected ? 'text-amber-300 hover:text-amber-200' : 'text-teal-700 hover:text-teal-900'
                    }`}
                  >
                    Quiz de validation →
                  </button>
                </div>
                <div className="w-full h-1.5 bg-stone-200/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 transition-all"
                    style={{ width: `${trackPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. ACTIVE CATEGORY HEADER, GLOBAL SEARCH & AUDIO VOICE SETTINGS */}
      <section className="bg-white border border-stone-200 rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-stone-200">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded font-bold">
                {currentTrackMeta.badgeLabel} · 1 SESSION = 1 JOUR ({currentTrackMeta.dayRangeLabel})
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 tracking-tight">
              {currentTrackMeta.titleFR}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Chaque session quotidienne comporte <strong className="text-slate-900">30 mots professionnels</strong> et{' '}
              <strong className="text-slate-900">30 phrases complètes</strong> utilisées dans les réunions quotidiennes.{' '}
              <strong className="text-teal-800">Cliquez sur les boutons d’écoute 🔊 pour entendre chaque mot et chaque phrase en anglais</strong>{' '}
              (le français et l’arabe restent affichés à l’écrit pour créer la liaison immédiate).
            </p>
          </div>

          {/* Global Search across all 2,850 words + English Voice Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            {/* Voice Speed & Accent Selector */}
            <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-2 rounded-lg border border-stone-200">
              <Volume2 className="w-4 h-4 text-teal-700 shrink-0" />
              <span className="text-xs font-semibold text-slate-700">Audio EN :</span>
              <button
                type="button"
                onClick={() => setAccent(accent === 'en-US' ? 'en-GB' : 'en-US')}
                className="px-2 py-1 text-xs font-mono font-semibold bg-white border border-stone-300 rounded text-slate-800 hover:bg-stone-50 cursor-pointer"
                title="Basculer entre l'accent américain et britannique"
              >
                {accent === 'en-US' ? 'US' : 'UK'}
              </button>
              <button
                type="button"
                onClick={() => setSpeechSpeed(speechSpeed === 1 ? 0.82 : 1)}
                className={`px-2 py-1 text-xs font-mono font-semibold border rounded cursor-pointer ${
                  speechSpeed === 0.82
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-white border-stone-300 text-slate-800 hover:bg-stone-50'
                }`}
                title="Basculer entre la vitesse normale (1.0x) et lente (0.85x)"
              >
                {speechSpeed === 1 ? '1.0x Normal' : '0.85x Lent'}
              </button>
            </div>

            {/* Global Search Input */}
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => {
                  setGlobalSearchQuery(e.target.value);
                  if (e.target.value.trim().length > 0) {
                    setIsGlobalSearchMode(true);
                  } else {
                    setIsGlobalSearchMode(false);
                  }
                }}
                placeholder="Rechercher dans les 2 850 mots..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:border-teal-700 focus:bg-white focus:outline-none text-slate-900"
              />
            </div>
            {isGlobalSearchMode && (
              <button
                type="button"
                onClick={() => {
                  setGlobalSearchQuery('');
                  setIsGlobalSearchMode(false);
                }}
                className="px-3 py-2 text-xs font-semibold bg-stone-200 text-slate-800 hover:bg-stone-300 rounded-lg cursor-pointer"
              >
                Fermer recherche
              </button>
            )}
          </div>
        </div>

        {/* 4 Paliers / Étapes Selector inside the current Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-5">
          {palierTabs.map((tab) => {
            const active = selectedPalier === tab.id;
            return (
              <button
                key={String(tab.id)}
                type="button"
                onClick={() => setSelectedPalier(tab.id)}
                className={`text-left p-3 rounded-lg border transition-colors cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-stone-50 text-slate-800 border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded font-semibold ${
                      active ? 'bg-teal-600 text-white' : 'bg-stone-200 text-slate-700'
                    }`}
                  >
                    {tab.level}
                  </span>
                  <span
                    className={`font-mono text-[11px] ${
                      active ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {tab.range.split('·')[0]}
                  </span>
                </div>
                <p className="font-semibold text-xs mt-1.5 leading-snug">{tab.label}</p>
              </button>
            );
          })}
        </div>

        {/* Session Navigator Grid (Each button = 1 Session = 1 Day) */}
        <div className="pt-5 mt-5 border-t border-stone-200">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-slate-600 font-semibold">
              CALENDRIER ACCÉLÉRÉ ({visibleSessions.length} SESSIONS AFFICHÉES · 1 SESSION = 1 JOUR) :
            </span>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-600 inline-block rounded-xs"></span> Session terminée (30/30)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-teal-700 inline-block rounded-xs"></span> Session active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-13 lg:grid-cols-25 gap-1.5">
            {visibleSessions.map((session) => {
              const masteredInSess = session.words.filter((w) => masteredSet.has(w.id)).length;
              const isCompleted = masteredInSess === 30;
              const isCurrent =
                !isGlobalSearchMode && session.sessionNumber === currentSession.sessionNumber;

              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => {
                    stopEnglishSpeech();
                    setIsGlobalSearchMode(false);
                    onSelectSession(session.sessionNumber);
                  }}
                  title={`Jour ${session.dayNumber} · Session ${session.sessionNumber} (${session.level}) : ${session.titleFR} — ${masteredInSess}/30 maîtrisés`}
                  className={`py-2 px-1 rounded-md border text-center transition-colors cursor-pointer flex flex-col items-center justify-center ${
                    isCurrent
                      ? 'bg-teal-700 text-white border-teal-700 font-bold shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold hover:bg-emerald-100'
                      : masteredInSess > 0
                      ? 'bg-amber-50 text-amber-900 border-amber-200 hover:border-amber-400'
                      : 'bg-white text-slate-700 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <span className="font-mono text-xs leading-none">
                    S{String(session.sessionNumber).padStart(2, '0')}
                  </span>
                  <span
                    className={`font-mono text-[9px] mt-1 leading-none ${
                      isCurrent ? 'text-teal-100' : 'text-slate-400'
                    }`}
                  >
                    J{String(session.dayNumber).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* IF GLOBAL SEARCH MODE IS ACTIVE */}
      {isGlobalSearchMode && (
        <section className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <span className="font-mono text-xs uppercase text-teal-700 font-semibold">
                RÉSULTATS DANS LES 95 SESSIONS (2 850 MOTS & PHRASES)
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {globalSearchResults.length} résultat(s) pour « {globalSearchQuery} »
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setGlobalSearchQuery('');
                setIsGlobalSearchMode(false);
              }}
              className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg cursor-pointer"
            >
              Retourner à la Session {currentSession.sessionNumber} (Jour {currentSession.dayNumber})
            </button>
          </div>

          {globalSearchResults.length === 0 ? (
            <p className="text-sm text-slate-600 py-8 text-center">
              Aucun mot ou phrase ne correspond à « {globalSearchQuery} ». Essayez un terme en anglais, en français ou en arabe.
            </p>
          ) : (
            <div className="space-y-3">
              {globalSearchResults.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 border border-stone-200 rounded-xl hover:border-stone-400 transition-colors bg-stone-50/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-900 text-white rounded">
                        Jour {String(entry.dayNumber).padStart(2, '0')} · S{String(entry.sessionNumber).padStart(2, '0')} · #{String(entry.indexInSession).padStart(2, '0')}
                      </span>
                      <span className="font-mono text-xs px-2 py-0.5 bg-teal-50 text-teal-800 border border-teal-200 rounded font-semibold">
                        {entry.level}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {entry.partOfSpeechLabelFR}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsGlobalSearchMode(false);
                        setGlobalSearchQuery('');
                        onSelectTrack(entry.trackId);
                        onSelectSession(entry.sessionNumber);
                      }}
                      className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Ouvrir la Session {entry.sessionNumber}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pb-3 border-b border-stone-200">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] uppercase text-slate-400 block">
                          MOT ANGLAIS
                        </span>
                        <span className="font-bold text-slate-900 text-base">{entry.wordEN}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          speakEnglishText(entry.wordEN, `search-w-${entry.id}`, {
                            rate: speechSpeed,
                            accent,
                          })
                        }
                        className="p-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 cursor-pointer"
                        title="Écouter le mot en anglais"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase text-slate-400 block">
                        TRADUCTION FRANÇAIS
                      </span>
                      <span className="font-medium text-slate-800 text-sm">{entry.wordFR}</span>
                    </div>
                    <div dir="rtl" className="text-right">
                      <span className="font-mono text-[10px] uppercase text-slate-400 block">
                        الترجمة بالعربية
                      </span>
                      <span className="font-bold text-teal-900 text-base">{entry.wordAR}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs">
                    <div className="text-slate-900 font-medium flex items-start justify-between gap-2">
                      <span>
                        <strong className="font-mono text-[10px] text-teal-700 uppercase block mb-0.5">
                          Phrase Pro (EN)
                        </strong>
                        {entry.sentenceEN}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          speakEnglishText(entry.sentenceEN, `search-s-${entry.id}`, {
                            rate: speechSpeed,
                            accent,
                          })
                        }
                        className="p-1.5 rounded bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 shrink-0 cursor-pointer"
                        title="Écouter la phrase en anglais"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-slate-700">
                      <strong className="font-mono text-[10px] text-slate-500 uppercase block mb-0.5">
                        Phrase Pro (FR)
                      </strong>
                      {entry.sentenceFR}
                    </div>
                    <div dir="rtl" className="text-right text-slate-800">
                      <strong className="font-mono text-[10px] text-emerald-700 uppercase block mb-0.5">
                        الجملة اليومية (AR)
                      </strong>
                      {entry.sentenceAR}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 4. ACTIVE SESSION VIEW (30 WORDS + 30 DAILY SENTENCES IN EN · FR · AR + ENGLISH AUDIO) */}
      {!isGlobalSearchMode && (
        <section className="space-y-6">
          {/* Active Session Banner */}
          <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase px-2.5 py-1 bg-amber-500 text-slate-950 rounded">
                    JOUR {String(currentSession.dayNumber).padStart(2, '0')} / 95
                  </span>
                  <span className="font-mono text-xs font-bold uppercase px-2.5 py-1 bg-teal-600 text-white rounded">
                    SESSION {String(currentSession.sessionNumber).padStart(2, '0')} / {currentTrackMeta.sessionCount}
                  </span>
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-slate-800 text-teal-300 border border-slate-700 rounded">
                    Objectif : {currentSession.level}
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    {currentSession.palierLabel}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-1">
                  {currentSession.titleFR}
                </h2>
                <p className="text-sm text-slate-300 font-medium">
                  EN : <span className="text-white">{currentSession.titleEN}</span>
                </p>
                <p dir="rtl" className="text-sm text-emerald-300 font-semibold">
                  {currentSession.titleAR}
                </p>
              </div>

              {/* Prev / Next Session Navigation Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={currentSession.sessionNumber <= 1}
                  onClick={() => {
                    stopEnglishSpeech();
                    onSelectSession(Math.max(1, currentSession.sessionNumber - 1));
                  }}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 border border-slate-700 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Jour précédent
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
                  className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  Jour suivant (S{String(Math.min(currentTrackMeta.sessionCount, currentSession.sessionNumber + 1)).padStart(2, '0')})
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Session Controls: Filter inside the 30 words, Self-Test Mode, Mark Session Complete */}
            <div className="pt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Filter within current 30 words */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={sessionSearchQuery}
                    onChange={(e) => setSessionSearchQuery(e.target.value)}
                    placeholder="Filtrer dans ces 30 mots..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-teal-400 focus:outline-none"
                  />
                </div>

                {/* Part of speech filter */}
                <select
                  value={posFilter}
                  onChange={(e) => setPosFilter(e.target.value as 'all' | PartOfSpeech)}
                  className="px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                >
                  {POS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* Unmastered toggle */}
                <button
                  type="button"
                  onClick={() => setOnlyUnmastered((v) => !v)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    onlyUnmastered
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {onlyUnmastered ? 'Affichage : Non acquis seuls' : 'Afficher tous (30)'}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Blind Written Recall Mode */}
                <button
                  type="button"
                  onClick={() => {
                    setBlindRecallMode((v) => !v);
                    setRevealedIdsInBlindMode([]);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 border transition-colors cursor-pointer ${
                    blindRecallMode
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {blindRecallMode ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      Mode Auto-Test Actif (Cliquer pour révéler l’anglais)
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      Masquer l’anglais (Auto-Test)
                    </>
                  )}
                </button>

                {/* Mark all 30 words in session as mastered */}
                <button
                  type="button"
                  onClick={() =>
                    onMarkEntireSessionMastered(
                      currentSession.words.map((w) => w.id),
                      !isAllCurrentSessionMastered
                    )
                  }
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 border transition-colors cursor-pointer ${
                    isAllCurrentSessionMastered
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {isAllCurrentSessionMastered ? (
                    <>
                      <CheckSquare className="w-3.5 h-3.5" />
                      Jour {currentSession.dayNumber} validé (30/30)
                    </>
                  ) : (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      Valider tout le Jour {currentSession.dayNumber} ({currentSessionMasteredCount}/30)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 30 Words + 30 Daily Sentences List */}
          <div className="space-y-4">
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
                <article
                  key={entry.id}
                  className={`bg-white rounded-xl border transition-colors overflow-hidden ${
                    isMastered
                      ? 'border-emerald-300 bg-emerald-50/15'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {/* Card Top Metadata Bar */}
                  <div className="px-5 py-2.5 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                      <span className="font-bold text-slate-900">
                        MOT #{String(entry.indexInSession).padStart(2, '0')} / 30
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded font-semibold">
                        Jour {String(entry.dayNumber).padStart(2, '0')} / 95
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-teal-800 font-semibold">
                        Session {String(entry.sessionNumber).padStart(2, '0')} ({entry.level})
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600">{entry.partOfSpeechLabelFR}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-400">
                        #{entry.globalIndex}/{currentTrackMeta.wordCount}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenDrill(entry)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1 border transition-colors cursor-pointer ${
                          isDrillOpen
                            ? 'bg-teal-700 text-white border-teal-700'
                            : 'bg-white text-slate-700 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <Keyboard className="w-3.5 h-3.5" />
                        Pratiquer à l’écrit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyEntry(entry)}
                        className="px-2.5 py-1 text-xs font-medium rounded-md bg-white text-slate-700 border border-stone-200 hover:border-stone-300 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedId === entry.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copié</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copier</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleMasteredWord(entry.id)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1 border transition-colors cursor-pointer ${
                          isMastered
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-white text-slate-700 border-stone-300 hover:border-stone-400'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        {isMastered ? 'Maîtrisé' : 'Marquer acquis'}
                      </button>
                    </div>
                  </div>

                  {/* Card Main Content: Row 1 = Trilingual Word | Row 2 = Trilingual Daily Sentence */}
                  <div className="p-5 space-y-5">
                    {/* ROW 1: THE WORD IN 3 LANGUAGES (EN WITH AUDIO · FR TEXT ONLY · AR TEXT ONLY) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-stone-100">
                      {/* 1. English Target Word + Audio Button */}
                      <div className="bg-teal-50/50 border border-teal-200/80 rounded-lg p-3.5 flex items-start justify-between gap-3">
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-teal-800 font-semibold block">
                            1. MOT / EXPRESSION EN ANGLAIS (CIBLE PRO)
                          </span>
                          {isBlindHidden ? (
                            <button
                              type="button"
                              onClick={() => toggleRevealBlind(entry.id)}
                              className="mt-1.5 px-3 py-1.5 bg-teal-700 text-white rounded text-xs font-semibold cursor-pointer"
                            >
                              Révéler le mot anglais
                            </button>
                          ) : (
                            <p className="text-lg font-bold text-slate-900 mt-1 tracking-tight">
                              {entry.wordEN}
                            </p>
                          )}
                        </div>

                        {/* English Word Audio Button */}
                        <button
                          type="button"
                          onClick={() =>
                            speakEnglishText(entry.wordEN, wordPlayId, {
                              rate: speechSpeed,
                              accent,
                            })
                          }
                          className={`px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border shrink-0 transition-colors cursor-pointer ${
                            isPlayingWord
                              ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                              : 'bg-white hover:bg-teal-100 text-teal-900 border-teal-300'
                          }`}
                          title={`Écouter le mot "${entry.wordEN}" en anglais`}
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>{isPlayingWord ? 'Stop' : 'Écouter le mot'}</span>
                        </button>
                      </div>

                      {/* 2. French Translation (No audio per user instruction) */}
                      <div className="bg-stone-50 border border-stone-200/80 rounded-lg p-3.5">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
                          2. TRADUCTION EN FRANÇAIS (PONT C1 · ÉCRIT)
                        </span>
                        <p className="text-base font-semibold text-slate-800 mt-1">
                          {entry.wordFR}
                        </p>
                      </div>

                      {/* 3. Arabic Translation (No audio per user instruction) */}
                      <div
                        dir="rtl"
                        className="bg-emerald-50/40 border border-emerald-200/80 rounded-lg p-3.5 text-right font-arabic"
                      >
                        <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-800 font-semibold block">
                          3. الترجمة باللغة العربية (الربط المباشر · كتابي)
                        </span>
                        <p className="text-lg font-bold text-emerald-950 mt-1">
                          {entry.wordAR}
                        </p>
                      </div>
                    </div>

                    {/* ROW 2: THE DAILY PROFESSIONAL SENTENCE IN 3 LANGUAGES (EN WITH AUDIO · FR TEXT · AR TEXT) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* English Daily Sentence + Audio Button */}
                      <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-lg border border-stone-200/70">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-teal-800 font-semibold">
                            PHRASE PRO EN ANGLAIS (#{String(entry.indexInSession).padStart(2, '0')})
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              speakEnglishText(entry.sentenceEN, sentencePlayId, {
                                rate: speechSpeed,
                                accent,
                              })
                            }
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                              isPlayingSentence
                                ? 'bg-teal-700 text-white border-teal-700'
                                : 'bg-white hover:bg-teal-50 text-teal-800 border-teal-300'
                            }`}
                            title="Écouter la phrase complète en anglais"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{isPlayingSentence ? 'Stop' : 'Écouter la phrase'}</span>
                          </button>
                        </div>

                        {isBlindHidden ? (
                          <button
                            type="button"
                            onClick={() => toggleRevealBlind(entry.id)}
                            className="text-xs text-teal-700 underline cursor-pointer"
                          >
                            Afficher la phrase complète en anglais
                          </button>
                        ) : (
                          <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                            “{entry.sentenceEN}”
                          </p>
                        )}
                      </div>

                      {/* French Daily Sentence */}
                      <div className="space-y-1 p-3.5 rounded-lg bg-white border border-stone-100">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
                          TRADUCTION DE LA PHRASE EN FRANÇAIS
                        </span>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          « {entry.sentenceFR} »
                        </p>
                      </div>

                      {/* Arabic Daily Sentence */}
                      <div
                        dir="rtl"
                        className="space-y-1 p-3.5 rounded-lg bg-white border border-stone-100 text-right font-arabic"
                      >
                        <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-800 font-semibold block">
                          الجملة المهنية اليومية بالعربية
                        </span>
                        <p className="text-sm text-slate-800 leading-relaxed font-medium">
                          « {entry.sentenceAR} »
                        </p>
                      </div>
                    </div>

                    {/* OPTIONAL WRITTEN PRACTICE DRAWER FOR THIS WORD & SENTENCE */}
                    {isDrillOpen && (
                      <div className="mt-4 pt-4 border-t border-stone-200 bg-stone-50 rounded-lg p-4 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold uppercase text-teal-900">
                            ENTRAÎNEMENT ÉCRIT ACTIF · ANCRAGE ORTHOGRAPHIQUE & LEXICAL
                          </span>
                          <span className="text-xs text-slate-500">
                            Cible : <strong>{entry.wordFR}</strong> /{' '}
                            <strong dir="rtl" className="font-arabic">
                              {entry.wordAR}
                            </strong>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Étape 1 : Tapez le mot ou l’expression en anglais :
                            </label>
                            <input
                              type="text"
                              value={drillWordInput}
                              onChange={(e) => setDrillWordInput(e.target.value)}
                              placeholder={`Retapez "${entry.wordEN}"...`}
                              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:border-teal-700 focus:outline-none"
                            />
                            {drillWordInput.trim().length > 0 && (
                              <p
                                className={`text-xs font-semibold mt-1.5 ${
                                  recallCheck.isMatch ? 'text-emerald-700' : 'text-amber-700'
                                }`}
                              >
                                {recallCheck.isMatch
                                  ? '✓ Orthographe exacte ! Le mot est bien ancré.'
                                  : `Continuez... Cible : ${entry.wordEN}`}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Étape 2 : Réécrivez la phrase pro en anglais :
                            </label>
                            <input
                              type="text"
                              value={drillSentenceInput}
                              onChange={(e) => setDrillSentenceInput(e.target.value)}
                              placeholder={entry.sentenceEN}
                              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:border-teal-700 focus:outline-none"
                            />
                            {drillSentenceInput.trim().length > 10 && (
                              <div className="flex items-center justify-between mt-1.5">
                                <span className="text-xs text-emerald-700 font-medium">
                                  ✓ Phrase rédigée ({drillSentenceInput.trim().split(/\s+/).length} mots)
                                </span>
                                {!isMastered && (
                                  <button
                                    type="button"
                                    onClick={() => onToggleMasteredWord(entry.id)}
                                    className="text-xs font-bold text-teal-700 underline cursor-pointer"
                                  >
                                    Valider ce mot comme acquis
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Bottom Session Navigation Footer + Trigger Validation Quiz CTA */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              Fin du <strong className="text-slate-900">Jour {String(currentSession.dayNumber).padStart(2, '0')} / 95</strong>{' '}
              (Session {String(currentSession.sessionNumber).padStart(2, '0')} / {currentTrackMeta.sessionCount}) ·{' '}
              <strong className="text-emerald-700">
                {currentSessionMasteredCount} / 30 mots maîtrisés
              </strong>{' '}
              dans cette session.
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {currentSession.sessionNumber > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    stopEnglishSpeech();
                    onSelectSession(currentSession.sessionNumber - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-slate-700 hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Session {currentSession.sessionNumber - 1}
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
                  className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  Passer au Jour {currentSession.dayNumber + 1} (Session {currentSession.sessionNumber + 1} · 30 nouveaux mots)
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
                  className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Award className="w-4 h-4" />
                  Passer le Quiz Final pour Valider le Niveau {currentTrackMeta.targetLevel}
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
