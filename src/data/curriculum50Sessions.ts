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
    subtitleFR: '25 Sessions (Jours 01 à 25) · 750 mots & 750 phrases orales directes pour bâtir une autonomie professionnelle solide.',
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
    subtitleFR: '50 Sessions (Jours 26 à 75) · 1 500 mots & 1 500 phrases orales de réunion pour maîtriser le pilotage projet, la négociation et le Service Delivery.',
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

interface SpokenStarterFrame {
  prefixEN: string;
  suffixEN: string;
  prefixFR: string;
  suffixFR: string;
  reflexiveModeFR: 'nous' | 'je' | 'impersonal';
  prefixAR: string;
  suffixAR: string;
}

// 1. Direct spoken overrides for conversational expressions & discourse markers
// so they are presented as 100% authentic spoken statements rather than "say ..." meta-clauses.
const DIRECT_SPOKEN_OVERRIDES: Record<string, { en: string; fr: string; ar: string }> = {
  'to sum up': {
    en: 'To sum up, here are the three main decisions from today’s call.',
    fr: 'En résumé, voici les trois décisions principales de notre appel d’aujourd’hui.',
    ar: 'باختصار، إليكم القرارات الثلاثة الرئيسية من اتصال اليوم.'
  },
  'i am writing to inform you': {
    en: 'I am writing to inform you that the network upgrade is scheduled for Saturday.',
    fr: 'Je vous écris pour vous informer que la mise à niveau réseau est prévue samedi.',
    ar: 'أكتب إليكم لإبلاغكم بأن ترقية الشبكة مجدولة ليوم السبت.'
  },
  'please let me know': {
    en: 'Please let me know if you need any adjustment to this deployment schedule.',
    fr: 'Merci de m’indiquer si vous avez besoin d’un ajustement sur ce planning.',
    ar: 'يرجى إبلاغي إذا كنتم بحاجة إلى أي تعديل على جدول النشر هذا.'
  },
  'thank you in advance': {
    en: 'Thank you in advance for your quick cooperation on this priority ticket.',
    fr: 'Merci d’avance pour votre coopération rapide sur ce ticket prioritaire.',
    ar: 'شكراً لكم مسبقاً على تعاونكم السريع في هذه التذكرة ذات الأولوية.'
  },
  'to catch (a word)': {
    en: 'Sorry, I didn’t quite catch the name of the local provider—could you repeat it?',
    fr: 'Pardon, je n’ai pas bien saisi le nom de l’opérateur local, pouvez-vous répéter ?',
    ar: 'عذراً، لم ألتقط اسم المزود المحلي جيداً، هل يمكنكم إعادته؟'
  },
  'let me read that back to you': {
    en: 'Let me read that back to you to make sure I wrote down the right IP address.',
    fr: 'Laissez-moi vous relire cela pour vérifier que j’ai bien noté la bonne adresse IP.',
    ar: 'دعوني أعيد قراءة ذلك عليكم للتأكد من أنني دونت عنوان IP الصحيح.'
  },
  'in other words': {
    en: 'In other words, the backup router will take over automatically if the fiber drops.',
    fr: 'Autrement dit, le routeur de secours prendra le relais automatiquement si la fibre coupe.',
    ar: 'بعبارة أخرى، سيتولى موجه الطوارئ المهمة تلقائياً في حال انقطاع الألياف.'
  },
  'to be clear': {
    en: 'To be clear, the legacy lines will remain active until Friday at noon.',
    fr: 'Pour être tout à fait clair, les anciennes lignes resteront actives jusqu’à vendredi midi.',
    ar: 'لكي نكون واضحين تماماً، ستظل الخطوط القديمة نشطة حتى ظهر يوم الجمعة.'
  },
  'to sum it up in one sentence': {
    en: 'To sum it up in one sentence, the voice migration is ready for Monday morning.',
    fr: 'Pour résumer en une phrase, la migration voix est prête pour lundi matin.',
    ar: 'لتلخيص الأمر في جملة واحدة، فإن ترحيل الخدمة الصوتية جاهز لصباح الإثنين.'
  },
  'i completely agree with you': {
    en: 'I completely agree with you on the need for deeper testing before cutover.',
    fr: 'Je suis tout à fait d’accord avec vous sur la nécessité de tests plus poussés.',
    ar: 'أتفق معكم تماماً بشأن الحاجة إلى اختبارات أعمق قبل التحويل.'
  },
  'i agree up to a point, but': {
    en: 'I agree up to a point, but we still need forty-eight hours to test the SIP trunk.',
    fr: 'Je suis d’accord jusqu’à un certain point, mais il nous faut encore 48 heures de test.',
    ar: 'أتفق معكم إلى حد ما، لكننا ما زلنا بحاجة إلى 48 ساعة لاختبار المسار الصوتي.'
  },
  'i see things a bit differently': {
    en: 'I see things a bit differently because the local router still shows packet loss.',
    fr: 'Je vois les choses un peu différemment car le routeur local affiche encore des pertes.',
    ar: 'أرى الأمور بشكل مختلف قليلاً لأن الموجه المحلي لا يزال يظهر فقداناً للبيانات.'
  },
  'we are aligned': {
    en: 'We are fully aligned on the action plan and the target delivery date.',
    fr: 'Nous sommes parfaitement alignés sur le plan d’action et la date cible de livraison.',
    ar: 'نحن متفقون تماماً على خطة العمل وموعد التسليم المستهدف.'
  },
  'well done': {
    en: 'Well done to the whole engineering team after this smooth weekend migration.',
    fr: 'Bravo à toute l’équipe technique après cette migration fluide du week-end.',
    ar: 'أحسنتم جميعاً في الفريق التقني بعد عملية الترحيل السلسة في عطلة نهاية الأسبوع.'
  },
  'please accept our apologies for': {
    en: 'Please accept our apologies for the unexpected delay in delivering the new lines.',
    fr: 'Veuillez accepter nos excuses pour le retard imprévu dans la livraison des nouvelles lignes.',
    ar: 'يرجى قبول اعتذارنا عن التأخير غير المتوقع في تسليم الخطوط الجديدة.'
  },
  'thank you for your patience': {
    en: 'Thank you for your patience and cooperation while our engineers restored the link.',
    fr: 'Merci pour votre patience et votre coopération pendant que nos ingénieurs rétablissaient le lien.',
    ar: 'شكراً لصبركم وتعاونكم بينما كان مهندسونا يعملون على استعادة الخط.'
  },
  'can we agree on this timeline?': {
    en: 'Can we agree on this timeline so the engineering team can lock in the window?',
    fr: 'Pouvons-nous valider ce calendrier pour que l’équipe technique verrouille le créneau ?',
    ar: 'هل يمكننا الاتفاق على هذا الجدول الزمني حتى يثبت الفريق التقني نافذة العمل؟'
  },
  'let’s take this offline': {
    en: 'Let’s take this technical detail offline so we can finish our agenda on time.',
    fr: 'Traitons ce détail technique en aparté pour boucler notre ordre du jour à l’heure.',
    ar: 'دعونا نناقش هذا التفصيل التقني جانبياً حتى ننهي جدول أعمالنا في الوقت المحدد.'
  },
  'in the interest of time': {
    en: 'In the interest of time, let’s move straight to the last item on the agenda.',
    fr: 'Pour gagner du temps, passons directement au dernier point de l’ordre du jour.',
    ar: 'حرصاً على الوقت، دعونا ننتقل مباشرة إلى البند الأخير في جدول الأعمال.'
  },
  'speak to you all next week': {
    en: 'Thank you everyone, and I’ll speak to you all next week for the progress review.',
    fr: 'Merci à tous, et à la semaine prochaine pour notre point d’avancement.',
    ar: 'شكراً لكم جميعاً، ونتحدث الأسبوع القادم في اجتماع متابعة التقدم.'
  },
  'correct me if i am wrong': {
    en: 'Correct me if I’m wrong, but the voice routing test passed yesterday evening.',
    fr: 'Corrigez-moi si je me trompe, mais le test de routage voix a réussi hier soir.',
    ar: 'صححوا لي إن كنت مخطئاً، لكن اختبار توجيه الصوت نجح مساء أمس.'
  },
  'as far as i am concerned': {
    en: 'As far as I’m concerned, we have every green light needed to go live tonight.',
    fr: 'En ce qui me concerne, nous avons tous les feux verts pour lancer ce soir.',
    ar: 'فيما يخصني، لدينا كل الموافقات اللازمة للإطلاق الفعلي الليلة.'
  },
  'bottom line is': {
    en: 'The bottom line is that we need the primary SIP trunk restored before noon.',
    fr: 'L’essentiel, c’est que le trunk SIP principal doit être rétabli avant midi.',
    ar: 'خلاصة القول هي أننا نحتاج إلى استعادة مسار SIP الرئيسي قبل الظهر.'
  },
  'long story short': {
    en: 'Long story short, the automatic failover saved our voice traffic this morning.',
    fr: 'Pour faire court, le basculement automatique a protégé notre trafic voix ce matin.',
    ar: 'باختصار شديد، أنقذ التحويل التلقائي حركة المكالمات الصوتية لدينا هذا الصباح.'
  },
  'mindful of time': {
    en: 'Being mindful of time, let’s move straight to the final go/no-go decision.',
    fr: 'Comme le temps tourne, passons directement à la décision finale de lancement.',
    ar: 'مراعاةً للوقت، دعونا ننتقل مباشرة إلى القرار النهائي بشأن الإطلاق.'
  },
  'with all due respect': {
    en: 'With all due respect, the packet capture clearly shows the drop is on the carrier side.',
    fr: 'Avec tout le respect que je vous dois, la capture prouve que la coupure vient de l’opérateur.',
    ar: 'مع كامل الاحترام، يثبت التقاط الحزم بوضوح أن الانقطاع من جهة المشغل.'
  },
  'let’s focus on what we control': {
    en: 'Let’s focus on what we control right now and switch traffic to the backup link.',
    fr: 'Concentrons-nous sur ce que nous maîtrisons et basculons le trafic sur le lien de secours.',
    ar: 'دعونا نركز على ما نتحكم فيه الآن ونحول الحركة إلى خط الطوارئ.'
  },
  'help me help you': {
    en: 'Help me help you by sending the call traces before noon today.',
    fr: 'Aidez-moi à vous aider en m’envoyant les traces d’appels avant midi.',
    ar: 'ساعدوني لكي أساعدكم من خلال إرسال سجلات المكالمات قبل ظهر اليوم.'
  },
  'would appreciate it if': {
    en: 'We would appreciate it if your Tier-3 engineer could join the bridge at 2 PM.',
    fr: 'Nous vous serions reconnaissants si votre ingénieur Niveau 3 rejoignait le pont à 14h.',
    ar: 'سنكون ممتنين لو تمكن مهندس المستوى الثالث لديكم من الانضمام للاتصال الساعة الثانية.'
  },
  'i was under the impression that': {
    en: 'I was under the impression that the root cause report was due yesterday.',
    fr: 'J’avais cru comprendre que le rapport d’incident devait être livré hier.',
    ar: 'كان لدي انطباع بأن تقرير السبب الجذري كان مستحقاً يوم أمس.'
  },
  'be that as it may': {
    en: 'Be that as it may, our priority is still to restore the voice service before noon.',
    fr: 'Quoi qu’il en soit, notre priorité reste de rétablir le service voix avant midi.',
    ar: 'مهما يكن من أمر، فإن أولويتنا لا تزال استعادة الخدمة الصوتية قبل الظهر.'
  },
  'what we need from your team today is': {
    en: 'What we need from your team today is a clear remediation plan within two hours.',
    fr: 'Ce que nous attendons de votre équipe aujourd’hui, c’est un plan d’action sous deux heures.',
    ar: 'ما نحتاجه من فريقكم اليوم هو خطة معالجة واضحة خلال ساعتين.'
  },
  'let’s lock in the next checkpoint': {
    en: 'Let’s lock in the next checkpoint at 4 PM UTC before we hang up.',
    fr: 'Fixons le prochain point de suivi à 16h UTC avant de raccrocher.',
    ar: 'دعونا نثبت موعد المتابعة القادم عند الساعة الرابعة بالتوقيت العالمي قبل إنهاء المكالمة.'
  }
};

