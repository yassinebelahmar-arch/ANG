import { PALIER_1_SESSIONS, LevelTier, PartOfSpeech, RawSessionDef, RawVocabTuple } from './palier1Data';
import { PALIER_2_SESSIONS } from './palier2Data';
import { PALIER_3_SESSIONS } from './palier3Data';
import { PALIER_4_SESSIONS } from './palier4Data';
import { TRACK_B1_TO_B2_PART1 } from './trackB1ToB2Data';
import { TRACK_B1_TO_B2_PART2 } from './trackB1ToB2Part2Data';
import { TRACK_C1_TO_C2_PART1 } from './trackC1ToC2Part1Data';
import { TRACK_C1_TO_C2_PART2 } from './trackC1ToC2Part2Data';

export type { LevelTier, PartOfSpeech };

export type TrackId = 'b1_b2' | 'b2_c1' | 'c1_c2';

export interface TrackMetadata {
  id: TrackId;
  categoryNumber: 1 | 2 | 3;
  badgeLabel: string;
  shortTitleFR: string;
  titleFR: string;
  subtitleFR: string;
  titleAR: string;
  fromLevel: string;
  targetLevel: string;
  sessionCount: number;
  wordCount: number;
  dayRangeLabel: string;
  startDay: number;
  endDay: number;
  accentColor: 'teal' | 'amber' | 'indigo';
}

export const TRACKS_META: Record<TrackId, TrackMetadata> = {
  b1_b2: {
    id: 'b1_b2',
    categoryNumber: 1,
    badgeLabel: 'Catégorie 1 · 25 Sessions · 750 Mots',
    shortTitleFR: 'B1 / B1+ → Valider B2 / B2+',
    titleFR: 'Catégorie 1 : Passer de B1/B1+ et Valider le Niveau B2 / B2+',
    subtitleFR: '25 Sessions (Jours 01 à 25) · 750 mots & 750 phrases quotidiennes pour bâtir une autonomie professionnelle solide.',
    titleAR: 'الفئة 1: الانتقال من B1/B1+ واعتماد المستوى المهني B2/B2+ (25 حصة · 750 كلمة وجملة)',
    fromLevel: 'B1 / B1+',
    targetLevel: 'B2 / B2+',
    sessionCount: 25,
    wordCount: 750,
    dayRangeLabel: 'Jours 01 à 25 (25 Jours)',
    startDay: 1,
    endDay: 25,
    accentColor: 'teal'
  },
  b2_c1: {
    id: 'b2_c1',
    categoryNumber: 2,
    badgeLabel: 'Catégorie 2 · 50 Sessions · 1 500 Mots',
    shortTitleFR: 'B2 / B2+ → Valider C1 / C1+',
    titleFR: 'Catégorie 2 : Passer de B2 et Valider le Niveau C1 / C1+',
    subtitleFR: '50 Sessions (Jours 26 à 75) · 1 500 mots & 1 500 phrases pour maîtriser le pilotage projet, la négociation et le Service Delivery.',
    titleAR: 'الفئة 2: الانتقال من B2 واعتماد المستوى المتقدم C1/C1+ (50 حصة · 1500 كلمة وجملة)',
    fromLevel: 'B2 / B2+',
    targetLevel: 'C1 / C1+',
    sessionCount: 50,
    wordCount: 1500,
    dayRangeLabel: 'Jours 26 à 75 (50 Jours)',
    startDay: 26,
    endDay: 75,
    accentColor: 'amber'
  },
  c1_c2: {
    id: 'c1_c2',
    categoryNumber: 3,
    badgeLabel: 'Catégorie 3 · 20 Sessions · 600 Mots',
    shortTitleFR: 'C1+ → Valider C2 Exécutif',
    titleFR: 'Catégorie 3 : Passer de C1+ et Valider le Niveau C2 Maîtrise Exécutive',
    subtitleFR: '20 Sessions (Jours 76 à 95) · 600 mots & 600 phrases de direction générale, arbitrage stratégique et rhétorique C-Level.',
    titleAR: 'الفئة 3: الانتقال من C1+ واعتماد القمة التنفيذية C2 (20 حصة · 600 كلمة وجملة)',
    fromLevel: 'C1+',
    targetLevel: 'C2 Exécutif',
    sessionCount: 20,
    wordCount: 600,
    dayRangeLabel: 'Jours 76 à 95 (20 Jours)',
    startDay: 76,
    endDay: 95,
    accentColor: 'indigo'
  }
};

