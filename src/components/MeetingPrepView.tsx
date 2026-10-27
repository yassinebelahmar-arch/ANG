import React, { useState } from 'react';
import { Check, Copy, FileCheck, PlusCircle, Trash2 } from 'lucide-react';
import { MEETING_TEMPLATES, MeetingTemplate } from '../data/sdmData';
import {
  CustomMeetingContext,
  GeneratedMeetingSheet,
  generateCustomMeetingSheet,
} from '../utils/sdmEngine';

interface MeetingPrepViewProps {
  savedSheets: GeneratedMeetingSheet[];
  onSaveSheet: (sheet: GeneratedMeetingSheet) => void;
  onDeleteSheet: (id: string) => void;
}

export const MeetingPrepView: React.FC<MeetingPrepViewProps> = ({
  savedSheets,
  onSaveSheet,
  onDeleteSheet,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(MEETING_TEMPLATES[0].id);
  const [carrierOrTeamName, setCarrierOrTeamName] = useState('Colt / Orange Wholesale NOC');
  const [ticketReference, setTicketReference] = useState('#INC-84920');
  const [impactedPerimeter, setImpactedPerimeter] = useState('Primary SIP Trunk & 150 DIDs');
  const [targetDeadline, setTargetDeadline] = useState('14:30 UTC');
  const [personalNotesFR, setPersonalNotesFR] = useState(
    'Vérifier le routage RTP sur le SBC secondaire et demander le RFO sous 24h.'
  );
  const [copiedSheet, setCopiedSheet] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const activeTemplate: MeetingTemplate =
    MEETING_TEMPLATES.find((t) => t.id === selectedTemplateId) || MEETING_TEMPLATES[0];

  const context: CustomMeetingContext = {
    carrierOrTeamName,
    ticketReference,
    impactedPerimeter,
    targetDeadline,
    personalNotesFR,
  };

  const liveSheet = generateCustomMeetingSheet(activeTemplate, context);

  const handleCopyFullBrief = () => {
    const text = [
      `=== SDM MEETING SPEAKING SHEET: ${liveSheet.templateTitle} ===`,
      `Target / Carrier: ${liveSheet.carrierOrTeamName} | Ref: ${liveSheet.ticketReference}`,
      `Scope: ${liveSheet.impactedPerimeter} | Target ETA: ${liveSheet.targetDeadline}`,
      ``,
      `1. OPENING (COMMENT COMMENCER) :`,
      `EN: "${liveSheet.openingEN}"`,
      `FR: ${liveSheet.openingFR}`,
      `AR: ${liveSheet.openingAR}`,
      ``,
      `2. TECHNICAL CORE (EXPLIQUER LE DIAGNOSTIC) :`,
      `EN: "${liveSheet.coreDiagnosticEN}"`,
      `FR: ${liveSheet.coreDiagnosticFR}`,
      `AR: ${liveSheet.coreDiagnosticAR}`,
      ``,
      `3. KEY QUESTIONS FOR THE PROVIDER / TEAM :`,
      ...liveSheet.keyQuestions.map((q, i) => `Q${i + 1} (EN): "${q.en}"\n   (FR): ${q.fr}\n   (AR): ${q.ar}`),
      ``,
      `4. CLOSING & ACTION LOCK (COMMENT FINIR) :`,
      `EN: "${liveSheet.closingActionEN}"`,
      `FR: ${liveSheet.closingActionFR}`,
      `AR: ${liveSheet.closingActionAR}`,
    ].join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedSheet(true);
    setTimeout(() => setCopiedSheet(false), 1800);
  };

  const handleSaveToLog = (e: React.FormEvent) => {
    e.preventDefault();
    const sheetToSave = generateCustomMeetingSheet(
      activeTemplate,
      context,
      new Date().toISOString()
    );
    onSaveSheet(sheetToSave);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
        <div className="text-xs font-medium text-sky-700">
          Préparation & Organisation de Réunion en 3 Minutes (Support Écrit)
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Préparez vos notes écrites avant chaque appel Opérateur, Équipe ou Client
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Comme vous retenez mieux par l’écrit, ne prenez jamais la parole à froid. Choisissez le scénario de votre réunion, renseignez votre numéro de ticket et votre périmètre, et gardez votre <strong>fiche de prise de parole trilingue</strong> sous les yeux pendant l’appel.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Meeting Setup & Customization Form */}
        <form
          onSubmit={handleSaveToLog}
          className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5"
        >
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              1. Choisissez le type de réunion Télécom SDM
            </label>
            <div className="space-y-2">
              {MEETING_TEMPLATES.map((tpl) => {
                const active = tpl.id === selectedTemplateId;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-colors cursor-pointer space-y-1 ${
                      active
                        ? 'bg-sky-50/80 border-sky-600 text-slate-900'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs text-slate-500">{tpl.domain}</div>
                    <div className="text-sm font-bold text-slate-900">{tpl.title}</div>
                    <div className="text-xs text-slate-600">{tpl.objectiveFR}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-4">
            <div className="text-xs font-semibold text-slate-700">
              2. Personnalisez vos paramètres avant l’appel
            </div>

            <div>
              <label htmlFor="prep-carrier" className="block text-xs font-medium text-slate-600 mb-1">
                Opérateur / Interlocuteur (Provider ou Équipe)
              </label>
              <input
                id="prep-carrier"
                type="text"
                value={carrierOrTeamName}
                onChange={(e) => setCarrierOrTeamName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="prep-ticket" className="block text-xs font-medium text-slate-600 mb-1">
                  Référence Ticket / Projet
                </label>
                <input
                  id="prep-ticket"
                  type="text"
                  value={ticketReference}
                  onChange={(e) => setTicketReference(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono-tabular bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div>
                <label htmlFor="prep-deadline" className="block text-xs font-medium text-slate-600 mb-1">
                  Échéance / Prochain Point
                </label>
                <input
                  id="prep-deadline"
                  type="text"
                  value={targetDeadline}
                  onChange={(e) => setTargetDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono-tabular bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="prep-perimeter" className="block text-xs font-medium text-slate-600 mb-1">
                Périmètre technique impacté (Trunk, SDA, Flotte Mobile)
              </label>
              <input
                id="prep-perimeter"
                type="text"
                value={impactedPerimeter}
                onChange={(e) => setImpactedPerimeter(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <div>
              <label htmlFor="prep-notes" className="block text-xs font-medium text-slate-600 mb-1">
                Aide-mémoire personnel (Français / Arabe / Points à ne pas oublier)
              </label>
              <textarea
                id="prep-notes"
                rows={2}
                value={personalNotesFR}
                onChange={(e) => setPersonalNotesFR(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              <span>
                {justSaved ? 'Fiche sauvegardée dans vos réunions ✓' : 'Sauvegarder cette fiche de réunion'}
              </span>
            </button>
          </div>
        </form>

        {/* Right 7 Cols: The Structured Trilingual Speaking Sheet */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="space-y-1">
                <div className="text-xs text-slate-500">
                  Fiche Orale & Écrite Prête à l’Emploi · {activeTemplate.audience}
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {liveSheet.templateTitle}
                </h2>
              </div>

              <button
                type="button"
                onClick={handleCopyFullBrief}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copiedSheet ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    <span>Fiche complète copiée</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" aria-hidden="true" />
                    <span>Copier toute la fiche</span>
                  </>
                )}
              </button>
            </div>

            {/* Step 1: Opening */}
            <div className="space-y-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs font-mono-tabular font-semibold text-sky-800">
                01. OUVERTURE DE RÉUNION (COMMENT COMMENCER)
              </div>
              <p className="text-base font-bold text-slate-900">
                &ldquo;{liveSheet.openingEN}&rdquo;
              </p>
              <p className="text-xs text-slate-600">
                <strong>FR :</strong> {liveSheet.openingFR}
              </p>
              <p dir="rtl" lang="ar" className="text-xs font-arabic text-slate-700 text-right">
                {liveSheet.openingAR}
              </p>
            </div>

            {/* Step 2: Technical Core */}
            <div className="space-y-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs font-mono-tabular font-semibold text-sky-800">
                02. EXPLICATION TECHNIQUE (CONSTAT & CAUSE RACINE)
              </div>
              <p className="text-base font-bold text-slate-900">
                &ldquo;{liveSheet.coreDiagnosticEN}&rdquo;
              </p>
              <p className="text-xs text-slate-600">
                <strong>FR :</strong> {liveSheet.coreDiagnosticFR}
              </p>
              <p dir="rtl" lang="ar" className="text-xs font-arabic text-slate-700 text-right">
                {liveSheet.coreDiagnosticAR}
              </p>
            </div>

            {/* Step 3: Key Questions to Drive the Call */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs font-mono-tabular font-semibold text-sky-800">
                03. QUESTIONS PRÉCISES À POSER À L’OPÉRATEUR / ÉQUIPE
              </div>
              <div className="space-y-3">
                {liveSheet.keyQuestions.map((q, index) => (
                  <div key={index} className="space-y-1 pt-2 first:pt-0 border-t first:border-t-0 border-slate-200">
                    <p className="text-sm font-bold text-slate-900">
                      Q{index + 1}: &ldquo;{q.en}&rdquo;
                    </p>
                    <p className="text-xs text-slate-600">
                      <strong>FR :</strong> {q.fr}
                    </p>
                    <p dir="rtl" lang="ar" className="text-xs font-arabic text-slate-700 text-right">
                      {q.ar}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4: Closing & SLA Lock */}
            <div className="space-y-2 p-4 bg-slate-900 text-white rounded-lg">
              <div className="text-xs font-mono-tabular font-semibold text-sky-300">
                04. CLÔTURE & VERROUILLAGE DES ACTIONS (COMMENT FINIR)
              </div>
              <p className="text-base font-bold text-white">
                &ldquo;{liveSheet.closingActionEN}&rdquo;
              </p>
              <p className="text-xs text-slate-300">
                <strong>FR :</strong> {liveSheet.closingActionFR}
              </p>
              <p dir="rtl" lang="ar" className="text-xs font-arabic text-slate-200 text-right">
                {liveSheet.closingActionAR}
              </p>
            </div>

            {/* Critical Keywords Reminder & Personal Notes */}
            <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div>
                <strong className="text-slate-900">Mots-clés de contrôle : </strong>
                {liveSheet.criticalVocab.join(' · ')}
              </div>
              {liveSheet.personalNotesFR && (
                <div className="text-slate-500">
                  <strong>Note perso :</strong> {liveSheet.personalNotesFR}
                </div>
              )}
            </div>
          </div>

          {/* Saved Meeting Sheets History */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Mes Fiches de Réunion Sauvegardées ({savedSheets.length})
              </h3>
              <span className="text-xs text-slate-500">Archive opérationnelle</span>
            </div>

            {savedSheets.length === 0 ? (
              <p className="text-xs text-slate-500">
                Aucune fiche sauvegardée pour l’instant. Cliquez sur « Sauvegarder cette fiche de réunion » pour conserver vos préparations.
              </p>
            ) : (
              <div className="space-y-3">
                {savedSheets.map((sheet) => (
                  <div
                    key={sheet.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-sky-700" aria-hidden="true" />
                        <span>{sheet.templateTitle}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteSheet(sheet.id)}
                        aria-label={`Supprimer la fiche ${sheet.templateTitle}`}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="text-slate-500 font-mono-tabular">
                      Interlocuteur : {sheet.carrierOrTeamName} · Réf : {sheet.ticketReference} · Échéance : {sheet.targetDeadline}
                    </div>
                    <p className="text-slate-800 font-medium">
                      Ouverture : &ldquo;{sheet.openingEN}&rdquo;
                    </p>
                    <p className="text-slate-800 font-medium">
                      Clôture : &ldquo;{sheet.closingActionEN}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