// 2. First-person singular spoken starters (for clauses containing I / my / myself)
const FIRST_PERSON_SPOKEN_STARTERS: SpokenStarterFrame[] = [
  {
    prefixEN: 'Let me ',
    suffixEN: '.',
    prefixFR: 'Permettez-moi de ',
    suffixFR: '.',
    reflexiveModeFR: 'je',
    prefixAR: 'دعوني أعمل على ',
    suffixAR: '.'
  },
  {
    prefixEN: 'I’d like to ',
    suffixEN: '.',
    prefixFR: 'Je tiens à ',
    suffixFR: '.',
    reflexiveModeFR: 'je',
    prefixAR: 'أودّ ',
    suffixAR: '.'
  },
  {
    prefixEN: 'I’ll ',
    suffixEN: '.',
    prefixFR: 'Je vais ',
    suffixFR: '.',
    reflexiveModeFR: 'je',
    prefixAR: 'سأحرص على ',
    suffixAR: '.'
  },
  {
    prefixEN: 'First, I want to ',
    suffixEN: '.',
    prefixFR: 'Tout d’abord, je souhaite ',
    suffixFR: '.',
    reflexiveModeFR: 'je',
    prefixAR: 'أولاً، أرغب في ',
    suffixAR: '.'
  },
  {
    prefixEN: 'On my side, I’ll ',
    suffixEN: '.',
    prefixFR: 'De mon côté, je vais ',
    suffixFR: '.',
    reflexiveModeFR: 'je',
    prefixAR: 'من جانبي، سأعمل على ',
    suffixAR: '.'
  },
  {
    prefixEN: 'Allow me to ',
    suffixEN: '.',
    prefixFR: 'Laissez-moi ',
    suffixFR: '.',
    reflexiveModeFR: 'je',
    prefixAR: 'اسمحوا لي بالعمل على ',
    suffixAR: '.'
  },
  {
    prefixEN: 'My priority is to ',
    suffixEN: '.',
    prefixFR: 'Ma priorité est de ',
    suffixFR: '.',
    reflexiveModeFR: 'je',
    prefixAR: 'أولويتي هي ',
    suffixAR: '.'
  },
  {
    prefixEN: 'I always make sure to ',
    suffixEN: '.',
    prefixFR: 'Je veille toujours à ',
    suffixFR: '.',
    reflexiveModeFR: 'je',
    prefixAR: 'أحرص دائماً على ',
    suffixAR: '.'
  },
  {
    prefixEN: 'I’m happy to ',
    suffixEN: '.',
    prefixFR: 'Je suis à votre disposition pour ',
    suffixFR: '.',
    reflexiveModeFR: 'je',
    prefixAR: 'يسعدني ',
    suffixAR: '.'
  },
  {
    prefixEN: 'For this account, I’ll ',
    suffixEN: '.',
    prefixFR: 'Pour ce client, je vais ',
    suffixFR: '.',
    reflexiveModeFR: 'je',
    prefixAR: 'بالنسبة لهذا العميل، سأعمل على ',
    suffixAR: '.'
  }
];