export interface SessionWordEntry {
  id: string;
  trackId: TrackId;
  sessionNumber: number; // 1..25, 1..50, or 1..20 inside its track
  dayNumber: number; // 1..95 across the accelerated program
  indexInSession: number; // 1..30
  globalIndex: number; // 1..750, 1..1500, or 1..600 inside its track
  level: string;
  palier: 1 | 2 | 3 | 4;
  wordEN: string;
  wordFR: string;
  wordAR: string;
  partOfSpeech: PartOfSpeech;
  partOfSpeechLabelFR: string;
  sentenceEN: string;
  sentenceFR: string;
  sentenceAR: string;
}

export interface CurriculumSession {
  id: string; // e.g. 'b1_b2-s01'
  trackId: TrackId;
  sessionNumber: number;
  dayNumber: number; // 1..95
  palier: 1 | 2 | 3 | 4;
  palierLabel: string;
  level: string;
  titleFR: string;
  titleEN: string;
  titleAR: string;
  focusFR: string;
  words: SessionWordEntry[];
}

interface DailySentenceFrame {
  prefixEN: string;
  suffixEN: string;
  prefixFR: string;
  suffixFR: string;
  prefixAR: string;
  suffixAR: string;
}

const DAILY_PRO_FRAMES: DailySentenceFrame[] = [
  {
    prefixEN: "In today's alignment meeting, our priority is to ",
    suffixEN: ".",
    prefixFR: "Lors de la réunion d'alignement d'aujourd'hui, notre priorité est de ",
    suffixFR: ".",
    prefixAR: "في اجتماع التنسيق اليوم، أولويتنا هي ",
    suffixAR: "."
  },
  {
    prefixEN: "Before we speak with the client, we need to ",
    suffixEN: ".",
    prefixFR: "Avant de parler avec le client, nous devons ",
    suffixFR: ".",
    prefixAR: "قبل أن نتحدث مع العميل، نحتاج إلى ",
    suffixAR: "."
  },
  {
    prefixEN: "During our daily stand-up, I asked the team to ",
    suffixEN: ".",
    prefixFR: "Lors de notre point quotidien, j'ai demandé à l'équipe de ",
    suffixFR: ".",
    prefixAR: "خلال اجتماعنا اليومي السريع، طلبت من الفريق ",
    suffixAR: "."
  },
  {
    prefixEN: "To keep the project on track this week, let's make sure we ",
    suffixEN: ".",
    prefixFR: "Pour maintenir le projet sur les rails cette semaine, assurons-nous de ",
    suffixFR: ".",
    prefixAR: "للحفاظ على سير المشروع في مساره الصحيح هذا الأسبوع، دعونا نحرص على ",
    suffixAR: "."
  },
  {
    prefixEN: "From a service delivery standpoint, it is essential to ",
    suffixEN: ".",
    prefixFR: "D'un point de vue gestion de service, il est essentiel de ",
    suffixFR: ".",
    prefixAR: "من منظور تقديم الخدمة، من الضروري جداً ",
    suffixAR: "."
  },
  {
    prefixEN: "When discussing this topic with our partners, I always prefer to ",
    suffixEN: ".",
    prefixFR: "Lorsque nous discutons de ce sujet avec nos partenaires, je préfère toujours ",
    suffixFR: ".",
    prefixAR: "عند مناقشة هذا الموضوع مع شركائنا، أفضل دائماً ",
    suffixAR: "."
  },
  {
    prefixEN: "If we want to avoid any misunderstanding later, we should ",
    suffixEN: ".",
    prefixFR: "Si nous voulons éviter tout malentendu par la suite, nous devrions ",
    suffixFR: ".",
    prefixAR: "إذا أردنا تجنب أي سوء فهم لاحقاً، ينبغي علينا ",
    suffixAR: "."
  },
  {
    prefixEN: "In my follow-up email after the call, I will ",
    suffixEN: ".",
    prefixFR: "Dans mon e-mail de suivi après l'appel, je vais ",
    suffixFR: ".",
    prefixAR: "في رسالة المتابعة الإلكترونية بعد المكالمة، سأقوم بـ",
    suffixAR: "."
  },
  {
    prefixEN: "As agreed with the technical lead this morning, the next step is to ",
    suffixEN: ".",
    prefixFR: "Comme convenu avec le responsable technique ce matin, la prochaine étape consiste à ",
    suffixFR: ".",
    prefixAR: "كما تم الاتفاق عليه مع المسؤول التقني هذا الصباح، الخطوة التالية هي ",
    suffixAR: "."
  },
  {
    prefixEN: "To give management full visibility, it is important to ",
    suffixEN: ".",
    prefixFR: "Pour donner une visibilité totale à la direction, il est important de ",
    suffixFR: ".",
    prefixAR: "لمنح الإدارة رؤية كاملة وواضحة، من المهم ",
    suffixAR: "."
  },
  {
    prefixEN: "Whenever we face this kind of operational challenge, our best option is to ",
    suffixEN: ".",
    prefixFR: "Chaque fois que nous faisons face à ce type de défi opérationnel, notre meilleure option est de ",
    suffixFR: ".",
    prefixAR: "كلما واجهنا هذا النوع من التحديات التشغيلية، فإن خيارنا الأفضل هو ",
    suffixAR: "."
  },
  {
    prefixEN: "Right after the steering committee, I suggest that we ",
    suffixEN: ".",
    prefixFR: "Juste après le comité de pilotage, je suggère de ",
    suffixFR: ".",
    prefixAR: "مباشرة بعد اجتماع لجنة التوجيه، أقترح علينا ",
    suffixAR: "."
  },
  {
    prefixEN: "During the weekly service review, the client asked us to ",
    suffixEN: ".",
    prefixFR: "Lors de la revue de service hebdomadaire, le client nous a demandé de ",
    suffixFR: ".",
    prefixAR: "خلال المراجعة الأسبوعية للخدمة، طلب منا العميل ",
    suffixAR: "."
  },
  {
    prefixEN: "Before validating the final planning, we must take time to ",
    suffixEN: ".",
    prefixFR: "Avant de valider le planning final, nous devons prendre le temps de ",
    suffixFR: ".",
    prefixAR: "قبل اعتماد التخطيط النهائي، يجب أن نأخذ الوقت الكافي لـ",
    suffixAR: "."
  },
  {
    prefixEN: "To make our communication clearer in English, I try to ",
    suffixEN: ".",
    prefixFR: "Pour rendre notre communication plus claire, je veille à ",
    suffixFR: ".",
    prefixAR: "لجعل تواصلنا المهني أكثر وضوحاً، أحرص على ",
    suffixAR: "."
  },
  {
    prefixEN: "In order to meet our contractual commitments this quarter, we have to ",
    suffixEN: ".",
    prefixFR: "Afin de respecter nos engagements contractuels ce trimestre, nous devons ",
    suffixFR: ".",
    prefixAR: "من أجل الوفاء بالتزاماتنا التعاقدية هذا الربع، يتعين علينا ",
    suffixAR: "."
  },
  {
    prefixEN: "When coordinating with the carrier and field engineers, remember to ",
    suffixEN: ".",
    prefixFR: "Lors de la coordination avec l'opérateur et les ingénieurs terrain, pensez à ",
    suffixFR: ".",
    prefixAR: "عند التنسيق مع المشغل ومهندسي الميدان، تذكروا دائماً ",
    suffixAR: "."
  },
  {
    prefixEN: "At the start of tomorrow's workshop, my goal is to ",
    suffixEN: ".",
    prefixFR: "Au début de l'atelier de demain, mon objectif est de ",
    suffixFR: ".",
    prefixAR: "في بداية ورشة عمل الغد، هدفي الأساسي هو ",
    suffixAR: "."
  },
  {
    prefixEN: "If the stakeholder raises a concern during the presentation, be ready to ",
    suffixEN: ".",
    prefixFR: "Si l'interlocuteur soulève une inquiétude pendant la présentation, soyez prêts à ",
    suffixFR: ".",
    prefixAR: "إذا أثار أحد المعنيين مخاوف أثناء العرض، فكونوا مستعدين لـ",
    suffixAR: "."
  },
  {
    prefixEN: "To speed up decision-making across all teams, it helps to ",
    suffixEN: ".",
    prefixFR: "Pour accélérer la prise de décision entre toutes les équipes, il est utile de ",
    suffixFR: ".",
    prefixAR: "لتسريع اتخاذ القرار بين جميع الفرق، من المفيد جداً ",
    suffixAR: "."
  },
  {
    prefixEN: "Based on the feedback from last week's rollout, we decided to ",
    suffixEN: ".",
    prefixFR: "Sur la base des retours du déploiement de la semaine dernière, nous avons décidé de ",
    suffixFR: ".",
    prefixAR: "بناءً على ملاحظات إطلاق الأسبوع الماضي، قررنا ",
    suffixAR: "."
  },
  {
    prefixEN: "While preparing the executive summary for the board, don't forget to ",
    suffixEN: ".",
    prefixFR: "En préparant la synthèse exécutive pour le comité, n'oubliez pas de ",
    suffixFR: ".",
    prefixAR: "أثناء إعداد الملخص التنفيذي للجنة الإدارة، لا تنسوا ",
    suffixAR: "."
  },
  {
    prefixEN: "So that everyone leaves the call with a clear action plan, let's ",
    suffixEN: ".",
    prefixFR: "Pour que chacun quitte l'appel avec un plan d'action clair, veillons à ",
    suffixFR: ".",
    prefixAR: "لكي يغادر الجميع المكالمة بخطة عمل واضحة، دعونا نعمل على ",
    suffixAR: "."
  },
  {
    prefixEN: "When negotiating timelines with an external vendor, it is smart to ",
    suffixEN: ".",
    prefixFR: "Lorsqu'on négocie les délais avec un prestataire externe, il est judicieux de ",
    suffixFR: ".",
    prefixAR: "عند التفاوض على الجداول الزمنية مع مزود خارجي، من الحكمة ",
    suffixAR: "."
  },
  {
    prefixEN: "Before escalating the ticket to senior management, our procedure is to ",
    suffixEN: ".",
    prefixFR: "Avant d'escalader le ticket à la direction, notre procédure consiste à ",
    suffixFR: ".",
    prefixAR: "قبل تصعيد التذكرة إلى الإدارة العليا، يتمثل إجراؤنا في ",
    suffixAR: "."
  },
  {
    prefixEN: "During the handover between project and support teams, we always ",
    suffixEN: ".",
    prefixFR: "Lors du passage de relais entre les équipes projet et support, nous veillons toujours à ",
    suffixFR: ".",
    prefixAR: "أثناء تسليم المهام بين فريقي المشروع والدعم، نحرص دائماً على ",
    suffixAR: "."
  },
  {
    prefixEN: "To build long-term trust with our enterprise accounts, we strive to ",
    suffixEN: ".",
    prefixFR: "Pour bâtir une confiance durable avec nos grands comptes, nous nous efforçons de ",
    suffixFR: ".",
    prefixAR: "لبناء ثقة طويلة الأمد مع عملائنا من الشركات الكبرى، نسعى جاهدين لـ",
    suffixAR: "."
  },
  {
    prefixEN: "As soon as the technical root cause is confirmed, the coordinator will ",
    suffixEN: ".",
    prefixFR: "Dès que la cause racine technique est confirmée, le coordinateur va ",
    suffixFR: ".",
    prefixAR: "بمجرد تأكيد السبب الجذري التقني، سيقوم المنسق بـ",
    suffixAR: "."
  },
  {
    prefixEN: "In our monthly governance call, I systematically take five minutes to ",
    suffixEN: ".",
    prefixFR: "Lors de notre point de gouvernance mensuel, je prends systématiquement cinq minutes pour ",
    suffixFR: ".",
    prefixAR: "في اجتماع الحوكمة الشهري، أخصص دائماً خمس دقائق لـ",
    suffixAR: "."
  },
  {
    prefixEN: "To wrap up our discussion on a constructive note, I would like to ",
    suffixEN: ".",
    prefixFR: "Pour conclure notre discussion sur une note constructive, je souhaiterais ",
    suffixFR: ".",
    prefixAR: "لختام نقاشنا بطريقة بناءة، أود ",
    suffixAR: "."
  }
];

