import {
  DomainCategory,
  LexiconItem,
  MeetingTemplate,
  SentenceBlock,
  WrittenExercise,
} from '../data/sdmData';
import {
  ALL_50_SESSIONS,
  ALL_1500_WORDS,
  ALL_2850_WORDS,
  SESSIONS_BY_TRACK,
  TrackId,
  CurriculumSession,
  PartOfSpeech,
  SessionWordEntry,
} from '../data/curriculum50Sessions';

export interface AssembledSentence {
  english: string;
  french: string;
  arabic: string;
  wordCountEN: number;
  speakingSecondsEstimate: number;
  structureNotes: string[];
}

export interface CustomMeetingContext {
  carrierOrTeamName: string;
  ticketReference: string;
  impactedPerimeter: string;
  targetDeadline: string;
  personalNotesFR: string;
}

export interface GeneratedMeetingSheet {
  id: string;
  createdAt: string;
  templateTitle: string;
  carrierOrTeamName: string;
  ticketReference: string;
  impactedPerimeter: string;
  targetDeadline: string;
  personalNotesFR: string;
  openingEN: string;
  openingFR: string;
  openingAR: string;
  coreDiagnosticEN: string;
  coreDiagnosticFR: string;
  coreDiagnosticAR: string;
  keyQuestions: Array<{ en: string; fr: string; ar: string }>;
  closingActionEN: string;
  closingActionFR: string;
  closingActionAR: string;
  criticalVocab: string[];
}

export interface MasteryStats {
  masteredLexiconCount: number;
  totalLexiconCount: number;
  lexiconPercent: number;
  completedExercisesCount: number;
  totalExercisesCount: number;
  exercisesPercent: number;
  savedPhrasesCount: number;
  savedMeetingSheetsCount: number;
  overallReadinessPercent: number;
  readinessLevelLabel: string;
}

export interface CurriculumProgressSummary {
  totalSessions: number;
  completedSessionsCount: number;
  totalWords: number;
  masteredWordsCount: number;
  masteredPercent: number;
  currentRecommendedSession: number;
  activeLevelLabel: string;
}

export function filterSessionsByPalier(
  sessions: CurriculumSession[],
  palierFilter: 'all' | 1 | 2 | 3 | 4
): CurriculumSession[] {
  if (palierFilter === 'all') return sessions;
  return sessions.filter((s) => s.palier === palierFilter);
}