// 3. Spoken starters for clauses starting with "never ..."
const NEVER_SPOKEN_STARTERS: SpokenStarterFrame[] = [
  {
    prefixEN: 'As a rule, we ',
    suffixEN: '.',
    prefixFR: 'Par principe, nous veillons à ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'كقاعدة أساسية، نحرص على ',
    suffixAR: '.'
  },
  {
    prefixEN: 'In our team, we ',
    suffixEN: '.',
    prefixFR: 'Dans notre équipe, nous choisissons de ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'في فريقنا، نلتزم دائماً بضرورة ',
    suffixAR: '.'
  }
];

// 4. Four semantic pools of short, punchy, 100% spoken starters (2 to 5 words max, no conflicting time adverbs)
// Pool A: Meeting Opening, Sharing, Explaining, Presenting, Clarifying
const SPOKEN_POOL_PRESENTATION: SpokenStarterFrame[] = [
  {
    prefixEN: 'Let’s ',
    suffixEN: '.',
    prefixFR: 'Commençons par ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'دعونا نبدأ في ',
    suffixAR: '.'
  },
  {
    prefixEN: 'First, I’d like to ',
    suffixEN: '.',
    prefixFR: 'Tout d’abord, je tiens à ',
    suffixFR: '.',
    reflexiveModeFR: 'je',
    prefixAR: 'أولاً، أودّ ',
    suffixAR: '.'
  },
  {
    prefixEN: 'Let me quickly ',
    suffixEN: '.',
    prefixFR: 'Permettez-moi de ',
    suffixFR: '.',
    reflexiveModeFR: 'je',
    prefixAR: 'دعوني أبدأ في ',
    suffixAR: '.'
  },
  {
    prefixEN: 'I want to ',
    suffixEN: '.',
    prefixFR: 'Je souhaite ',
    suffixFR: '.',
    reflexiveModeFR: 'je',
    prefixAR: 'أرغب في ',
    suffixAR: '.'
  },
  {
    prefixEN: 'Allow me to ',
    suffixEN: '.',
    prefixFR: 'Laissez-moi ',
    suffixFR: '.',
    reflexiveModeFR: 'je',
    prefixAR: 'اسمحوا لي بالعمل على ',
    suffixAR: '.'
  },
  {
    prefixEN: 'On this call, let’s ',
    suffixEN: '.',
    prefixFR: 'Durant cet appel, veillons à ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'خلال هذا الاتصال، دعونا نعمل على ',
    suffixAR: '.'
  },
  {
    prefixEN: 'Let’s take a minute to ',
    suffixEN: '.',
    prefixFR: 'Prenons une minute pour ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'دعونا نخصص دقيقة من أجل ',
    suffixAR: '.'
  },
  {
    prefixEN: 'Before moving on, let’s ',
    suffixEN: '.',
    prefixFR: 'Avant d’avancer, veillons à ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'قبل الانتقال للنقطة التالية، دعونا نحرص على ',
    suffixAR: '.'
  },
  {
    prefixEN: 'To be clear, let me ',
    suffixEN: '.',
    prefixFR: 'Pour être précis, laissez-moi ',
    suffixFR: '.',
    reflexiveModeFR: 'je',
    prefixAR: 'لتوضيح الصورة، أودّ ',
    suffixAR: '.'
  },
  {
    prefixEN: 'We’re here to ',
    suffixEN: '.',
    prefixFR: 'Nous sommes réunis pour ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'نحن مجتمعون من أجل ',
    suffixAR: '.'
  }
];