const POS_LABELS_FR: Record<PartOfSpeech, string> = {
  'Verbe': 'Verbe',
  'Nom': 'Nom',
  'Adjectif': 'Adjectif',
  'Expression': 'Expression pro',
  'Connecteur': 'Connecteur logique'
};

function normalizeClauseEN(clause: string): string {
  const trimmed = clause.trim().replace(/\.$/, '');
  if (!trimmed) return trimmed;
  if (/^(IP|SIP|SLA|QoS|UAT|VoLTE|VoWiFi|WAN|LAN|MPLS|SD-WAN|SBC|PBX|KPI|ROI|CAPEX|OPEX|B2B|IT|AI|API|5G|4G)\b/.test(trimmed)) {
    return trimmed;
  }
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
}

function normalizeClauseFR(clause: string): string {
  const trimmed = clause.trim().replace(/\.$/, '');
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
}

function normalizeClauseAR(clause: string): string {
  return clause.trim().replace(/\.$/, '');
}

function formatFrenchPrefixAndClause(prefixFR: string, clauseFR: string): string {
  const cleanClause = normalizeClauseFR(clauseFR);
  if (prefixFR.endsWith(' de ') && /^[aàâäeéèêëiîïoôöuùûüh]/i.test(cleanClause)) {
    return prefixFR.slice(0, -4) + " d'" + cleanClause;
  }
  return prefixFR + cleanClause;
}

