export type DomainCategory =
  | 'all'
  | 'sip_voip'
  | 'mobile_fleet'
  | 'sla_escalation'
  | 'porting_provisioning';

export interface LexiconItem {
  id: string;
  category: Exclude<DomainCategory, 'all'>;
  categoryLabel: string;
  weakEnglish: string; // What a "low B2" says by mistake
  preciseEnglish: string; // Exact SDM term/collocation
  pronunciationCue: string; // Written stress/rhythm cue (no audio needed)
  frenchC1: string; // High-precision French C1 equivalent
  arabicBridge: string; // Arabic cognitive anchor
  contextExampleEN: string;
  contextExampleFR: string;
  contextExampleAR: string;
  grammarTip: string;
}

export interface SentenceBlock {
  id: string;
  phase: 'opening' | 'core' | 'closing';
  scenario: 'carrier_escalation' | 'team_sync' | 'steering_committee' | 'porting_mobile';
  scenarioLabel: string;
  intentFR: string;
  english: string;
  french: string;
  arabic: string;
  structureNote: string;
}

export interface MeetingTemplate {
  id: string;
  title: string;
  domain: string;
  audience: string;
  objectiveFR: string;
  objectiveAR: string;
  openingEN: string;
  openingFR: string;
  openingAR: string;
  coreDiagnosticEN: string;
  coreDiagnosticFR: string;
  coreDiagnosticAR: string;
  keyQuestions: Array<{
    en: string;
    fr: string;
    ar: string;
  }>;
  closingActionEN: string;
  closingActionFR: string;
  closingActionAR: string;
  criticalVocab: string[];
}

export interface WrittenExercise {
  id: string;
  category: Exclude<DomainCategory, 'all'>;
  categoryLabel: string;
  situationFR: string;
  situationAR: string;
  weakAttemptEN: string;
  promptQuestion: string;
  options: Array<{
    id: string;
    textEN: string;
    isCorrect: boolean;
    explanationFR: string;
    explanationAR: string;
  }>;
  targetFrenchC1: string;
  targetArabic: string;
}

export interface RoadmapStep {
  stepNumber: string;
  titleFR: string;
  titleEN: string;
  titleAR: string;
  duration: string;
  problemSolved: string;
  concreteMethod: string;
  formulaPattern: string;
  targetTab: 'lexicon' | 'builder' | 'meeting' | 'drills';
  targetTabLabel: string;
}

export const ROADMAP_STEPS: RoadmapStep[] = [
  {
    stepNumber: '01',
    titleFR: 'Remplacement Lexical Chirurgical (Stop aux mots vagues)',
    titleEN: 'Surgical Lexical Replacement',
    titleAR: 'الاستبدال المعجمي الدقيق (وداعاً للكلمات العامة)',
    duration: 'Semaine 1 · 10 min/jour à l’écrit',
    problemSolved:
      'Quand vous manquez du mot exact en réunion ("coupure", "décalage", "blocage portabilité"), vous utilisez des mots génériques ("problem", "cut", "delay") qui vous obligent à faire de longues phrases confuses.',
    concreteMethod:
      'Associez chaque concept télécom simultanément en Arabe (ancrage du sens profond), Français C1 (précision métier) et Anglais SDM (verbe + nom exact). Apprenez des collocations entières ("experience one-way audio", "trigger failover") et non des mots isolés.',
    formulaPattern: '[Verbe d’action précis] + [Terme Télécom Exact] → Zéro hésitation',
    targetTab: 'lexicon',
    targetTabLabel: 'Explorer le Lexique Trilingue',
  },
  {
    stepNumber: '02',
    titleFR: 'La Loi des 3 Blocs : Savoir commencer et finir ses phrases',
    titleEN: 'The 3-Block Sentence Architecture (Frame · Core · Lock)',
    titleAR: 'منهجية المقاطع الثلاثة: كيف تبدأ وتبني وتنهي جملتك بثقة',
    duration: 'Semaine 2 · Pratique par assemblage écrit',
    problemSolved:
      'Le syndrome du "petit B2" à l’oral : commencer une phrase en anglais sans savoir comment la conclure, perdre le fil grammatical au milieu et finir par "...so you see what I mean".',
    concreteMethod:
      'Toute prise de parole SDM suit 3 briques fixes : 1. Amorcer (Cadrer le sujet en 5 mots) → 2. Expliquer (Cause + Impact client en structure Sujet-Verbe-Objet) → 3. Verrouiller (Action attendue + échéance claire).',
    formulaPattern: '1. Amorce (Frame) + 2. Constat/Impact (Core) + 3. Action/Échéance (Close)',
    targetTab: 'builder',
    targetTabLabel: 'Ouvrir le Constructeur de Phrases',
  },
  {
    stepNumber: '03',
    titleFR: 'Préparation Écrite Express en 3 Minutes Avant Réunion',
    titleEN: '3-Minute Pre-Meeting Written Script Canvas',
    titleAR: 'التحضير الكتابي السريع (3 دقائق قبل كل اجتماع)',
    duration: 'Avant chaque appel Opérateur / Équipe / Client',
    problemSolved:
      'L’improvisation orale en anglais sous pression pendant une escalade SIP ou un comité SLA bloque la mémoire de travail.',
    concreteMethod:
      'Ne rentrez jamais en réunion les mains vides. Générez à l’écrit votre fiche de réunion avec : votre phrase d’ouverture exacte, vos 2 constats techniques (Fixe IP ou Mobile), vos 2 questions fermées pour l’opérateur, et votre phrase de clôture.',
    formulaPattern: 'Fiche Écrite sous les yeux = 0% d’improvisation, 100% d’impact',
    targetTab: 'meeting',
    targetTabLabel: 'Préparer une Fiche Réunion',
  },
  {
    stepNumber: '04',
    titleFR: 'Sprints de Reformulation Écrite (Sans Audio)',
    titleEN: 'Written Precision Upgrade Drills',
    titleAR: 'تمارين الصياغة الكتابية المكثفة (بدون استماع صوتي)',
    duration: 'Quotidien · 5 situations réelles SDM',
    problemSolved:
      'Vous retenez par la lecture et la structure visuelle, pas en écoutant des podcasts passifs.',
    concreteMethod:
      'Entraînez votre cerveau à transformer instantanément une phrase approximative ("The calls are cutting on the trunk") en une formulation SDM d’autorité ("We are observing intermittent call drops across the primary SIP trunk") grâce au pont Arabe-Français-Anglais.',
    formulaPattern: 'Situation FR/AR → Diagnostic de l’erreur → Phrase SDM C1 validée',
    targetTab: 'drills',
    targetTabLabel: 'Lancer l’Entraînement Écrit',
  },
];