// Pool B: Technical Execution, Troubleshooting, Testing, Fixing, Checking, Deploying
const SPOKEN_POOL_TECHNICAL: SpokenStarterFrame[] = [
  {
    prefixEN: 'We need to ',
    suffixEN: '.',
    prefixFR: 'Nous devons ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'نحتاج إلى ',
    suffixAR: '.'
  },
  {
    prefixEN: 'Our team must ',
    suffixEN: '.',
    prefixFR: 'Notre équipe doit ',
    suffixFR: '.',
    reflexiveModeFR: 'impersonal',
    prefixAR: 'يجب على فريقنا ',
    suffixAR: '.'
  },
  {
    prefixEN: 'The next step is to ',
    suffixEN: '.',
    prefixFR: 'La prochaine étape est de ',
    suffixFR: '.',
    reflexiveModeFR: 'impersonal',
    prefixAR: 'الخطوة التالية هي ',
    suffixAR: '.'
  },
  {
    prefixEN: 'Make sure we ',
    suffixEN: '.',
    prefixFR: 'Assurons-nous de ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'تأكدوا من ',
    suffixAR: '.'
  },
  {
    prefixEN: 'We have to ',
    suffixEN: '.',
    prefixFR: 'Il nous faut ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'يتعين علينا ',
    suffixAR: '.'
  },
  {
    prefixEN: 'Our priority is to ',
    suffixEN: '.',
    prefixFR: 'Notre priorité est de ',
    suffixFR: '.',
    reflexiveModeFR: 'impersonal',
    prefixAR: 'أولويتنا هي ',
    suffixAR: '.'
  },
  {
    prefixEN: 'Let’s ask engineering to ',
    suffixEN: '.',
    prefixFR: 'Demandons à l’équipe technique de ',
    suffixFR: '.',
    reflexiveModeFR: 'impersonal',
    prefixAR: 'دعونا نطلب من الفريق التقني ',
    suffixAR: '.'
  },
  {
    prefixEN: 'Our engineers will ',
    suffixEN: '.',
    prefixFR: 'Nos ingénieurs vont ',
    suffixFR: '.',
    reflexiveModeFR: 'impersonal',
    prefixAR: 'سيقوم مهندسونا بـ ',
    suffixAR: '.'
  },
  {
    prefixEN: 'To fix this, we must ',
    suffixEN: '.',
    prefixFR: 'Pour régler cela, nous devons ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'لمعالجة هذا الأمر، يجب علينا ',
    suffixAR: '.'
  },
  {
    prefixEN: 'It’s critical that we ',
    suffixEN: '.',
    prefixFR: 'Il est critique de ',
    suffixFR: '.',
    reflexiveModeFR: 'impersonal',
    prefixAR: 'من الضروري للغاية ',
    suffixAR: '.'
  }
];