function getPalierForTrackSession(trackId: TrackId, sessionNumber: number): { palier: 1 | 2 | 3 | 4; palierLabel: string; levelDisplay: string } {
  if (trackId === 'b1_b2') {
    if (sessionNumber <= 6) {
      return { palier: 1, palierLabel: 'Étape 1 · Bases Pro & Réunions Quotidiennes (B1 → B1+)', levelDisplay: 'B1 → B1+' };
    }
    if (sessionNumber <= 13) {
      return { palier: 2, palierLabel: 'Étape 2 · Coordination, E-mails & Suivi Client (B1+ → B2)', levelDisplay: 'B1+ → B2' };
    }
    if (sessionNumber <= 19) {
      return { palier: 3, palierLabel: 'Étape 3 · Téléphonie IP/Mobile & Gestion d’Incidents (B2)', levelDisplay: 'B2 Validé' };
    }
    return { palier: 4, palierLabel: 'Étape 4 · Autonomie Complète & Validation B2+ (B2 → B2+)', levelDisplay: 'B2+' };
  }

  if (trackId === 'c1_c2') {
    if (sessionNumber <= 5) {
      return { palier: 1, palierLabel: 'Étape 1 · Nuance Diplomatique & Rhétorique COMEX (C1+ → C2)', levelDisplay: 'C1+ → C2' };
    }
    if (sessionNumber <= 10) {
      return { palier: 2, palierLabel: 'Étape 2 · Négociation Stratégique & Gestion de Crise (C2)', levelDisplay: 'C2' };
    }
    if (sessionNumber <= 15) {
      return { palier: 3, palierLabel: 'Étape 3 · Arbitrage Financier, Architecture & Appels d’Offres (C2)', levelDisplay: 'C2' };
    }
    return { palier: 4, palierLabel: 'Étape 4 · Leadership Exécutif & Maîtrise Oratoire Native (C2 Master)', levelDisplay: 'C2 Exécutif' };
  }

  // Default: b2_c1 (50 sessions)
  if (sessionNumber <= 12) {
    return { palier: 1, palierLabel: 'Palier 1 · Fondations Pro & Réunions (B2)', levelDisplay: 'B2' };
  }
  if (sessionNumber <= 25) {
    return { palier: 2, palierLabel: 'Palier 2 · Fluidité Opérationnelle & Projets (B2+)', levelDisplay: 'B2+' };
  }
  if (sessionNumber <= 38) {
    return { palier: 3, palierLabel: 'Palier 3 · Négociation, Crises & Télécom IP/Mobile (C1)', levelDisplay: 'C1' };
  }
  return { palier: 4, palierLabel: 'Palier 4 · Leadership Exécutif & Comités (C1+)', levelDisplay: 'C1+' };
}