export function filterSessionWords(
  words: SessionWordEntry[],
  searchQuery: string,
  posFilter: 'all' | PartOfSpeech = 'all',
  onlyUnmastered: boolean = false,
  masteredWordIds: string[] = []
): SessionWordEntry[] {
  const q = searchQuery.trim().toLowerCase();
  const masteredSet = new Set(masteredWordIds);

  return words.filter((item) => {
    if (posFilter !== 'all' && item.partOfSpeech !== posFilter) {
      return false;
    }
    if (onlyUnmastered && masteredSet.has(item.id)) {
      return false;
    }
    if (!q) {
      return true;
    }
    const haystack = [
      item.wordEN,
      item.wordFR,
      item.wordAR,
      item.sentenceEN,
      item.sentenceFR,
      item.sentenceAR,
      `session ${item.sessionNumber}`,
      `#${item.indexInSession}`,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(q);
  });
}

export function searchGlobal1500Words(
  searchQuery: string,
  palierFilter: 'all' | 1 | 2 | 3 | 4 = 'all',
  posFilter: 'all' | PartOfSpeech = 'all',
  limit: number = 90
): SessionWordEntry[] {
  const source =
    palierFilter === 'all'
      ? ALL_1500_WORDS
      : ALL_1500_WORDS.filter((w) => w.palier === palierFilter);

  const filtered = filterSessionWords(source, searchQuery, posFilter, false, []);
  return filtered.slice(0, limit);
}

export function searchGlobalTrackWords(
  searchQuery: string,
  trackFilter: 'all' | TrackId = 'all',
  palierFilter: 'all' | 1 | 2 | 3 | 4 = 'all',
  posFilter: 'all' | PartOfSpeech = 'all',
  limit: number = 90
): SessionWordEntry[] {
  let source =
    trackFilter === 'all'
      ? ALL_2850_WORDS
      : SESSIONS_BY_TRACK[trackFilter].flatMap((s) => s.words);

  if (palierFilter !== 'all') {
    source = source.filter((w) => w.palier === palierFilter);
  }

  const filtered = filterSessionWords(source, searchQuery, posFilter, false, []);
  return filtered.slice(0, limit);
}

export function calculateCurriculumProgress(
  masteredWordIds: string[],
  sessions: CurriculumSession[] = ALL_50_SESSIONS
): CurriculumProgressSummary {
  const masteredSet = new Set(masteredWordIds);
  const totalSessions = sessions.length;
  const totalWords = sessions.reduce((acc, s) => acc + s.words.length, 0);

  let completedSessionsCount = 0;
  let firstIncompleteSession = 1;
  let foundIncomplete = false;

  for (const session of sessions) {
    const masteredInSession = session.words.filter((w) => masteredSet.has(w.id)).length;
    if (masteredInSession === session.words.length && session.words.length > 0) {
      completedSessionsCount += 1;
    } else if (!foundIncomplete) {
      firstIncompleteSession = session.sessionNumber;
      foundIncomplete = true;
    }
  }

  const masteredWordsCount = masteredSet.size;
  const masteredPercent =
    totalWords > 0 ? Math.min(100, Math.round((masteredWordsCount / totalWords) * 100)) : 0;

  let activeLevelLabel = 'Palier 1 · B2 (Fondations Pro)';
  if (masteredWordsCount >= 1140) {
    activeLevelLabel = 'Palier 4 · C1+ (Leadership Exécutif)';
  } else if (masteredWordsCount >= 750) {
    activeLevelLabel = 'Palier 3 · C1 (Négociation & Crises)';
  } else if (masteredWordsCount >= 360) {
    activeLevelLabel = 'Palier 2 · B2+ (Fluidité Opérationnelle)';
  }

  return {
    totalSessions,
    completedSessionsCount,
    totalWords,
    masteredWordsCount,
    masteredPercent,
    currentRecommendedSession: foundIncomplete ? firstIncompleteSession : totalSessions,
    activeLevelLabel,
  };
}

export function evaluateWrittenWordRecall(
  targetWordEN: string,
  userAttempt: string
): { isMatch: boolean; normalizedTarget: string; normalizedAttempt: string } {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/^to\s+/i, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const normalizedTarget = normalize(targetWordEN);
  const normalizedAttempt = normalize(userAttempt);

  const isMatch =
    normalizedAttempt.length >= 3 &&
    (normalizedAttempt === normalizedTarget ||
      targetWordEN.toLowerCase().trim() === userAttempt.toLowerCase().trim());

  return {
    isMatch,
    normalizedTarget,
    normalizedAttempt,
  };
}

export function filterLexiconItems(
  items: LexiconItem[],
  category: DomainCategory,
  searchQuery: string,
  onlyMastered: boolean = false,
  masteredIds: string[] = []
): LexiconItem[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return items.filter((item) => {
    if (category !== 'all' && item.category !== category) {
      return false;
    }
    if (onlyMastered && !masteredIds.includes(item.id)) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    const searchable = [
      item.weakEnglish,
      item.preciseEnglish,
      item.frenchC1,
      item.arabicBridge,
      item.contextExampleEN,
      item.contextExampleFR,
      item.contextExampleAR,
      item.categoryLabel,
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });
}

export function assembleTrilingualSentence(
  opening: SentenceBlock,
  core: SentenceBlock,
  closing: SentenceBlock
): AssembledSentence {
  const english = `${opening.english.trim()} ${core.english.trim()} ${closing.english.trim()}`
    .replace(/\s+/g, ' ')
    .trim();

  const french = `${opening.french.trim()} ${core.french.trim()} ${closing.french.trim()}`
    .replace(/\s+/g, ' ')
    .trim();

  const arabic = `${opening.arabic.trim()} ${core.arabic.trim()} ${closing.arabic.trim()}`
    .replace(/\s+/g, ' ')
    .trim();

  const wordCountEN = english.split(/\s+/).filter(Boolean).length;
  const speakingSecondsEstimate = Math.max(5, Math.round(wordCountEN / 2));

  return {
    english,
    french,
    arabic,
    wordCountEN,
    speakingSecondsEstimate,
    structureNotes: [
      opening.structureNote,
      core.structureNote,
      closing.structureNote,
    ],
  };
}

export function generateCustomMeetingSheet(
  template: MeetingTemplate,
  context: CustomMeetingContext,
  timestampIso: string = '2026-10-27T10:00:00Z'
): GeneratedMeetingSheet {
  const carrier = context.carrierOrTeamName.trim() || 'Carrier NOC / Provider';
  const ticket = context.ticketReference.trim() || '#INC-9042';
  const perimeter = context.impactedPerimeter.trim() || 'Primary SIP Trunk & Mobile Fleet';
  const deadline = context.targetDeadline.trim() || '15:00 UTC';

  const openingEN = `[To ${carrier} · Ref ${ticket}] ${template.openingEN} (Scope: ${perimeter}).`;
  const openingFR = `[À ${carrier} · Réf ${ticket}] ${template.openingFR} (Périmètre : ${perimeter}).`;
  const openingAR = `[إلى ${carrier} · مرجع ${ticket}] ${template.openingAR} (النطاق: ${perimeter}).`;

  const closingActionEN = `${template.closingActionEN} Target resolution / checkpoint: ${deadline}.`;
  const closingActionFR = `${template.closingActionFR} Échéance cible / prochain point : ${deadline}.`;
  const closingActionAR = `${template.closingActionAR} الموعد المستهدف للمتابعة: ${deadline}.`;

  return {
    id: `sheet-${template.id}-${timestampIso}`,
    createdAt: timestampIso,
    templateTitle: template.title,
    carrierOrTeamName: carrier,
    ticketReference: ticket,
    impactedPerimeter: perimeter,
    targetDeadline: deadline,
    personalNotesFR: context.personalNotesFR.trim(),
    openingEN,
    openingFR,
    openingAR,
    coreDiagnosticEN: template.coreDiagnosticEN,
    coreDiagnosticFR: template.coreDiagnosticFR,
    coreDiagnosticAR: template.coreDiagnosticAR,
    keyQuestions: template.keyQuestions,
    closingActionEN,
    closingActionFR,
    closingActionAR,
    criticalVocab: template.criticalVocab,
  };
}

export function calculateMasteryStats(
  masteredLexiconIds: string[],
  totalLexicon: number,
  completedExerciseIds: string[],
  totalExercises: number,
  savedPhrasesCount: number,
  savedMeetingSheetsCount: number
): MasteryStats {
  const safeTotalLex = Math.max(1, totalLexicon);
  const safeTotalEx = Math.max(1, totalExercises);

  const masteredLexiconCount = masteredLexiconIds.length;
  const completedExercisesCount = completedExerciseIds.length;

  const lexiconPercent = Math.min(100, Math.round((masteredLexiconCount / safeTotalLex) * 100));
  const exercisesPercent = Math.min(100, Math.round((completedExercisesCount / safeTotalEx) * 100));

  const phraseBonus = Math.min(100, savedPhrasesCount * 25);
  const sheetBonus = Math.min(100, savedMeetingSheetsCount * 35);

  const overallReadinessPercent = Math.min(
    100,
    Math.round(lexiconPercent * 0.4 + exercisesPercent * 0.35 + phraseBonus * 0.15 + sheetBonus * 0.1)
  );

  let readinessLevelLabel = 'B2 Transition · Ancrage en cours';
  if (overallReadinessPercent >= 75) {
    readinessLevelLabel = 'C1 Opérationnel SDM · Prêt pour Escalade & COPIL';
  } else if (overallReadinessPercent >= 40) {
    readinessLevelLabel = 'B2+ Structuré · Lexique & Cadre Solides';
  }

  return {
    masteredLexiconCount,
    totalLexiconCount: totalLexicon,
    lexiconPercent,
    completedExercisesCount,
    totalExercisesCount: totalExercises,
    exercisesPercent,
    savedPhrasesCount,
    savedMeetingSheetsCount,
    overallReadinessPercent,
    readinessLevelLabel,
  };
}

export function evaluateExerciseChoice(
  exercise: WrittenExercise,
  selectedOptionId: string
): {
  isCorrect: boolean;
  explanationFR: string;
  explanationAR: string;
  selectedTextEN: string;
} {
  const option = exercise.options.find((opt) => opt.id === selectedOptionId);
  if (!option) {
    return {
      isCorrect: false,
      explanationFR: 'Veuillez sélectionner une option.',
      explanationAR: 'يرجى اختيار إجابة.',
      selectedTextEN: '',
    };
  }
  return {
    isCorrect: option.isCorrect,
    explanationFR: option.explanationFR,
    explanationAR: option.explanationAR,
    selectedTextEN: option.textEN,
  };
}