// Pool C: Coordination, Scheduling, Follow-up, Stakeholders, Carriers, Escalation
const SPOKEN_POOL_COORDINATION: SpokenStarterFrame[] = [
  {
    prefixEN: 'I suggest we ',
    suffixEN: '.',
    prefixFR: 'Je suggère de ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'أقترح علينا ',
    suffixAR: '.'
  },
  {
    prefixEN: 'We should ',
    suffixEN: '.',
    prefixFR: 'Nous devrions ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'ينبغي علينا ',
    suffixAR: '.'
  },
  {
    prefixEN: 'Don’t forget to ',
    suffixEN: '.',
    prefixFR: 'N’oublions pas de ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'لا تنسوا ',
    suffixAR: '.'
  },
  {
    prefixEN: 'Let’s make sure we ',
    suffixEN: '.',
    prefixFR: 'Veillons bien à ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'دعونا نحرص تماماً على ',
    suffixAR: '.'
  },
  {
    prefixEN: 'I’ll make sure to ',
    suffixEN: '.',
    prefixFR: 'Je veillerai à ',
    suffixFR: '.',
    reflexiveModeFR: 'je',
    prefixAR: 'سأحرص على ',
    suffixAR: '.'
  },
  {
    prefixEN: 'As agreed, we’ll ',
    suffixEN: '.',
    prefixFR: 'Comme convenu, nous allons ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'كما اتفقنا، سنعمل على ',
    suffixAR: '.'
  },
  {
    prefixEN: 'It’s important to ',
    suffixEN: '.',
    prefixFR: 'Il est important de ',
    suffixFR: '.',
    reflexiveModeFR: 'impersonal',
    prefixAR: 'من المهم جداً ',
    suffixAR: '.'
  },
  {
    prefixEN: 'With the client, let’s ',
    suffixEN: '.',
    prefixFR: 'Avec le client, veillons à ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'مع العميل، دعونا نحرص على ',
    suffixAR: '.'
  },
  {
    prefixEN: 'We can directly ',
    suffixEN: '.',
    prefixFR: 'Nous pouvons directement ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'يمكننا مباشرة ',
    suffixAR: '.'
  },
  {
    prefixEN: 'Let’s quickly ',
    suffixEN: '.',
    prefixFR: 'Prenons soin de ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'دعونا نبادر إلى ',
    suffixAR: '.'
  }
];