export const LEXICON_ITEMS: LexiconItem[] = [
  {
    id: 'lex-1',
    category: 'sip_voip',
    categoryLabel: 'Téléphonie IP Fixe · SIP & VoIP',
    weakEnglish: 'We only hear one side / The voice goes only one way',
    preciseEnglish: 'We are experiencing one-way audio (asymmetric RTP flow)',
    pronunciationCue: 'iks-PEER-ee-uhn-sing WAN-way AW-dee-oh',
    frenchC1: 'Nous constatons un flux audio unidirectionnel (routage RTP asymétrique)',
    arabicBridge: 'نواجه مشكلة انقطاع الصوت من طرف واحد (خلل في مسار تدفق الصوت RTP)',
    contextExampleEN:
      'Following the firewall update, we are experiencing one-way audio on outbound calls across the primary SIP trunk.',
    contextExampleFR:
      'Suite à la mise à jour du pare-feu, nous constatons un flux audio unidirectionnel sur les appels sortants du trunk SIP principal.',
    contextExampleAR:
      'بعد تحديث جدار الحماية، نواجه انقطاعاً للصوت من طرف واحد في المكالمات الصادرة عبر مسار SIP الرئيسي.',
    grammarTip:
      'Utilisez toujours "we are experiencing + [nom du symptôme]" plutôt que "we have a problem with...".',
  },
  {
    id: 'lex-2',
    category: 'sip_voip',
    categoryLabel: 'Téléphonie IP Fixe · SIP & VoIP',
    weakEnglish: 'The calls cut / The line breaks sometimes',
    preciseEnglish: 'Intermittent call drops / Premature session termination',
    pronunciationCue: 'in-ter-MIT-uhnt KAWL drops',
    frenchC1: 'Coupures d’appels intermittentes / Rupture prématurée de session',
    arabicBridge: 'انقطاعات متقطعة في المكالمات / انتهاء الجلسة قبل أوانها',
    contextExampleEN:
      'Several branch offices reported intermittent call drops after exactly fifteen minutes due to a SIP session timer mismatch.',
    contextExampleFR:
      'Plusieurs agences ont signalé des coupures d’appels intermittentes après exactement 15 minutes en raison d’une désynchronisation du minuteur de session SIP.',
    contextExampleAR:
      'أبلغت عدة فروع عن انقطاعات متقطعة في المكالمات بعد 15 دقيقة بالضبط بسبب عدم تطابق مؤقت جلسة SIP.',
    grammarTip:
      'Adjectif clé SDM : "intermittent" (aléatoire/périodique) vs "total outage" (panne franche).',
  },
  {
    id: 'lex-3',
    category: 'sip_voip',
    categoryLabel: 'Téléphonie IP Fixe · SIP & VoIP',
    weakEnglish: 'The voice is metallic / robotic and late',
    preciseEnglish: 'Voice quality degradation caused by high jitter and packet loss',
    pronunciationCue: 'voys KWOL-i-tee deg-ruh-DAY-shuhn / JIT-er',
    frenchC1: 'Dégradation de la qualité vocale liée à la gigue (jitter) et à la perte de paquets',
    arabicBridge: 'تدهور جودة الصوت نتيجة التذبذب الزمني (Jitter) وفقدان الحزم',
    contextExampleEN:
      'Our QoS monitoring shows severe voice quality degradation caused by jitter exceeding 45 ms on the WAN link.',
    contextExampleFR:
      'Notre supervision QoS révèle une forte dégradation de la qualité vocale causée par une gigue dépassant 45 ms sur le lien WAN.',
    contextExampleAR:
      'تُظهر مراقبة جودة الخدمة (QoS) تدهوراً حاداً في جودة الصوت بسبب تجاوز التذبذب الزمني 45 ملي ثانية على رابط الشبكة.',
    grammarTip:
      'En français on dit "la gigue", en anglais "jitter" (sans article : "caused by high jitter").',
  },
  {
    id: 'lex-4',
    category: 'sip_voip',
    categoryLabel: 'Téléphonie IP Fixe · SIP & VoIP',
    weakEnglish: 'Pass automatically to the second line / backup server',
    preciseEnglish: 'Trigger automatic failover to the redundant SBC / secondary trunk',
    pronunciationCue: 'TRIG-er aw-tuh-MAT-ik FAYL-oh-ver',
    frenchC1: 'Déclencher le basculement automatique (failover) vers le SBC redondant',
    arabicBridge: 'تفعيل التحويل التلقائي الاحتياطي (Failover) نحو الخادم أو المسار الثانوي',
    contextExampleEN:
      'Did the Session Border Controller trigger automatic failover to the secondary carrier when the primary trunk went down?',
    contextExampleFR:
      'Le SBC a-t-il déclenché le basculement automatique vers l’opérateur secondaire lorsque le trunk principal est tombé ?',
    contextExampleAR:
      'هل قام متحكم حدود الجلسة (SBC) بتفعيل التحويل التلقائي الاحتياطي إلى المزود الثانوي عند توقف المسار الرئيسي؟',
    grammarTip:
      'Collocation essentielle : "trigger a failover" (déclencher une bascule) / "fail back" (revenir sur le nominal).',
  },
  {
    id: 'lex-5',
    category: 'porting_provisioning',
    categoryLabel: 'Portabilité & Déploiement (Fixe & Mobile)',
    weakEnglish: 'Move the phone numbers from the old operator to the new one',
    preciseEnglish: 'Execute number porting (MNP / LNP) from the donor carrier to the recipient carrier',
    pronunciationCue: 'NAM-ber POR-ting / DOH-ner KAIR-ee-er',
    frenchC1: 'Exécuter la portabilité des numéros de l’opérateur donneur vers l’opérateur receveur',
    arabicBridge: 'تنفيذ نقل الأرقام (Portability) من المشغل المانح إلى المشغل المستقبِل',
    contextExampleEN:
      'The donor carrier rejected the porting request for the 200 DID block due to an invalid RIO code.',
    contextExampleFR:
      'L’opérateur donneur a rejeté la demande de portabilité pour la tranche de 200 SDA en raison d’un code RIO invalide.',
    contextExampleAR:
      'رفض المشغل المانح طلب نقل الأرقام لمجموعة الـ 200 رقم مباشر (DID) بسبب عدم صحة رمز التعريف (RIO).',
    grammarTip:
      'Retenez le duo : "Donor carrier" (opérateur que l’on quitte) et "Recipient carrier" (nouvel opérateur). En français "SDA" = en anglais "DID" (Direct Inward Dialing) ou "DDI".',
  },
  {
    id: 'lex-6',
    category: 'porting_provisioning',
    categoryLabel: 'Portabilité & Déploiement (Fixe & Mobile)',
    weakEnglish: 'The time when we change the numbers',
    preciseEnglish: 'The scheduled porting window / maintenance cutover window',
    pronunciationCue: 'SKED-joo-uhld POR-ting WIN-doh / KAT-oh-ver',
    frenchC1: 'La fenêtre de portabilité planifiée / le créneau de bascule (cutover)',
    arabicBridge: 'النافذة الزمنية المجدولة لنقل الأرقام / فترة التحويل الفعلي للخدمة',
    contextExampleEN:
      'We must align our internal routing tables fifteen minutes prior to the scheduled porting window.',
    contextExampleFR:
      'Nous devons aligner nos tables de routage internes quinze minutes avant le créneau de portabilité planifié.',
    contextExampleAR:
      'يجب علينا مواءمة جداول التوجيه الداخلية قبل خمس عشرة دقيقة من النافذة الزمنية المجدولة لنقل الأرقام.',
    grammarTip:
      '"Bascule de mise en production" se traduit toujours par "Cutover" (et non "switch" ou "change").',
  },
  {
    id: 'lex-7',
    category: 'mobile_fleet',
    categoryLabel: 'Téléphonie Mobile · Flotte, eSIM & Roaming',
    weakEnglish: 'Activate the SIM cards for the phones of the company',
    preciseEnglish: 'Provision SIM / eSIM profiles across the corporate mobile fleet',
    pronunciationCue: 'pruh-VIZH-uhn ee-SIM PROH-faylz / MO-buhl fleet',
    frenchC1: 'Provisionner / activer les profils eSIM sur l’ensemble de la flotte mobile entreprise',
    arabicBridge: 'تفعيل وتجهيز شرائح الاتصال (SIM/eSIM) لأسطول الهواتف المهنية للشركة',
    contextExampleEN:
      'How quickly can your provisioning desk push the eSIM profiles to our 150 field technicians?',
    contextExampleFR:
      'Dans quel délai votre cellule d’activation peut-elle déployer les profils eSIM auprès de nos 150 techniciens terrain ?',
    contextExampleAR:
      'ما هي السرعة التي يمكن بها لفريق التفعيل لديكم إرسال ملفات eSIM إلى 150 فنياً ميدانياً لدينا؟',
    grammarTip:
      'En télécom, "activer/configurer un service" se dit "to provision a service / SIM profile".',
  },
  {
    id: 'lex-8',
    category: 'mobile_fleet',
    categoryLabel: 'Téléphonie Mobile · Flotte, eSIM & Roaming',
    weakEnglish: 'There is no network inside the building for mobile phones',
    preciseEnglish: 'Indoor coverage blackspot / signal attenuation requiring VoWiFi or indoor repeater',
    pronunciationCue: 'KAV-er-ij BLAK-spot / SIG-nuhl uh-ten-yoo-AY-shuhn',
    frenchC1: 'Zone blanche indoor / atténuation du signal nécessitant les appels Wi-Fi (VoWiFi)',
    arabicBridge: 'نقطة انعدام التغطية الداخلية / ضعف الإشارة الذي يتطلب تفعيل المكالمات عبر الواي فاي (VoWiFi)',
    contextExampleEN:
      'To mitigate the indoor coverage blackspot at the logistics warehouse, we enabled VoWiFi across all corporate handsets.',
    contextExampleFR:
      'Pour pallier la zone blanche à l’intérieur de l’entrepôt logistique, nous avons activé le VoWiFi sur tous les terminaux de l’entreprise.',
    contextExampleAR:
      'لمعالجة نقطة انعدام التغطية الداخلية في المستودع اللوجستي، قمنا بتفعيل ميزة المكالمات عبر الواي فاي (VoWiFi) على جميع هواتف الشركة.',
    grammarTip:
      '"Zone blanche" en français = "Coverage blackspot" ou "Dead zone" en anglais (attention au faux-ami : jamais "white zone" !).',
  },
  {
    id: 'lex-9',
    category: 'mobile_fleet',
    categoryLabel: 'Téléphonie Mobile · Flotte, eSIM & Roaming',
    weakEnglish: 'Mobile internet does not work when traveling abroad',
    preciseEnglish: 'Data roaming attachment failure / custom APN misconfiguration',
    pronunciationCue: 'DAY-tuh ROH-ming uh-TACH-muhnt FAYL-yer',
    frenchC1: 'Échec d’attachement data en itinérance (roaming) / erreur de paramétrage APN privé',
    arabicBridge: 'فشل الاتصال ببيانات التجوال الدولي (Roaming) / خطأ في إعدادات نقطة الوصول (APN)',
    contextExampleEN:
      'Executives traveling in the UK are facing a data roaming attachment failure on the local partner network.',
    contextExampleFR:
      'Les dirigeants en déplacement au Royaume-Uni rencontrent un échec d’attachement data en itinérance sur le réseau partenaire local.',
    contextExampleAR:
      'يواجه المديرون المسافرون إلى المملكة المتحدة فشلاً في الاتصال ببيانات التجوال على شبكة الشريك المحلي.',
    grammarTip:
      'En mobile, un téléphone ne "se connecte" pas seulement au réseau cellulaire : il "attaches to the network" ("network attachment").',
  },
  {
    id: 'lex-10',
    category: 'sla_escalation',
    categoryLabel: 'SLA, Escalade Opérateur & Gouvernance SDM',
    weakEnglish: 'We want a document that explains why it broke',
    preciseEnglish: 'We require a formal RFO (Reason for Outage) and RCA (Root Cause Analysis)',
    pronunciationCue: 'REE-zuhn for AW-tij / ROOT kawz uh-NAL-uh-sis',
    frenchC1: 'Nous exigeons un rapport d’incident officiel (RFO) ainsi qu’une analyse de cause racine (RCA)',
    arabicBridge: 'نطالب بتقرير رسمي عن سبب الانقطاع (RFO) وتحليل السبب الجذري للمشكلة (RCA)',
    contextExampleEN:
      'Given that this P1 outage lasted over four hours, we require a formal RFO and preventive action plan within 48 hours.',
    contextExampleFR:
      'Cet incident P1 ayant duré plus de quatre heures, nous exigeons un rapport RFO formel et un plan d’actions préventives sous 48 heures.',
    contextExampleAR:
      'نظراً لأن هذا الانقطاع الحرج (P1) استمر لأكثر من أربع ساعات، فإننا نطالب بتقرير رسمي عن سبب الانقطاع وخطة إجراءات وقائية خلال 48 ساعة.',
    grammarTip:
      'Utilisez "Given that..." (Étant donné que...) pour introduire une exigence contractuelle avec autorité.',
  },
  {
    id: 'lex-11',
    category: 'sla_escalation',
    categoryLabel: 'SLA, Escalade Opérateur & Gouvernance SDM',
    weakEnglish: 'Give the ticket to a higher engineer because it takes too long',
    preciseEnglish: 'Escalate the incident to Tier-3 engineering as we are approaching an SLA breach',
    pronunciationCue: 'ES-kuh-layt to TEER-three / S-L-A breech',
    frenchC1: 'Escalader le ticket vers l’ingénierie Niveau 3 car nous approchons d’un dépassement de SLA (GTR)',
    arabicBridge: 'تصعيد البلاغ إلى مهندسي المستوى الثالث (Tier-3) لأننا نقترب من خرق اتفاقية مستوى الخدمة (SLA)',
    contextExampleEN:
      'The MTTR target is four hours; please escalate this ticket to Tier-3 immediately to prevent an SLA breach.',
    contextExampleFR:
      'L’objectif de GTR (MTTR) est de quatre heures ; merci d’escalader ce ticket au Niveau 3 immédiatement pour éviter une pénalité SLA.',
    contextExampleAR:
      'الوقت المستهدف لإصلاح العطل (MTTR) هو أربع ساعات؛ يرجى تصعيد هذا البلاغ فوراً إلى المستوى الثالث لتجنب خرق اتفاقية مستوى الخدمة.',
    grammarTip:
      'En français "GTR" (Garantie de Temps de Rétablissement) = en anglais "MTTR" (Mean Time To Repair / Restore).',
  },
  {
    id: 'lex-12',
    category: 'sla_escalation',
    categoryLabel: 'SLA, Escalade Opérateur & Gouvernance SDM',
    weakEnglish: 'A temporary solution while waiting for the real fix',
    preciseEnglish: 'Implement a temporary workaround while engineering works on a permanent fix',
    pronunciationCue: 'TEM-puh-rair-ee WERK-uh-rawnd / PER-muh-nuhnt fiks',
    frenchC1: 'Mettre en place une solution de contournement (workaround) en attendant le correctif définitif',
    arabicBridge: 'تطبيق حل بديل مؤقت (Workaround) ريثما يعمل الفريق الهندسي على الحل الجذري النهائي',
    contextExampleEN:
      'As an immediate workaround, we forwarded all main reception DIDs to mobile backup numbers.',
    contextExampleFR:
      'Comme solution de contournement immédiate, nous avons renvoyé tous les numéros SDA de l’accueil vers des mobiles de secours.',
    contextExampleAR:
      'كحل بديل فوري، قمنا بتحويل جميع أرقام الاستقبال المباشرة إلى أرقام هواتف محمولة احتياطية.',
    grammarTip:
      '"Solution de contournement" = "Workaround". "Renvoi d’appel" = "Call forwarding".',
  },
];

