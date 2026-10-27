import React from 'react';
import { ArrowRight, CheckCircle2, Layers, BookOpen, FileText, PenTool } from 'lucide-react';
import { ROADMAP_STEPS, RoadmapStep } from '../data/sdmData';
import { MasteryStats } from '../utils/sdmEngine';

interface MethodologyViewProps {
  stats: MasteryStats;
  onNavigateTab: (tab: RoadmapStep['targetTab']) => void;
}

export const MethodologyView: React.FC<MethodologyViewProps> = ({
  stats,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-12">
      {/* Hero Section: Diagnostic & Trilingual Cognitive Bridge */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                <span>Service Delivery Manager</span>
                <span aria-hidden="true">·</span>
                <span>Téléphonie IP Fixe (SIP / SBC) & Mobile (eSIM / Flotte)</span>
                <span aria-hidden="true">·</span>
                <span>Méthode Écrite Trilingue</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight headline-balance">
                Passez d’un « petit B2 hésitant » à un anglais SDM chirurgical grâce au pont écrit Anglais · Français · Arabe.
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                Votre blocage à l’oral ne vient pas d’un manque d’intelligence technique : il vient du fait qu’en réunion opérateur ou équipe, chercher un mot précis vous oblige à improviser des périphrases (« the voice cuts », « the old operator »). Cette méthode 100 % écrite remplace l’improvisation par <strong>des blocs de phrases pré-assemblés</strong> et un <strong>ancrage simultané dans vos 3 langues</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigateTab('builder')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Construire mes Phrases SDM</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('lexicon')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Explorer le Lexique EN · FR · AR</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('meeting')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Préparer une Réunion en 3 min</span>
              </button>
            </div>
          </div>

          {/* Right Column: The Trilingual Mental Bridge Visual Demonstration */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-lg p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-1">
              <div className="text-xs text-sky-300 font-medium">
                Démonstration du Pont Cognitif Trilingue
              </div>
              <h2 className="text-lg font-semibold text-white">
                Pourquoi lier l’Arabe, le Français (C1) et l’Anglais accélère la mémoire par 3
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3.5 rounded-md bg-slate-800/90 border border-slate-700 space-y-1">
                <div className="text-xs text-rose-300">
                  À bannir (Anglais B1/B2 approximatif qui fait perdre vos moyens)
                </div>
                <p className="font-mono-tabular text-slate-300 line-through">
                  &ldquo;The calls cut and we hear only one side on the main line.&rdquo;
                </p>
              </div>

              <div className="p-3.5 rounded-md bg-slate-800/90 border border-sky-500/40 space-y-2">
                <div className="text-xs text-sky-300 font-medium">
                  1. Ancrage Natal (Arabe) · Compréhension immédiate du concept
                </div>
                <p dir="rtl" lang="ar" className="font-arabic text-base text-slate-100">
                  نواجه انقطاعات متقطعة وانقطاع الصوت من طرف واحد عبر مسار SIP الرئيسي.
                </p>
              </div>

              <div className="p-3.5 rounded-md bg-slate-800/90 border border-slate-700 space-y-1">
                <div className="text-xs text-slate-300">
                  2. Pont Professionnel (Français C1) · Précision du terme métier
                </div>
                <p className="text-slate-100">
                  Nous constatons des <strong>coupures intermittentes</strong> et un <strong>audio unidirectionnel</strong> sur le trunk SIP principal.
                </p>
              </div>

              <div className="p-3.5 rounded-md bg-sky-950/90 border border-sky-400/50 space-y-1">
                <div className="text-xs text-sky-300 font-semibold">
                  3. Cible Orale & Écrite (Anglais SDM Standard International)
                </div>
                <p className="text-white font-semibold">
                  &ldquo;We are experiencing intermittent call drops and one-way audio across our primary SIP trunk.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-Column KPI / Mastery Strip below the Hero split */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200">
          <div className="space-y-1">
            <div className="text-xs text-slate-500">Indice de Préparation SDM</div>
            <div className="text-2xl font-bold text-slate-900 font-mono-tabular">
              {stats.overallReadinessPercent}%
            </div>
            <div className="text-xs text-sky-700 font-medium">{stats.readinessLevelLabel}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-500">Lexique Télécom Maîtrisé</div>
            <div className="text-2xl font-bold text-slate-900 font-mono-tabular">
              {stats.masteredLexiconCount} / {stats.totalLexiconCount}
            </div>
            <div className="text-xs text-slate-500">Expressions clés EN · FR · AR</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-500">Sprints Écrits Validés</div>
            <div className="text-2xl font-bold text-slate-900 font-mono-tabular">
              {stats.completedExercisesCount} / {stats.totalExercisesCount}
            </div>
            <div className="text-xs text-slate-500">Mises en situation réelles</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-500">Fiches Réunion & Phrases</div>
            <div className="text-2xl font-bold text-slate-900 font-mono-tabular">
              {stats.savedMeetingSheetsCount + stats.savedPhrasesCount}
            </div>
            <div className="text-xs text-slate-500">Prêtes pour vos appels</div>
          </div>
        </div>
      </section>

      {/* Core Method: How to Start, Build, and Finish Every Sentence */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-medium text-sky-700">
            Architecture Syntaxique Anti-Hésitation
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Comment commencer, structurer et finir vos phrases en anglais (La Règle des 3 Briques)
          </h2>
          <p className="text-sm text-slate-600 max-w-3xl">
            En réunion, ne cherchez jamais à construire des phrases complexes avec plusieurs propositions subordonnées. Utilisez systématiquement ce moule visuel en 3 temps :
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Block 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="text-xs font-mono-tabular text-slate-500">
                ÉTAPE 01 · AMORCER (START)
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Cadrer le contexte dès les 4 premiers mots
              </h3>
              <p className="text-sm text-slate-600">
                Ne commencez jamais par <em>&ldquo;So, uh, we have a problem with...&rdquo;</em>. Utilisez un connecteur d’autorité fixe qui annonce pourquoi vous prenez la parole.
              </p>
              <div className="pt-2 space-y-2.5 text-sm border-t border-slate-100">
                <div>
                  <p className="font-semibold text-slate-900">
                    &ldquo;Based on our SBC traces, we see that...&rdquo;
                  </p>
                  <p className="text-xs text-slate-500">
                    D’après nos traces SBC, nous constatons que...
                  </p>
                  <p dir="rtl" lang="ar" className="text-xs font-arabic text-slate-600">
                    بناءً على سجلات SBC لدينا، نلاحظ أن...
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    &ldquo;From a Service Delivery standpoint...&rdquo;
                  </p>
                  <p className="text-xs text-slate-500">
                    Du point de vue Service Delivery...
                  </p>
                  <p dir="rtl" lang="ar" className="text-xs font-arabic text-slate-600">
                    من منظور إدارة تقديم الخدمة (SDM)...
                  </p>
                </div>
              </div>
            </div>
            <div className="text-xs text-sky-700 font-medium pt-2 border-t border-slate-100">
              Règle : Mémorisez 3 amorces fixes et utilisez toujours les mêmes.
            </div>
          </div>

          {/* Block 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="text-xs font-mono-tabular text-slate-500">
                ÉTAPE 02 · EXPLIQUER LE CŒUR (CORE)
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Sujet Technique + Verbe Précis + Symptôme
              </h3>
              <p className="text-sm text-slate-600">
                Gardez l’ordre strict <strong>[Périmètre] + [is experiencing / rejected] + [Terme exact]</strong>. C’est ici que le lexique IP & Mobile remplace les longs discours.
              </p>
              <div className="pt-2 space-y-2.5 text-sm border-t border-slate-100">
                <div>
                  <p className="font-semibold text-slate-900">
                    &ldquo;...our primary SIP trunk is experiencing one-way audio...&rdquo;
                  </p>
                  <p className="text-xs text-slate-500">
                    ...notre trunk SIP principal subit un audio unidirectionnel...
                  </p>
                  <p dir="rtl" lang="ar" className="text-xs font-arabic text-slate-600">
                    ...مسار SIP الرئيسي يعاني من انقطاع الصوت من طرف واحد...
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    &ldquo;...the donor carrier rejected the 100-DID porting order...&rdquo;
                  </p>
                  <p className="text-xs text-slate-500">
                    ...l’opérateur donneur a rejeté la portabilité des 100 SDA...
                  </p>
                  <p dir="rtl" lang="ar" className="text-xs font-arabic text-slate-600">
                    ...رفض المشغل المانح طلب نقل الـ 100 رقم مباشر...
                  </p>
                </div>
              </div>
            </div>
            <div className="text-xs text-sky-700 font-medium pt-2 border-t border-slate-100">
              Règle : 1 seul verbe fort par phrase (« experience », « reject », « provision »).
            </div>
          </div>

          {/* Block 3 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="text-xs font-mono-tabular text-slate-500">
                ÉTAPE 03 · VERROUILLER LA FIN (CLOSE)
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Finir par l’action attendue et l’heure précise
              </h3>
              <p className="text-sm text-slate-600">
                Ne laissez jamais votre phrase s’éteindre dans le vague. Fermez systématiquement par <strong>so we need [Qui] to [Action] before [Heure]</strong>.
              </p>
              <div className="pt-2 space-y-2.5 text-sm border-t border-slate-100">
                <div>
                  <p className="font-semibold text-slate-900">
                    &ldquo;...so we need Tier-3 to reroute traffic before 14:00 UTC.&rdquo;
                  </p>
                  <p className="text-xs text-slate-500">
                    ...nous demandons au Niveau 3 de rerouter le trafic avant 14h00 UTC.
                  </p>
                  <p dir="rtl" lang="ar" className="text-xs font-arabic text-slate-600">
                    ...لذا نحتاج من المستوى الثالث إعادة توجيه الحركة قبل 14:00.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    &ldquo;...could you confirm the RFO timeline by end of business?&rdquo;
                  </p>
                  <p className="text-xs text-slate-500">
                    ...pouvez-vous confirmer le délai du RFO d’ici la fin de journée ?
                  </p>
                  <p dir="rtl" lang="ar" className="text-xs font-arabic text-slate-600">
                    ...هل يمكنكم تأكيد موعد تقرير الانقطاع قبل نهاية عمل اليوم؟
                  </p>
                </div>
              </div>
            </div>
            <div className="text-xs text-sky-700 font-medium pt-2 border-t border-slate-100">
              Règle : Une heure ou un jalon (« by EOB », « within 30 min ») clôt la phrase net.
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Progression Roadmap */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-medium text-sky-700">
            Parcours d’Accélération en 4 Étapes
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Votre plan de progression écrit (zéro écoute passive, 100 % opérationnel)
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ROADMAP_STEPS.map((step) => {
            const IconComponent =
              step.targetTab === 'lexicon'
                ? BookOpen
                : step.targetTab === 'builder'
                ? Layers
                : step.targetTab === 'meeting'
                ? FileText
                : PenTool;

            return (
              <div
                key={step.stepNumber}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4 text-xs text-slate-500">
                    <span className="font-mono-tabular font-semibold text-slate-900">
                      ÉTAPE {step.stepNumber}
                    </span>
                    <span>{step.duration}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      {step.titleFR}
                    </h3>
                    <p className="text-xs font-medium text-sky-700">{step.titleEN}</p>
                    <p dir="rtl" lang="ar" className="text-sm font-arabic text-slate-700">
                      {step.titleAR}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 text-sm text-slate-600">
                    <p>
                      <strong className="text-slate-900">Problème ciblé :</strong> {step.problemSolved}
                    </p>
                    <p>
                      <strong className="text-slate-900">Méthode écrite :</strong> {step.concreteMethod}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-mono-tabular text-slate-600">
                    {step.formulaPattern}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigateTab(step.targetTab)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-sky-700 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <IconComponent className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{step.targetTabLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Cheat-Sheet Table: Faux-Amis Français -> Anglais en Téléphonie */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-5">
        <div className="space-y-1">
          <div className="text-xs font-medium text-sky-700">
            Table de Correspondance Immédiate
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Les 6 pièges et faux-amis majeurs en Téléphonie IP Fixe & Mobile (EN · FR · AR)
          </h2>
          <p className="text-sm text-slate-600">
            Même avec un niveau C1 en français, traduire littéralement ces termes techniques bloque la compréhension de vos interlocuteurs anglophones.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                <th className="py-3 pr-4">Terme Français (ou piège)</th>
                <th className="py-3 px-4">Faux-ami à éviter</th>
                <th className="py-3 px-4">Terme Anglais SDM Exact</th>
                <th className="py-3 pl-4 text-right">المرجع بالعربية (Ancrage Arabe)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-3 pr-4 font-medium text-slate-900">Tranche de numéros SDA</td>
                <td className="py-3 px-4 text-rose-700 line-through font-mono-tabular">SDA slice / Direct numbers</td>
                <td className="py-3 px-4 font-semibold text-sky-800">DID range / DDI block</td>
                <td dir="rtl" lang="ar" className="py-3 pl-4 font-arabic text-slate-700 text-right">نطاق الأرقام المباشرة (DID Range)</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-slate-900">Zone blanche (sans réseau mobile)</td>
                <td className="py-3 px-4 text-rose-700 line-through font-mono-tabular">White zone</td>
                <td className="py-3 px-4 font-semibold text-sky-800">Coverage blackspot / Dead zone</td>
                <td dir="rtl" lang="ar" className="py-3 pl-4 font-arabic text-slate-700 text-right">نقطة انعدام التغطية (Blackspot)</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-slate-900">Parc / Flotte mobile entreprise</td>
                <td className="py-3 px-4 text-rose-700 line-through font-mono-tabular">Mobile park</td>
                <td className="py-3 px-4 font-semibold text-sky-800">Corporate mobile fleet</td>
                <td dir="rtl" lang="ar" className="py-3 pl-4 font-arabic text-slate-700 text-right">أسطول الهواتف المهنية للشركة</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-slate-900">Ancien opérateur (portabilité)</td>
                <td className="py-3 px-4 text-rose-700 line-through font-mono-tabular">Old / Ancient operator</td>
                <td className="py-3 px-4 font-semibold text-sky-800">Donor carrier / Losing carrier</td>
                <td dir="rtl" lang="ar" className="py-3 pl-4 font-arabic text-slate-700 text-right">المشغل المانح (Donor Carrier)</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-slate-900">GTR (Garantie de Temps de Rétablissement)</td>
                <td className="py-3 px-4 text-rose-700 line-through font-mono-tabular">GTR / Guarantee of time</td>
                <td className="py-3 px-4 font-semibold text-sky-800">MTTR target / Restoration SLA</td>
                <td dir="rtl" lang="ar" className="py-3 pl-4 font-arabic text-slate-700 text-right">الوقت المستهدف لإصلاح العطل (MTTR)</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-slate-900">Bascule de mise en production</td>
                <td className="py-3 px-4 text-rose-700 line-through font-mono-tabular">Production switch / Tilt</td>
                <td className="py-3 px-4 font-semibold text-sky-800">Cutover window / Migration rollout</td>
                <td dir="rtl" lang="ar" className="py-3 pl-4 font-arabic text-slate-700 text-right">عملية التحويل الفعلي للخدمة (Cutover)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