// Pool D: Strategy, Risk Prevention, Negotiation, Governance & Executive Decisions
const SPOKEN_POOL_STRATEGY: SpokenStarterFrame[] = [
  {
    prefixEN: 'Our goal is to ',
    suffixEN: '.',
    prefixFR: 'Notre objectif est de ',
    suffixFR: '.',
    reflexiveModeFR: 'impersonal',
    prefixAR: 'هدفنا الأساسي هو ',
    suffixAR: '.'
  },
  {
    prefixEN: 'My recommendation is to ',
    suffixEN: '.',
    prefixFR: 'Ma recommandation est de ',
    suffixFR: '.',
    reflexiveModeFR: 'impersonal',
    prefixAR: 'توصيتي هي ',
    suffixAR: '.'
  },
  {
    prefixEN: 'At this stage, we must ',
    suffixEN: '.',
    prefixFR: 'À ce stade, nous devons ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'في هذه المرحلة، يتوجب علينا ',
    suffixAR: '.'
  },
  {
    prefixEN: 'It makes sense to ',
    suffixEN: '.',
    prefixFR: 'Il est judicieux de ',
    suffixFR: '.',
    reflexiveModeFR: 'impersonal',
    prefixAR: 'من المنطقي جداً ',
    suffixAR: '.'
  },
  {
    prefixEN: 'As a team, we should ',
    suffixEN: '.',
    prefixFR: 'En tant qu’équipe, nous devrions ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'كفريق عمل، ينبغي علينا ',
    suffixAR: '.'
  },
  {
    prefixEN: 'Above all, we must ',
    suffixEN: '.',
    prefixFR: 'Avant tout, nous devons ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'قبل كل شيء، يجب علينا ',
    suffixAR: '.'
  },
  {
    prefixEN: 'To stay on track, let’s ',
    suffixEN: '.',
    prefixFR: 'Pour garder le cap, veillons à ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'للحفاظ على المسار، دعونا نعمل على ',
    suffixAR: '.'
  },
  {
    prefixEN: 'Our best option is to ',
    suffixEN: '.',
    prefixFR: 'Notre meilleure option est de ',
    suffixFR: '.',
    reflexiveModeFR: 'impersonal',
    prefixAR: 'خيارنا الأفضل هو ',
    suffixAR: '.'
  },
  {
    prefixEN: 'I strongly advise that we ',
    suffixEN: '.',
    prefixFR: 'Je conseille vivement de ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'أنصح بشدة بـ ',
    suffixAR: '.'
  },
  {
    prefixEN: 'To protect quality, let’s ',
    suffixEN: '.',
    prefixFR: 'Pour protéger la qualité, veillons à ',
    suffixFR: '.',
    reflexiveModeFR: 'nous',
    prefixAR: 'لحماية جودة الخدمة، دعونا نحرص على ',
    suffixAR: '.'
  }
];