function buildTrackSessions(trackId: TrackId, rawSessions: RawSessionDef[], startDayOffset: number): CurriculumSession[] {
  return rawSessions.map((rawSession) => {
    const { palier, palierLabel, levelDisplay } = getPalierForTrackSession(trackId, rawSession.sessionNumber);
    const dayNumber = startDayOffset + rawSession.sessionNumber;

    const words: SessionWordEntry[] = rawSession.items.map((tuple: RawVocabTuple, idx: number) => {
      const [wordEN, wordFR, wordAR, partOfSpeech, clauseEN, clauseFR, clauseAR] = tuple;
      const frameIndex = (idx + (dayNumber - 1) * 7) % DAILY_PRO_FRAMES.length;
      const frame = DAILY_PRO_FRAMES[frameIndex];

      const cleanEN = normalizeClauseEN(clauseEN);
      const cleanAR = normalizeClauseAR(clauseAR);

      const sentenceEN = `${frame.prefixEN}${cleanEN}${frame.suffixEN}`;
      const sentenceFR = `${formatFrenchPrefixAndClause(frame.prefixFR, clauseFR)}${frame.suffixFR}`;
      const sentenceAR = `${frame.prefixAR}${cleanAR}${frame.suffixAR}`;

      const indexInSession = idx + 1;
      const globalIndex = (rawSession.sessionNumber - 1) * 30 + indexInSession;

      return {
        id: `${trackId}-s${String(rawSession.sessionNumber).padStart(2, '0')}-w${String(indexInSession).padStart(2, '0')}`,
        trackId,
        sessionNumber: rawSession.sessionNumber,
        dayNumber,
        indexInSession,
        globalIndex,
        level: levelDisplay,
        palier,
        wordEN,
        wordFR,
        wordAR,
        partOfSpeech,
        partOfSpeechLabelFR: POS_LABELS_FR[partOfSpeech],
        sentenceEN,
        sentenceFR,
        sentenceAR
      };
    });

    return {
      id: `${trackId}-s${String(rawSession.sessionNumber).padStart(2, '0')}`,
      trackId,
      sessionNumber: rawSession.sessionNumber,
      dayNumber,
      palier,
      palierLabel,
      level: levelDisplay,
      titleFR: rawSession.titleFR,
      titleEN: rawSession.titleEN,
      titleAR: rawSession.titleAR,
      focusFR: rawSession.descriptionFR,
      words
    };
  });
}