export const SENTENCE_BLOCKS: SentenceBlock[] = [
  // OPENINGS (Comment commencer ses phrases)
  {
    id: 'open-1',
    phase: 'opening',
    scenario: 'carrier_escalation',
    scenarioLabel: 'Escalade Opérateur (Provider Call)',
    intentFR: 'Ouvrir un appel d’urgence opérateur avec calme et autorité',
    english: 'Thank you for joining on short notice; I am calling to escalate a critical P1 incident affecting',
    french: 'Merci de nous rejoindre rapidement ; je vous appelle pour escalader un incident critique P1 affectant',
    arabic: 'شكراً لانضمامكم في وقت قصير؛ أتصل بكم لتصعيد حادث حرج من الدرجة الأولى (P1) يؤثر على',
    structureNote: 'Commencez par "I am calling to escalate..." + participe présent "affecting..." (zéro hésitation sur la conjugaison).',
  },
  {
    id: 'open-2',
    phase: 'opening',
    scenario: 'carrier_escalation',
    scenarioLabel: 'Escalade Opérateur (Provider Call)',
    intentFR: 'Cadrer d’emblée un constat technique issu des traces (PCAP / Logs)',
    english: 'Based on our SBC packet captures and signaling traces, we have identified that',
    french: 'D’après nos captures de paquets SBC et nos traces de signalisation, nous avons identifié que',
    arabic: 'بناءً على تحليل حزم البيانات (PCAP) وسجلات الإشارة لدينا، فقد حددنا أن',
    structureNote: '"Based on [preuve], we have identified that..." pose immédiatement votre crédibilité technique.',
  },
  {
    id: 'open-3',
    phase: 'opening',
    scenario: 'team_sync',
    scenarioLabel: 'Point Équipe Technique / NOC Interne',
    intentFR: 'Faire un point d’avancement clair avec l’équipe interne',
    english: 'To give everyone a quick operational update on the voice and mobile perimeter,',
    french: 'Pour donner à chacun un point d’avancement opérationnel rapide sur le périmètre voix fixe et mobile,',
    arabic: 'لإعطاء الجميع تحديثاً تشغيلياً سريعاً حول نطاق الهاتف الثابت والمحمول،',
    structureNote: '"To give everyone a quick update on..." est la formule idéale pour lancer un tour de table.',
  },
  {
    id: 'open-4',
    phase: 'opening',
    scenario: 'steering_committee',
    scenarioLabel: 'Comité de Pilotage / Revue SLA (COPIL)',
    intentFR: 'Introduire le bilan de performance mensuel ou SLA',
    english: 'From a Service Delivery standpoint, our main focus this week is stabilizing',
    french: 'Du point de vue Service Delivery, notre priorité cette semaine est de stabiliser',
    arabic: 'من منظور إدارة تقديم الخدمة (SDM)، ينصب تركيزنا الرئيسي هذا الأسبوع على تحقيق استقرار',
    structureNote: '"From a Service Delivery standpoint..." vous donne immédiatement une posture managériale C1.',
  },
  {
    id: 'open-5',
    phase: 'opening',
    scenario: 'porting_mobile',
    scenarioLabel: 'Portabilité & Déploiement Flotte Mobile',
    intentFR: 'Sécuriser une opération de portabilité ou déploiement eSIM',
    english: 'Ahead of tomorrow’s scheduled porting window and mobile fleet rollout,',
    french: 'En amont du créneau de portabilité planifié demain et du déploiement de la flotte mobile,',
    arabic: 'استباقاً للنافذة الزمنية المجدولة غداً لنقل الأرقام ونشر أسطول الهواتف المحمولة،',
    structureNote: '"Ahead of [événement]..." (En amont de...) remplace avantageusement les tournures lourdes avec "Before we do...".',
  },

  // CORES (Expliquer le problème / le cœur technique)
  {
    id: 'core-1',
    phase: 'core',
    scenario: 'carrier_escalation',
    scenarioLabel: 'Escalade Opérateur (Provider Call)',
    intentFR: 'Expliquer une coupure Trunk SIP ou un rejet d’appels (SIP 503)',
    english: 'our primary SIP trunk is returning SIP 503 Service Unavailable errors on 40% of outbound calls,',
    french: 'notre trunk SIP principal renvoie des erreurs SIP 503 Service Unavailable sur 40 % des appels sortants,',
    arabic: 'مسار SIP الرئيسي لدينا يُرجع أخطاء (SIP 503 الخدمة غير متاحة) في 40% من المكالمات الصادرة،',
    structureNote: 'Structure directe : [Équipement] + is returning / experiencing + [Symptôme chiffré].',
  },
  {
    id: 'core-2',
    phase: 'core',
    scenario: 'carrier_escalation',
    scenarioLabel: 'Escalade Opérateur (Provider Call)',
    intentFR: 'Expliquer un problème d’audio unidirectionnel ou de qualité VoIP',
    english: 'multiple production sites are experiencing one-way audio and severe jitter on external calls,',
    french: 'plusieurs sites de production subissent un audio unidirectionnel et une forte gigue sur les appels externes,',
    arabic: 'تعاني عدة مواقع إنتاجية من انقطاع الصوت من طرف واحد وتذبذب حاد في جودة المكالمات الخارجية،',
    structureNote: 'Utilisez "experiencing one-way audio and severe jitter" au lieu de "the sound is bad".',
  },
  {
    id: 'core-3',
    phase: 'core',
    scenario: 'porting_mobile',
    scenarioLabel: 'Portabilité & Déploiement Flotte Mobile',
    intentFR: 'Expliquer un blocage de portabilité ou d’activation eSIM / Roaming',
    english: '35 corporate mobile lines are still pending eSIM provisioning and data roaming activation,',
    french: '35 lignes mobiles entreprise sont toujours en attente d’activation eSIM et d’itinérance data,',
    arabic: 'لا تزال 35 خطاً من خطوط الهواتف المهنية بانتظار تفعيل شرائح eSIM وخدمة تجوال البيانات،',
    structureNote: '"are still pending + [nom]" = "sont toujours en attente de...". Très court et ultra-pro.',
  },
  {
    id: 'core-4',
    phase: 'core',
    scenario: 'team_sync',
    scenarioLabel: 'Point Équipe Technique / NOC Interne',
    intentFR: 'Expliquer qu’une bascule de secours (workaround) a été activée',
    english: 'we have routed all inbound DID traffic to the backup trunk as a temporary workaround,',
    french: 'nous avons basculé tout le trafic SDA entrant vers le trunk de secours à titre de contournement temporaire,',
    arabic: 'قمنا بتوجيه جميع المكالمات الواردة (DID) إلى المسار الاحتياطي كحل بديل مؤقت،',
    structureNote: '"we have routed [trafic] to [cible] as a temporary workaround" montre que vous maîtrisez la situation.',
  },
  {
    id: 'core-5',
    phase: 'core',
    scenario: 'steering_committee',
    scenarioLabel: 'Comité de Pilotage / Revue SLA (COPIL)',
    intentFR: 'Présenter un écart de SLA avec l’opérateur',
    english: 'the carrier missed the four-hour MTTR target on two major incidents this month,',
    french: 'l’opérateur a dépassé la GTR de quatre heures sur deux incidents majeurs ce mois-ci,',
    arabic: 'تجاوز المشغل الوقت المستهدف للإصلاح (MTTR البالغ 4 ساعات) في حادثين رئيسيين هذا الشهر،',
    structureNote: '"missed the four-hour MTTR target" = "n’a pas respecté la GTR de 4 heures".',
  },

  // CLOSINGS (Comment finir ses phrases avec impact)
  {
    id: 'close-1',
    phase: 'closing',
    scenario: 'carrier_escalation',
    scenarioLabel: 'Escalade Opérateur (Provider Call)',
    intentFR: 'Exiger une action immédiate du Niveau 3 et un ETA (délai)',
    english: 'so we need your Tier-3 team to reroute the traffic immediately and confirm an ETA within 30 minutes.',
    french: 'nous avons donc besoin que votre équipe Niveau 3 reroute le trafic immédiatement et confirme un délai (ETA) sous 30 minutes.',
    arabic: 'لذا نحتاج من فريق المستوى الثالث لديكم إعادة توجيه الحركة فوراً وتأكيد الوقت المتوقع للإصلاح (ETA) خلال 30 دقيقة.',
    structureNote: 'Terminez toujours une escalade par : "so we need [qui] to [verbe] and confirm [échéance]".',
  },
  {
    id: 'close-2',
    phase: 'closing',
    scenario: 'carrier_escalation',
    scenarioLabel: 'Escalade Opérateur (Provider Call)',
    intentFR: 'Demander un rapport RFO écrit avant la fin de journée',
    english: 'and we expect a full RFO report with preventive actions by end of business today.',
    french: 'et nous attendons un rapport RFO complet avec plan d’actions préventives d’ici la fin de journée.',
    arabic: 'ونتوقع استلام تقرير رسمي كامل عن سبب الانقطاع (RFO) مع الإجراءات الوقائية قبل نهاية عمل اليوم.',
    structureNote: '"by end of business today (EOB)" = "d’ici la fin de journée". Formule de clôture nette.',
  },
  {
    id: 'close-3',
    phase: 'closing',
    scenario: 'porting_mobile',
    scenarioLabel: 'Portabilité & Déploiement Flotte Mobile',
    intentFR: 'Valider le Go/No-Go avant une fenêtre de portabilité',
    english: 'could you please confirm that the porting order is locked and ready for cutover at 12:00 UTC?',
    french: 'pouvez-vous confirmer que l’ordre de portabilité est verrouillé et prêt pour la bascule à 12h00 UTC ?',
    arabic: 'هل يمكنكم تأكيد أن طلب نقل الأرقام مثبت وجاهز للتنفيذ الفعلي (Cutover) عند الساعة 12:00 بالتوقيت العالمي؟',
    structureNote: '"could you please confirm that..." permet de passer la parole à l’interlocuteur sans blanc gênant.',
  },
  {
    id: 'close-4',
    phase: 'closing',
    scenario: 'team_sync',
    scenarioLabel: 'Point Équipe Technique / NOC Interne',
    intentFR: 'Fixer le prochain point de synchronisation (Next Checkpoint)',
    english: 'let’s keep the workaround active and reconvene at 15:00 to validate the permanent fix.',
    french: 'maintenons la solution de contournement active et refaisons un point à 15h00 pour valider le correctif définitif.',
    arabic: 'دعونا نبقي الحل المؤقت مفعّلاً ونجتمع مجدداً عند الساعة 15:00 للتحقق من الحل النهائي.',
    structureNote: '"let’s reconvene at [heure]" = "refaisons un point / réunissons-nous à nouveau à [heure]".',
  },
  {
    id: 'close-5',
    phase: 'closing',
    scenario: 'steering_committee',
    scenarioLabel: 'Comité de Pilotage / Revue SLA (COPIL)',
    intentFR: 'Clôturer avec plan d’amélioration et pénalités SLA',
    english: 'therefore we have initiated a formal service improvement plan and requested SLA service credits.',
    french: 'par conséquent, nous avons déclenché un plan d’amélioration de service (SIP) et demandé l’application des avoirs SLA.',
    arabic: 'وبناءً عليه، بدأنا خطة رسمية لتحسين الخدمة وطالبنا بتعويضات اتفاقية مستوى الخدمة (SLA Credits).',
    structureNote: '"service credits" = les pénalités/avoirs financiers liés au non-respect du SLA.',
  },
];