const PRESENTATION_VERBS = new Set([
  'share', 'clarify', 'explain', 'present', 'walk', 'give', 'show', 'highlight',
  'summarize', 'recap', 'outline', 'state', 'point', 'demonstrate', 'introduce',
  'describe', 'illustrate', 'frame', 'welcome', 'thank', 'apologize', 'kick',
  'open', 'start', 'chair', 'hand', 'wrap', 'conclude', 'close', 'note',
  'mention', 'tell', 'remind', 'reassure', 'answer', 'acknowledge', 'emphasize',
  'stress', 'underline', 'express', 'congratulate', 'praise', 'invite', 'display'
]);

const TECHNICAL_VERBS = new Set([
  'check', 'verify', 'test', 'run', 'fix', 'resolve', 'identify', 'investigate',
  'spot', 'pinpoint', 'narrow', 'rule', 'monitor', 'deploy', 'configure',
  'install', 'activate', 'migrate', 'switch', 'reroute', 'isolate', 'restore',
  'reboot', 'upgrade', 'patch', 'audit', 'measure', 'track', 'trace', 'diagnose',
  'troubleshoot', 'validate', 'perform', 'complete', 'replace', 'update',
  'analyze', 'inspect', 'collect', 'capture', 'simulate', 'provision', 'port'
]);

