import React, { useState } from 'react';
import { Bookmark, Check, Copy, Trash2 } from 'lucide-react';
import { SENTENCE_BLOCKS, SentenceBlock } from '../data/sdmData';
import { AssembledSentence, assembleTrilingualSentence } from '../utils/sdmEngine';

export interface SavedPhraseItem extends AssembledSentence {
  id: string;
  scenarioLabel: string;
}

interface SentenceBuilderViewProps {
  savedPhrases: SavedPhraseItem[];
  onSavePhrase: (phrase: SavedPhraseItem) => void;
  onRemovePhrase: (id: string) => void;
}

const SCENARIO_FILTERS: Array<{
  id: 'all' | SentenceBlock['scenario'];
  label: string;
}> = [
  { id: 'all', label: 'Tous les contextes' },
  { id: 'carrier_escalation', label: 'Escalade Opérateur (SIP / Outage)' },
  { id: 'porting_mobile', label: 'Portabilité & Flotte Mobile' },
  { id: 'team_sync', label: 'Point Équipe / NOC Interne' },
  { id: 'steering_committee', label: 'Comité de Pilotage / SLA' },
];

export const SentenceBuilderView: React.FC<SentenceBuilderViewProps> = ({
  savedPhrases,
  onSavePhrase,
  onRemovePhrase,
}) => {
  const [scenarioFilter, setScenarioFilter] = useState<'all' | SentenceBlock['scenario']>('all');

  const openings = SENTENCE_BLOCKS.filter(
    (b) => b.phase === 'opening' && (scenarioFilter === 'all' || b.scenario === scenarioFilter)
  );
  const cores = SENTENCE_BLOCKS.filter(
    (b) => b.phase === 'core' && (scenarioFilter === 'all' || b.scenario === scenarioFilter)
  );
  const closings = SENTENCE_BLOCKS.filter(
    (b) => b.phase === 'closing' && (scenarioFilter === 'all' || b.scenario === scenarioFilter)
  );

  const [selectedOpeningId, setSelectedOpeningId] = useState<string>('open-1');
  const [selectedCoreId, setSelectedCoreId] = useState<string>('core-1');
  const [selectedClosingId, setSelectedClosingId] = useState<string>('close-1');
  const [copiedLive, setCopiedLive] = useState(false);

  const activeOpening =
    SENTENCE_BLOCKS.find((b) => b.id === selectedOpeningId) || openings[0] || SENTENCE_BLOCKS[0];
  const activeCore =
    SENTENCE_BLOCKS.find((b) => b.id === selectedCoreId) || cores[0] || SENTENCE_BLOCKS[5];
  const activeClosing =
    SENTENCE_BLOCKS.find((b) => b.id === selectedClosingId) || closings[0] || SENTENCE_BLOCKS[10];

  const assembled = assembleTrilingualSentence(activeOpening, activeCore, activeClosing);

  const handleScenarioChange = (scen: 'all' | SentenceBlock['scenario']) => {
    setScenarioFilter(scen);
    if (scen !== 'all') {
      const firstOpen = SENTENCE_BLOCKS.find((b) => b.phase === 'opening' && b.scenario === scen);
      const firstCore = SENTENCE_BLOCKS.find((b) => b.phase === 'core' && b.scenario === scen);
      const firstClose = SENTENCE_BLOCKS.find((b) => b.phase === 'closing' && b.scenario === scen);
      if (firstOpen) setSelectedOpeningId(firstOpen.id);
      if (firstCore) setSelectedCoreId(firstCore.id);
      if (firstClose) setSelectedClosingId(firstClose.id);
    }
  };

  const handleCopyAssembled = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(assembled.english).catch(() => {});
    }
    setCopiedLive(true);
    setTimeout(() => setCopiedLive(false), 1800);
  };

  const handleSaveCurrent = () => {
    onSavePhrase({
      id: `phrase-${Date.now()}`,
      scenarioLabel: activeOpening.scenarioLabel,
      ...assembled,
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Explanation & Filter */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="space-y-1">
          <div className="text-xs font-medium text-sky-700">
            Méthodologie des 3 Briques (Comment commencer, expliquer et finir ses phrases)
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Assemblez votre prise de parole SDM en 3 clics (Anglais · Français · Arabe)
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl">
            Sélectionnez une <strong>Amorce (Bloc 1)</strong>, un <strong>Constat Technique (Bloc 2)</strong> et une <strong>Clôture d’Action (Bloc 3)</strong>. Vous visualisez immédiatement la phrase complète et sa logique dans les trois langues.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          {SCENARIO_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => handleScenarioChange(f.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                scenarioFilter === f.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Two-Zone Sandbox Layout: 3-Column Block Selector + Live Trilingual Output */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: The 3 Interactive Columns */}
        <div className="lg:col-span-7 space-y-6">
          {/* Block 1 Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono-tabular font-semibold text-slate-900">
                BLOC 01 · COMMENT COMMENCER LA PHRASE (AMORCE)
              </span>
              <span>{openings.length} options</span>
            </div>
            <div className="space-y-2">
              {openings.map((block) => {
                const active = block.id === activeOpening.id;
                return (
                  <button
                    key={block.id}
                    type="button"
                    onClick={() => setSelectedOpeningId(block.id)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-colors cursor-pointer space-y-1.5 ${
                      active
                        ? 'bg-sky-50/70 border-sky-600 text-slate-900'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs text-slate-500">
                      {block.scenarioLabel} · {block.intentFR}
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      {block.english} ...
                    </div>
                    <div className="text-xs text-slate-600">FR : {block.french} ...</div>
                    <div dir="rtl" lang="ar" className="text-xs font-arabic text-slate-600">
                      {block.arabic} ...
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Block 2 Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono-tabular font-semibold text-slate-900">
                BLOC 02 · EXPLIQUER LE CŒUR TECHNIQUE (CAUSE & IMPACT)
              </span>
              <span>{cores.length} options</span>
            </div>
            <div className="space-y-2">
              {cores.map((block) => {
                const active = block.id === activeCore.id;
                return (
                  <button
                    key={block.id}
                    type="button"
                    onClick={() => setSelectedCoreId(block.id)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-colors cursor-pointer space-y-1.5 ${
                      active
                        ? 'bg-sky-50/70 border-sky-600 text-slate-900'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs text-slate-500">
                      {block.scenarioLabel} · {block.intentFR}
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      ... {block.english} ...
                    </div>
                    <div className="text-xs text-slate-600">FR : ... {block.french} ...</div>
                    <div dir="rtl" lang="ar" className="text-xs font-arabic text-slate-600">
                      ... {block.arabic} ...
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Block 3 Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono-tabular font-semibold text-slate-900">
                BLOC 03 · COMMENT FINIR LA PHRASE (VERROUILLAGE & ÉCHÉANCE)
              </span>
              <span>{closings.length} options</span>
            </div>
            <div className="space-y-2">
              {closings.map((block) => {
                const active = block.id === activeClosing.id;
                return (
                  <button
                    key={block.id}
                    type="button"
                    onClick={() => setSelectedClosingId(block.id)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-colors cursor-pointer space-y-1.5 ${
                      active
                        ? 'bg-sky-50/70 border-sky-600 text-slate-900'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs text-slate-500">
                      {block.scenarioLabel} · {block.intentFR}
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      ... {block.english}
                    </div>
                    <div className="text-xs text-slate-600">FR : ... {block.french}</div>
                    <div dir="rtl" lang="ar" className="text-xs font-arabic text-slate-600">
                      ... {block.arabic}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Live Assembled Trilingual Intervention Deck */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-6">
          <div className="bg-slate-900 text-white rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="text-xs text-sky-300 font-medium">
                  Intervention Assemblée (Prête à lire)
                </div>
                <h2 className="text-lg font-bold text-white">
                  Résultat Trilingue Synchronisé
                </h2>
              </div>
              <div className="text-right font-mono-tabular text-xs text-slate-300">
                <div>{assembled.wordCountEN} mots EN</div>
                <div>~{assembled.speakingSecondsEstimate} sec à l’oral</div>
              </div>
            </div>

            {/* 1. Target English */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-sky-300">
                1. Anglais Professionnel SDM (Ce que vous dites / écrivez)
              </div>
              <p
                data-testid="assembled-english-sentence"
                className="text-base sm:text-lg font-semibold text-white leading-relaxed bg-slate-800/90 border border-slate-700 p-4 rounded-lg"
              >
                &ldquo;{assembled.english}&rdquo;
              </p>
            </div>

            {/* 2. French C1 Bridge */}
            <div className="space-y-1.5">
              <div className="text-xs font-medium text-slate-300">
                2. Équivalent Français C1 (Sens exact métier)
              </div>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-800/60 border border-slate-800 p-3.5 rounded-lg">
                {assembled.french}
              </p>
            </div>

            {/* 3. Arabic Native Bridge */}
            <div className="space-y-1.5">
              <div className="text-xs font-medium text-slate-300 text-right">
                3. المعنى الكامل بالعربية (Ancrage Natal Arabe)
              </div>
              <p
                dir="rtl"
                lang="ar"
                className="text-base font-arabic text-slate-100 leading-relaxed bg-slate-800/60 border border-slate-800 p-3.5 rounded-lg text-right"
              >
                {assembled.arabic}
              </p>
            </div>

            {/* Structural Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
              <div className="font-semibold text-white">
                Pourquoi cette phrase fonctionne sans accroc :
              </div>
              <ul className="space-y-1.5 list-disc list-inside">
                {assembled.structureNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyAssembled}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copiedLive ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    <span>Phrase copiée !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" aria-hidden="true" />
                    <span>Copier la phrase Anglaise</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSaveCurrent}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Bookmark className="w-4 h-4" aria-hidden="true" />
                <span>Garder dans mon carnet</span>
              </button>
            </div>
          </div>

          {/* Saved Phrases Notebook */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Mon Carnet de Phrases SDM ({savedPhrases.length})
              </h3>
              <span className="text-xs text-slate-500">Prêtes pour vos appels</span>
            </div>

            {savedPhrases.length === 0 ? (
              <p className="text-xs text-slate-500">
                Cliquez sur « Garder dans mon carnet » pour enregistrer vos meilleures phrases trilingues ici.
              </p>
            ) : (
              <div className="space-y-3">
                {savedPhrases.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between text-slate-500">
                      <span>{item.scenarioLabel}</span>
                      <button
                        type="button"
                        onClick={() => onRemovePhrase(item.id)}
                        aria-label={`Supprimer la phrase ${item.scenarioLabel}`}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">
                      &ldquo;{item.english}&rdquo;
                    </p>
                    <p className="text-slate-600">FR : {item.french}</p>
                    <p dir="rtl" lang="ar" className="font-arabic text-slate-600">
                      {item.arabic}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