export const MEETING_TEMPLATES: MeetingTemplate[] = [
  {
    id: 'tpl-sip-outage',
    title: 'Escalade Opérateur : Coupure Trunk SIP & Audio Unidirectionnel',
    domain: 'Téléphonie IP Fixe (SIP / SBC / RTP)',
    audience: 'Opérateur Télécom (Carrier NOC / Escalation Manager)',
    objectiveFR: 'Obtenir le reroutage immédiat du trafic voix et un ETA de résolution sur un incident P1.',
    objectiveAR: 'الحصول على إعادة توجيه فورية لحركة الصوت وتحديد وقت الإصلاح المتوقع (ETA) لحادث حرج P1.',
    openingEN:
      'Hi everyone, thank you for joining this bridge. I am calling to escalate a P1 incident impacting our primary SIP trunk since 09:15 UTC.',
    openingFR:
      'Bonjour à tous, merci d’avoir rejoint ce pont d’appel. Je vous appelle pour escalader un incident P1 impactant notre trunk SIP principal depuis 09h15 UTC.',
    openingAR:
      'مرحباً بالجميع، شكراً لانضمامكم إلى هذا الاتصال. أتصل لتصعيد حادث حرج (P1) يؤثر على مسار SIP الرئيسي لدينا منذ الساعة 09:15.',
    coreDiagnosticEN:
      'Based on our SBC signaling traces, outbound calls are failing with SIP 503 errors, and answered calls experience one-way audio due to asymmetric RTP routing on your media gateway.',
    coreDiagnosticFR:
      'D’après les traces de signalisation de notre SBC, les appels sortants échouent en erreur SIP 503, et les appels décrochés subissent un audio unidirectionnel lié à un routage RTP asymétrique sur votre passerelle média.',
    coreDiagnosticAR:
      'بناءً على سجلات الإشارة في SBC لدينا، تفشل المكالمات الصادرة بخطأ SIP 503، وتعاني المكالمات المجابة من انقطاع الصوت من طرف واحد بسبب عدم تماثل مسار RTP في بوابة الوسائط لديكم.',
    keyQuestions: [
      {
        en: 'Can your Tier-3 engineer bypass the faulty media gateway and reroute our traffic immediately?',
        fr: 'Votre ingénieur Niveau 3 peut-il contourner la passerelle média défaillante et rerouter notre trafic immédiatement ?',
        ar: 'هل يمكن لمهندس المستوى الثالث لديكم تجاوز بوابة الوسائط المتعطلة وإعادة توجيه الحركة لدينا فوراً؟',
      },
      {
        en: 'What is your confirmed ETA for full service restoration, and when will we receive the preliminary RFO?',
        fr: 'Quel est votre délai confirmé (ETA) pour un rétablissement complet, et quand recevrons-nous le RFO préliminaire ?',
        ar: 'ما هو الوقت المؤكد (ETA) لاستعادة الخدمة بالكامل، ومتى سنستلم التقرير الأولي لسبب الانقطاع (RFO)؟',
      },
    ],
    closingActionEN:
      'To summarize: please apply the routing workaround now, send a written update on Ticket #INC-8492 within 30 minutes, and let’s reconvene at the top of the hour.',
    closingActionFR:
      'Pour résumer : merci d’appliquer le contournement de routage maintenant, d’envoyer une mise à jour écrite sur le ticket #INC-8492 sous 30 minutes, et refaisons un point à l’heure pile.',
    closingActionAR:
      'لتلخيص ما اتفقنا عليه: يرجى تطبيق الحل البديل للتوجيه الآن، وإرسال تحديث كتابي على التذكرة خلال 30 دقيقة، ولنجتمع مجدداً على رأس الساعة.',
    criticalVocab: ['Primary SIP trunk', 'One-way audio', 'Asymmetric RTP', 'Media gateway', 'Reroute traffic', 'Preliminary RFO'],
  },
  {
    id: 'tpl-porting-mnp',
    title: 'Synchronisation Portabilité Numéros (SDA Fixe & MNP Mobile)',
    domain: 'Portabilité & Provisioning Opérateur',
    audience: 'Cellule Portabilité Opérateur (Porting Desk) & Équipe Projet',
    objectiveFR: 'Verrouiller un créneau de portabilité (Cutover) et lever un rejet RIO / tranche SDA.',
    objectiveAR: 'تثبيت موعد نقل الأرقام (Cutover) ومعالجة سبب رفض طلب النقل (RIO / DID).',
    openingEN:
      'Hello team, the purpose of this call is to secure Friday’s porting window for our 300 fixed DIDs and 80 mobile lines.',
    openingFR:
      'Bonjour à tous, l’objectif de cet appel est de sécuriser le créneau de portabilité de vendredi pour nos 300 SDA fixes et 80 lignes mobiles.',
    openingAR:
      'مرحباً بالفريق، الهدف من هذا الاتصال هو تأمين نافذة نقل الأرقام ليوم الجمعة الخاصة بـ 300 رقم مباشر ثابت و80 خط هاتف محمول.',
    coreDiagnosticEN:
      'We noticed that the donor carrier rejected 15 mobile numbers due to a RIO mismatch, while the fixed DID range is approved and ready for cutover.',
    coreDiagnosticFR:
      'Nous avons constaté que l’opérateur donneur a rejeté 15 numéros mobiles pour incohérence de code RIO, tandis que la tranche SDA fixe est validée et prête pour la bascule.',
    coreDiagnosticAR:
      'لاحظنا أن المشغل المانح رفض 15 رقماً محمولاً بسبب عدم تطابق رمز RIO، بينما تمت الموافقة على نطاق الأرقام الثابتة وهو جاهز للتحويل.',
    keyQuestions: [
      {
        en: 'If we resubmit the corrected RIO codes by 14:00 today, can we keep those 15 mobile lines in Friday’s porting window?',
        fr: 'Si nous resoumettons les codes RIO corrigés avant 14h00 aujourd’hui, pouvons-nous maintenir ces 15 lignes dans le créneau de vendredi ?',
        ar: 'إذا أعدنا إرسال رموز RIO المصححة قبل الساعة 14:00 اليوم، فهل يمكننا إبقاء هذه الخطوط الـ 15 ضمن نافذة النقل ليوم الجمعة؟',
      },
      {
        en: 'Can an engineer stay on standby on the bridge during the cutover window to test inbound and outbound routing?',
        fr: 'Un ingénieur peut-il rester en astreinte sur le pont pendant la fenêtre de bascule pour tester les appels entrants et sortants ?',
        ar: 'هل يمكن لمهندس البقاء على الخط خلال فترة التحويل لاختبار مسارات المكالمات الواردة والصادرة؟',
      },
    ],
    closingActionEN:
      'Perfect. We will send the updated RIO file right after this call. Please confirm final Go/No-Go validation in writing before 17:00.',
    closingActionFR:
      'Parfait. Nous envoyons le fichier RIO mis à jour juste après cet appel. Merci de confirmer le Go/No-Go final par écrit avant 17h00.',
    closingActionAR:
      'ممتاز. سنرسل ملف RIO المحدث مباشرة بعد هذا الاتصال. يرجى تأكيد الموافقة النهائية (Go/No-Go) كتابياً قبل الساعة 17:00.',
    criticalVocab: ['Porting window', 'Donor carrier', 'Recipient carrier', 'DID range (Tranche SDA)', 'Cutover', 'Go/No-Go validation'],
  },
  {
    id: 'tpl-mobile-fleet',
    title: 'Déploiement Flotte Mobile, eSIM, APN Privé & Roaming',
    domain: 'Téléphonie Mobile Entreprise',
    audience: 'Opérateur Mobile & Équipe Support Interne (MDM / Réseau)',
    objectiveFR: 'Résoudre les échecs d’activation eSIM, de couverture indoor (VoWiFi) et de roaming data.',
    objectiveAR: 'معالجة مشاكل تفعيل شرائح eSIM، والتغطية الداخلية (VoWiFi)، وتجوال البيانات الدولي.',
    openingEN:
      'Good morning everyone, I wanted to review the open action items following our corporate mobile fleet rollout.',
    openingFR:
      'Bonjour à tous, je souhaitais passer en revue les points d’action ouverts suite au déploiement de notre flotte mobile entreprise.',
    openingAR:
      'صباح الخير جميعاً، أردت مراجعة نقاط العمل المفتوحة عقب نشر أسطول الهواتف المحمولة للشركة.',
    coreDiagnosticEN:
      'Overall, 90% of the fleet is active, but 25 VIP users are experiencing data roaming attachment failures abroad, and our main logistics site suffers from an indoor coverage blackspot.',
    coreDiagnosticFR:
      'Globalement, 90 % de la flotte est active, mais 25 utilisateurs VIP rencontrent des échecs d’attachement data en roaming à l’étranger, et notre site logistique principal souffre d’une zone blanche indoor.',
    coreDiagnosticAR:
      'بشكل عام، 90% من الأسطول مفعّل، لكن 25 مستخدماً من كبار التنفيذيين يواجهون فشل الاتصال ببيانات التجوال في الخارج، ويعاني موقعنا اللوجستي الرئيسي من انعدام التغطية الداخلية.',
    keyQuestions: [
      {
        en: 'Could you verify whether the roaming barring profile was accidentally applied to those 25 SIM cards on the HLR?',
        fr: 'Pouvez-vous vérifier si une restriction d’itinérance (roaming barring) a été appliquée par erreur sur ces 25 cartes SIM au niveau du HLR ?',
        ar: 'هل يمكنكم التحقق مما إذا كان حظر التجوال (Roaming Barring) قد طُبّق بالخطأ على هذه الشرائح الـ 25 في قاعدة بيانات المشتركين (HLR)؟',
      },
      {
        en: 'Can we prioritize VoWiFi provisioning on all handsets assigned to the warehouse team this afternoon?',
        fr: 'Pouvons-nous prioriser l’activation du VoWiFi sur tous les terminaux affectés à l’équipe de l’entrepôt cet après-midi ?',
        ar: 'هل يمكننا إعطاء الأولوية لتفعيل ميزة المكالمات عبر الواي فاي (VoWiFi) لجميع هواتف فريق المستودع بعد ظهر اليوم؟',
      },
    ],
    closingActionEN:
      'Thank you. Once the HLR roaming profiles are refreshed, please notify my team so we can ask the users to reboot their devices.',
    closingActionFR:
      'Merci. Dès que les profils roaming HLR sont rafraîchis, prévenez mon équipe afin que nous demandions aux utilisateurs de redémarrer leurs terminaux.',
    closingActionAR:
      'شكراً لكم. بمجرد تحديث ملفات التجوال على الشبكة، يرجى إبلاغ فريقي حتى نطلب من المستخدمين إعادة تشغيل أجهزتهم.',
    criticalVocab: ['Corporate mobile fleet', 'Data roaming attachment', 'Roaming barring', 'Indoor coverage blackspot', 'VoWiFi provisioning', 'Reboot devices'],
  },
  {
    id: 'tpl-qbr-sla',
    title: 'Comité de Pilotage Mensuel / Revue de Performance SLA (QBR)',
    domain: 'Gouvernance SDM & Qualité de Service',
    audience: 'Account Manager Opérateur & Direction IT Interne',
    objectiveFR: 'Présenter le bilan de disponibilité, challenger les dépassements de GTR et exiger un plan d’action.',
    objectiveAR: 'عرض حصيلة توفر الخدمة، ومناقشة تجاوزات وقت الإصلاح (MTTR)، والمطالبة بخطة تحسين.',
    openingEN:
      'Welcome everyone to our monthly Service Review. Today we will walk through KPI performance, major incidents, and our service improvement roadmap.',
    openingFR:
      'Bienvenue à tous pour notre revue mensuelle de service. Aujourd’hui nous allons parcourir les indicateurs de performance (KPI), les incidents majeurs et notre plan d’amélioration.',
    openingAR:
      'مرحباً بالجميع في المراجعة الشهرية للخدمة. سنستعرض اليوم مؤشرات الأداء (KPIs)، والحوادث الرئيسية، وخارطة طريق تحسين الخدمة.',
    coreDiagnosticEN:
      'While mobile voice availability reached 99.95%, fixed IP telephony availability dropped to 98.4% due to two prolonged SBC outages that exceeded the four-hour MTTR target.',
    coreDiagnosticFR:
      'Alors que la disponibilité voix mobile a atteint 99,95 %, la disponibilité téléphonie IP fixe a chuté à 98,4 % à cause de deux pannes SBC prolongées ayant dépassé la GTR de quatre heures.',
    coreDiagnosticAR:
      'بينما بلغت نسبة توفر الصوت في الهاتف المحمول 99.95%، انخفضت نسبة التوفر في الهاتف الثابت عبر IP إلى 98.4% بسبب انقطاعين طويلين تجاوزا وقت الإصلاح المستهدف (4 ساعات).',
    keyQuestions: [
      {
        en: 'What structural changes are you implementing to guarantee true active-active redundancy across our SIP trunks?',
        fr: 'Quels changements structurels mettez-vous en œuvre pour garantir une vraie redondance actif-actif sur nos trunks SIP ?',
        ar: 'ما هي التغييرات الهيكلية التي تطبقونها لضمان تكرار احتياطي فعلي (Active-Active Redundancy) عبر مسارات SIP لدينا؟',
      },
      {
        en: 'Can you confirm that the corresponding SLA service credits will be reflected on next month’s invoice?',
        fr: 'Pouvez-vous confirmer que les avoirs de pénalité SLA correspondants seront bien déduits sur la facture du mois prochain ?',
        ar: 'هل يمكنكم تأكيد إدراج تعويضات اتفاقية مستوى الخدمة (SLA Credits) المستحقة في فاتورة الشهر القادم؟',
      },
    ],
    closingActionEN:
      'We appreciate the transparency. I will circulate the meeting minutes and action tracker today, and we will review progress in two weeks.',
    closingActionFR:
      'Nous apprécions cette transparence. Je vais diffuser le compte-rendu et le tableau d’actions aujourd’hui, et nous contrôlerons l’avancement dans deux semaines.',
    closingActionAR:
      'نقدّر هذه الشفافية. سأقوم بتعميم محضر الاجتماعوجدول متابعة الإجراءات اليوم،وسنراجع التقدم المحرز بعد أسبوعين.',
    criticalVocab: ['Walk through KPIs', 'Availability dropped to', 'Exceeded the MTTR target', 'Active-active redundancy', 'SLA service credits', 'Circulate meeting minutes'],
  },
];