const COORDINATION_VERBS = new Set([
  'schedule', 'reschedule', 'postpone', 'bring', 'send', 'ask', 'request',
  'reach', 'contact', 'inform', 'notify', 'keep', 'follow', 'coordinate',
  'align', 'touch', 'confirm', 'circulate', 'assign', 'escalate', 'trigger',
  'involve', 'loop', 'call', 'organize', 'propose', 'set', 'agree', 'book',
  'invite', 'forward', 'attach', 'reply', 'respond', 'check-in', 'sync'
]);

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
  if (/^(IP|SIP|SLA|QoS|UAT|VoLTE|VoWiFi|WAN|LAN|MPLS|SD-WAN|SBC|PBX|KPI|ROI|CAPEX|OPEX|B2B|IT|AI|API|5G|4G|I\b)\b/.test(trimmed)) {
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

function formatFrenchPrefixAndClause(
  frame: SpokenStarterFrame,
  clauseFR: string
): string {
  let cleanClause = normalizeClauseFR(clauseFR);

  // Adapt French reflexive infinitives ("se ...", "s'...") to match the starter subject
  if (/^(se |s['’])/i.test(cleanClause)) {
    if (frame.reflexiveModeFR === 'nous') {
      cleanClause = cleanClause.replace(/^(se |s['’])/i, 'nous ');
    } else if (frame.reflexiveModeFR === 'je') {
      if (/^s['’]/i.test(cleanClause)) {
        cleanClause = cleanClause.replace(/^s['’]/i, 'm’');
      } else {
        cleanClause = cleanClause.replace(/^se /i, 'me ');
      }
    }
  }

  const prefixFR = frame.prefixFR;
  if (prefixFR.endsWith(' de ') && /^[aàâäeéèêëiîïoôöuùûüyh]/i.test(cleanClause)) {
    return prefixFR.slice(0, -4) + ' d’' + cleanClause;
  }
  return prefixFR + cleanClause;
}

function buildSpokenSentencesForItem(
  trackId: TrackId,
  sessionNumber: number,
  idx: number,
  wordEN: string,
  wordFR: string,
  wordAR: string,
  clauseEN: string,
  clauseFR: string,
  clauseAR: string
): { sentenceEN: string; sentenceFR: string; sentenceAR: string } {
  // 1. In C1->C2 Session 20 (the 30 Capstone Executive Expressions), the expressions themselves
  // are complete, eloquent C2 board statements. Let's render them directly as spoken statements!
  if (trackId === 'c1_c2' && sessionNumber === 20) {
    const capEN = wordEN.charAt(0).toUpperCase() + wordEN.slice(1).replace(/\.$/, '') + '.';
    const capFR = wordFR.charAt(0).toUpperCase() + wordFR.slice(1).replace(/\.$/, '') + '.';
    const capAR = wordAR.replace(/\.$/, '') + '.';
    return {
      sentenceEN: capEN,
      sentenceFR: capFR,
      sentenceAR: capAR
    };
  }

  // 2. Check direct spoken overrides for conversational idioms & discourse markers
  const override = DIRECT_SPOKEN_OVERRIDES[wordEN.trim().toLowerCase()];
  if (override) {
    return {
      sentenceEN: override.en,
      sentenceFR: override.fr,
      sentenceAR: override.ar
    };
  }

  const cleanEN = normalizeClauseEN(clauseEN);
  const cleanAR = normalizeClauseAR(clauseAR);

  // 3. Clauses starting with "never ..."
  if (/^never\b/i.test(cleanEN)) {
    const frame = NEVER_SPOKEN_STARTERS[(idx + sessionNumber) % NEVER_SPOKEN_STARTERS.length];
    return {
      sentenceEN: `${frame.prefixEN}${cleanEN}${frame.suffixEN}`,
      sentenceFR: `${formatFrenchPrefixAndClause(frame, clauseFR)}${frame.suffixFR}`,
      sentenceAR: `${frame.prefixAR}${cleanAR}${frame.suffixAR}`
    };
  }

  // 4. Clauses containing 1st-person singular pronouns (I / my / myself)
  if (/\b(I|my|myself)\b/.test(clauseEN)) {
    const frame = FIRST_PERSON_SPOKEN_STARTERS[(idx + sessionNumber * 3) % FIRST_PERSON_SPOKEN_STARTERS.length];
    return {
      sentenceEN: `${frame.prefixEN}${cleanEN}${frame.suffixEN}`,
      sentenceFR: `${formatFrenchPrefixAndClause(frame, clauseFR)}${frame.suffixFR}`,
      sentenceAR: `${frame.prefixAR}${cleanAR}${frame.suffixAR}`
    };
  }

  // 5. Semantic matching based on the leading English verb in the clause
  const firstVerb = cleanEN.split(/\s+/)[0].toLowerCase();
  let pool: SpokenStarterFrame[];

  if (PRESENTATION_VERBS.has(firstVerb)) {
    pool = SPOKEN_POOL_PRESENTATION;
  } else if (TECHNICAL_VERBS.has(firstVerb)) {
    pool = SPOKEN_POOL_TECHNICAL;
  } else if (COORDINATION_VERBS.has(firstVerb)) {
    pool = SPOKEN_POOL_COORDINATION;
  } else {
    pool = SPOKEN_POOL_STRATEGY;
  }

  // If the clause explicitly includes "together", "we", "our", "us", or "ourselves",
  // prefer collective/impersonal starters ("Let's", "We", "Our") over singular "Allow me to"
  if (/\b(together|we|our|us|ourselves)\b/i.test(cleanEN)) {
    const collectivePool = pool.filter((f) => f.reflexiveModeFR !== 'je');
    if (collectivePool.length > 0) {
      pool = collectivePool;
    }
  }

  // Deterministic rotation so adjacent items in a session never repeat the same starter
  const frame = pool[(idx * 3 + sessionNumber * 5) % pool.length];

  return {
    sentenceEN: `${frame.prefixEN}${cleanEN}${frame.suffixEN}`,
    sentenceFR: `${formatFrenchPrefixAndClause(frame, clauseFR)}${frame.suffixFR}`,
    sentenceAR: `${frame.prefixAR}${cleanAR}${frame.suffixAR}`
  };
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

      const { sentenceEN, sentenceFR, sentenceAR } = buildSpokenSentencesForItem(
        trackId,
        rawSession.sessionNumber,
        idx,
        wordEN,
        wordFR,
        wordAR,
        clauseEN,
        clauseFR,
        clauseAR
      );

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