const RAW_B1_B2_SESSIONS: RawSessionDef[] = [
  ...TRACK_B1_TO_B2_PART1,
  ...TRACK_B1_TO_B2_PART2
];

const RAW_B2_C1_SESSIONS: RawSessionDef[] = [
  ...PALIER_1_SESSIONS,
  ...PALIER_2_SESSIONS,
  ...PALIER_3_SESSIONS,
  ...PALIER_4_SESSIONS
];

const RAW_C1_C2_SESSIONS: RawSessionDef[] = [
  ...TRACK_C1_TO_C2_PART1,
  ...TRACK_C1_TO_C2_PART2
];

export const SESSIONS_B1_TO_B2: CurriculumSession[] = buildTrackSessions('b1_b2', RAW_B1_B2_SESSIONS, 0); // Days 1..25
export const ALL_50_SESSIONS: CurriculumSession[] = buildTrackSessions('b2_c1', RAW_B2_C1_SESSIONS, 25); // Days 26..75
export const SESSIONS_C1_TO_C2: CurriculumSession[] = buildTrackSessions('c1_c2', RAW_C1_C2_SESSIONS, 75); // Days 76..95

export const SESSIONS_BY_TRACK: Record<TrackId, CurriculumSession[]> = {
  b1_b2: SESSIONS_B1_TO_B2,
  b2_c1: ALL_50_SESSIONS,
  c1_c2: SESSIONS_C1_TO_C2
};

export const ALL_95_SESSIONS: CurriculumSession[] = [
  ...SESSIONS_B1_TO_B2,
  ...ALL_50_SESSIONS,
  ...SESSIONS_C1_TO_C2
];

export const ALL_750_WORDS_B1_B2: SessionWordEntry[] = SESSIONS_B1_TO_B2.flatMap((s) => s.words);
export const ALL_1500_WORDS: SessionWordEntry[] = ALL_50_SESSIONS.flatMap((s) => s.words);
export const ALL_600_WORDS_C1_C2: SessionWordEntry[] = SESSIONS_C1_TO_C2.flatMap((s) => s.words);
export const ALL_2850_WORDS: SessionWordEntry[] = ALL_95_SESSIONS.flatMap((s) => s.words);