export const WRITTEN_EXERCISES: WrittenExercise[] = [
  {
    id: 'ex-1',
    category: 'sip_voip',
    categoryLabel: 'SIP & VoIP Fixe',
    situationFR:
      'En réunion d’escalade, vous voulez dire : "Depuis ce matin, nos appels sortants sont coupés ou n’entendent qu’un seul côté sur le trunk principal."',
    situationAR:
      'في اجتماع تصعيد، تريد أن تقول: "منذ هذا الصباح، مكالماتنا الصادرة تنقطع أو يُسمع الصوت فيها من طرف واحد فقط على المسار الرئيسي."',
    weakAttemptEN:
      '"Since this morning, our outside calls are cutting or we hear only one side on the main line."',
    promptQuestion: 'Quelle formulation SDM professionnelle devez-vous utiliser ?',
    targetFrenchC1:
      'Depuis ce matin, nous constatons des coupures d’appels intermittentes et un flux audio unidirectionnel sur les appels sortants du trunk SIP principal.',
    targetArabic:
      'منذ هذا الصباح، نواجه انقطاعات متقطعة في المكالمات وانقطاعاً للصوت من طرف واحد في المكالمات الصادرة عبر مسار SIP الرئيسي.',
    options: [
      {
        id: 'opt-1a',
        textEN:
          'Since this morning, we are experiencing intermittent call drops and one-way audio on outbound calls across our primary SIP trunk.',
        isCorrect: true,
        explanationFR:
          'Exact ! "experiencing intermittent call drops" (coupures d’appels), "one-way audio" (audio unidirectionnel), "outbound calls" (appels sortants) et "primary SIP trunk" sont les termes exacts attendus par un opérateur.',
        explanationAR:
          'صحيح تماماً! المصطلحات (intermittent call drops) و(one-way audio) و(outbound calls) هي الصياغة القياسية الدقيقة في قطاع الاتصالات.',
      },
      {
        id: 'opt-1b',
        textEN:
          'Since this morning, our external phone calls have a cut problem and half-voice on the first SIP pipe.',
        isCorrect: false,
        explanationFR:
          'Attention : "external calls" se dit "outbound calls" (sortants) ou "inbound calls" (entrants), "half-voice" n’existe pas ("one-way audio"), et "pipe" est familier ("trunk").',
        explanationAR:
          'غير دقيق: لا نستخدم (half-voice) بل (one-way audio)، والمكالمات الصادرة تسمى (outbound calls).',
      },
      {
        id: 'opt-1c',
        textEN:
          'From today morning, the voice is breaking and going one way only on the principal line.',
        isCorrect: false,
        explanationFR:
          'Traduction mot à mot trop fragile : privilégiez la structure "We are experiencing [nom du symptôme] across our primary SIP trunk".',
        explanationAR:
          'ترجمة حرفية ضعيفة؛ استخدم دائماً الصيغة المهنية (We are experiencing + اسم العطل الفني).',
      },
    ],
  },
  {
    id: 'ex-2',
    category: 'porting_provisioning',
    categoryLabel: 'Portabilité & SDA',
    situationFR:
      'Vous voulez expliquer pourquoi la portabilité de 100 numéros a été bloquée : "L’ancien opérateur a refusé le transfert de la tranche de numéros à cause d’une erreur de code RIO."',
    situationAR:
      'تريد شرح سبب توقف نقل 100 رقم: "رفض المشغل السابق نقل مجموعة الأرقام بسبب خطأ في رمز RIO."',
    weakAttemptEN:
      '"The old operator refused to change the 100 numbers because the RIO code was false."',
    promptQuestion: 'Quelle est la phrase exacte d’un Service Delivery Manager Télécom ?',
    targetFrenchC1:
      'L’opérateur donneur a rejeté la demande de portabilité pour la tranche de 100 SDA en raison d’une incohérence de code RIO.',
    targetArabic:
      'رفض المشغل المانح طلب نقل الأرقام لنطاق الـ 100 رقم مباشر (DID) بسبب عدم تطابق رمز RIO.',
    options: [
      {
        id: 'opt-2a',
        textEN:
          'The ancient provider said no to moving the 100 numbers because of a false RIO.',
        isCorrect: false,
        explanationFR:
          'Faux-ami classique : "ancien opérateur" ne se dit jamais "ancient provider" (qui veut dire antique !), mais "donor carrier" (opérateur donneur) ou "incumbent carrier".',
        explanationAR:
          'خطأ شائع: المشغل السابق في عملية نقل الأرقام يسمى (Donor carrier) وليس (Ancient provider).',
      },
      {
        id: 'opt-2b',
        textEN:
          'The donor carrier rejected the porting request for the 100-DID range due to a RIO code mismatch.',
        isCorrect: true,
        explanationFR:
          'Parfait ! "Donor carrier" (opérateur donneur), "rejected the porting request" (a rejeté la demande de portabilité), "DID range" (tranche SDA) et "mismatch" (incohérence/écart).',
        explanationAR:
          'ممتاز! (Donor carrier) هو المشغل المانح، و(DID range) هو نطاق الأرقام المباشرة، و(mismatch) تعني عدم تطابق.',
      },
      {
        id: 'opt-2c',
        textEN:
          'The giver operator blocked the portability of the 100 phone numbers for a bad RIO.',
        isCorrect: false,
        explanationFR:
          'En anglais télécom, on dit "porting request" (et non "portability" pour l’opération) et "donor carrier" (jamais "giver operator").',
        explanationAR:
          'في الإنجليزية المهنية للاتصالات نستخدم (porting request) و(donor carrier).',
      },
    ],
  },
  {
    id: 'ex-3',
    category: 'mobile_fleet',
    categoryLabel: 'Mobile & Flotte Entreprise',
    situationFR:
      'Un site industriel capte très mal le réseau mobile à l’intérieur : "Pour corriger la zone blanche dans l’usine, nous avons activé les appels Wi-Fi sur toute la flotte mobile."',
    situationAR:
      'أحد المواقع الصناعية يعاني من انعدام التغطية بالداخل: "لمعالجة منطقة انعدام التغطية داخل المصنع، قمنا بتفعيل المكالمات عبر الواي فاي على جميع هواتف الأسطول."',
    weakAttemptEN:
      '"To fix the white zone inside the factory, we put Wi-Fi calls on all company phones."',
    promptQuestion: 'Comment formulez-vous cette action sans tomber dans le faux-ami "white zone" ?',
    targetFrenchC1:
      'Pour pallier la zone blanche indoor de l’usine, nous avons activé le VoWiFi sur l’ensemble de la flotte mobile entreprise.',
    targetArabic:
      'لمعالجة نقطة انعدام التغطية الداخلية في المصنع، قمنا بتفعيل خدمة VoWiFi عبر كامل أسطول الهواتف المهنية.',
    options: [
      {
        id: 'opt-3a',
        textEN:
          'To mitigate the indoor coverage blackspot at the plant, we provisioned VoWiFi across the entire corporate mobile fleet.',
        isCorrect: true,
        explanationFR:
          'Bravo ! "Mitigate" (pallier/atténuer), "indoor coverage blackspot" (zone blanche indoor), "provisioned VoWiFi" (activé le VoWiFi) et "corporate mobile fleet" (flotte mobile entreprise).',
        explanationAR:
          'أحسنت! (Coverage blackspot) هي الترجمة الصحيحة لمنطقة انعدام التغطية، و(provisioned VoWiFi) تعني تفعيل المكالمات عبر الواي فاي.',
      },
      {
        id: 'opt-3b',
        textEN:
          'To repair the indoor white zone at the factory, we turned on Wi-Fi calling for the mobile park.',
        isCorrect: false,
        explanationFR:
          'Deux faux-amis français -> anglais ici : "zone blanche" = "coverage blackspot / dead zone" (jamais "white zone"), et "parc mobile" = "mobile fleet" (jamais "mobile park").',
        explanationAR:
          'احذر من الترجمة الحرفية من الفرنسية: (Zone blanche) تُترجم (Coverage blackspot)، و(Parc mobile) تُترجم (Mobile fleet).',
      },
      {
        id: 'opt-3c',
        textEN:
          'For solving the no-network place inside, we installed Wi-Fi voice on the enterprise telephones.',
        isCorrect: false,
        explanationFR:
          'Trop approximatif. Gardez le binôme "indoor coverage blackspot" + "corporate mobile fleet".',
        explanationAR:
          'صياغة عامة جداً؛ استخدم المصطلحات القياسية (indoor coverage blackspot) و(corporate mobile fleet).',
      },
    ],
  },
  {
    id: 'ex-4',
    category: 'sla_escalation',
    categoryLabel: 'SLA & Escalade Opérateur',
    situationFR:
      'Vous voulez conclure votre intervention fermement : "Nous avons mis une solution de secours temporaire, mais nous avons besoin que votre Niveau 3 corrige la cause racine avant 16h00 pour éviter un dépassement de SLA."',
    situationAR:
      'تريد إنهاء مداخلتك بحزم: "لقد طبقنا حلاً بديلاً مؤقتاً، لكننا نحتاج من فريق المستوى الثالث لديكم إصلاح السبب الجذري قبل الساعة 16:00 لتجنب خرق اتفاقية SLA."',
    weakAttemptEN:
      '"We put a temporary solution, but we need your level 3 to fix the real problem before 16:00 to not break the SLA."',
    promptQuestion: 'Quelle phrase de clôture vous donne une posture de SDM senior ?',
    targetFrenchC1:
      'Nous avons mis en place une solution de contournement temporaire, mais votre équipe Niveau 3 doit résoudre la cause racine avant 16h00 afin d’éviter un dépassement de SLA.',
    targetArabic:
      'لقد قمنا بتطبيق حل بديل مؤقت (Workaround)، ولكن نحتاج من فريق المستوى الثالث لديكم معالجة السبب الجذري قبل الساعة 16:00 لتفادي خرق اتفاقية مستوى الخدمة (SLA Breach).',
    options: [
      {
        id: 'opt-4a',
        textEN:
          'We have implemented a temporary workaround, but we need your Tier-3 team to resolve the root cause before 16:00 to prevent an SLA breach.',
        isCorrect: true,
        explanationFR:
          'Impeccable ! Vous maîtrisez les 4 piliers SDM : "implemented a temporary workaround", "Tier-3 team", "resolve the root cause", et "prevent an SLA breach".',
        explanationAR:
          'رائع! جمعت في جملة واحدة أهم أربع ركائز لمدير الخدمة: (temporary workaround)، (Tier-3 team)، (root cause)، و(prevent an SLA breach).',
      },
      {
        id: 'opt-4b',
        textEN:
          'We did a backup trick, so your third level must repair the base reason before 16:00 for no SLA penalty.',
        isCorrect: false,
        explanationFR:
          '"Solution de contournement" = "workaround", "Niveau 3" = "Tier-3", et "cause racine" = "root cause".',
        explanationAR:
          'البديل المؤقت يسمى (workaround)، والمستوى الثالث يسمى (Tier-3)، والسبب الجذري (root cause).',
      },
      {
        id: 'opt-4c',
        textEN:
          'We made a temporary change, and please ask level 3 to finish the fix before 16:00.',
        isCorrect: false,
        explanationFR:
          'Manque de précision contractuelle : mentionnez explicitement "resolve the root cause" et "prevent an SLA breach".',
        explanationAR:
          'تنقصها الدقة التعاقدية؛ من الضروري ذكر (resolve the root cause) و(prevent an SLA breach).',
      },
    ],
  },
  {
    id: 'ex-5',
    category: 'sla_escalation',
    categoryLabel: 'Gouvernance & Clôture',
    situationFR:
      'En fin d’appel d’escalade, vous voulez demander le rapport officiel d’incident : "Merci d’envoyer le rapport RFO complet avec les actions préventives d’ici la fin de journée."',
    situationAR:
      'في نهاية اتصال التصعيد، تريد طلب التقرير الرسمي للحادث: "يرجى إرسال تقرير سبب الانقطاع (RFO) الكامل مع الإجراءات الوقائية قبل نهاية عمل اليوم."',
    weakAttemptEN:
      '"Please send the document that explains the outage and how it will not happen again before tonight."',
    promptQuestion: 'Quelle est la formule de clôture SDM standard ?',
    targetFrenchC1:
      'Merci de nous transmettre le rapport RFO complet accompagné du plan d’actions préventives d’ici la fin de journée (EOB).',
    targetArabic:
      'يرجى إرسال تقرير سبب الانقطاع (RFO) الكامل مرفقاً بخطة الإجراءات الوقائية قبل نهاية عمل اليوم (by end of business today).',
    options: [
      {
        id: 'opt-5a',
        textEN:
          'Please share the comprehensive RFO report along with the preventive action plan by end of business today.',
        isCorrect: true,
        explanationFR:
          'Parfait ! "RFO report (Reason for Outage)", "preventive action plan" et "by end of business today (EOB)" ferment votre phrase avec une netteté absolue.',
        explanationAR:
          'ممتاز! استخدام (comprehensive RFO report) و(preventive action plan) و(by end of business today) يمنحك ختاماً مهنياً قوياً وواضحاً.',
      },
      {
        id: 'opt-5b',
        textEN:
          'Please send the explanation paper and future protections before the end of the day.',
        isCorrect: false,
        explanationFR:
          'Utilisez toujours l’acronyme standard "RFO (Reason for Outage)" ou "RCA (Root Cause Analysis)" + "preventive action plan".',
        explanationAR:
          'استخدم دائماً المصطلح القياسي (RFO report) و(preventive action plan).',
      },
      {
        id: 'opt-5c',
        textEN:
          'Could you give us the outage history and security actions before evening?',
        isCorrect: false,
        explanationFR:
          '"Outage history" désigne un historique global, pas le rapport d’incident officiel ("RFO").',
        explanationAR:
          'تقرير الحادث الرسمي يسمى (RFO - Reason for Outage) وليس (outage history).',
      },
    ],
  },
];
