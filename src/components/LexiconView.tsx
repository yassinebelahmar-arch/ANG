import React, { useState } from 'react';
import { Check, Copy, Plus, Search, CheckCircle2 } from 'lucide-react';
import { DomainCategory, LexiconItem } from '../data/sdmData';
import { filterLexiconItems } from '../utils/sdmEngine';

interface LexiconViewProps {
  items: LexiconItem[];
  masteredIds: string[];
  onToggleMastered: (id: string) => void;
  onAddCustomItem: (newItem: LexiconItem) => void;
}

const CATEGORY_TABS: Array<{ id: DomainCategory; label: string }> = [
  { id: 'all', label: 'Tout le Périmètre' },
  { id: 'sip_voip', label: 'SIP & VoIP Fixe' },
  { id: 'mobile_fleet', label: 'Mobile & Flotte' },
  { id: 'porting_provisioning', label: 'Portabilité & SDA' },
  { id: 'sla_escalation', label: 'SLA & Escalade' },
];

export const LexiconView: React.FC<LexiconViewProps> = ({
  items,
  masteredIds,
  onToggleMastered,
  onAddCustomItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DomainCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyMastered, setOnlyMastered] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states for adding a custom trilingual SDM entry
  const [newCategory, setNewCategory] = useState<Exclude<DomainCategory, 'all'>>('sip_voip');
  const [newWeakEN, setNewWeakEN] = useState('');
  const [newPreciseEN, setNewPreciseEN] = useState('');
  const [newFrenchC1, setNewFrenchC1] = useState('');
  const [newArabic, setNewArabic] = useState('');
  const [newExampleEN, setNewExampleEN] = useState('');
  const [formError, setFormError] = useState('');

  const filteredItems = filterLexiconItems(
    items,
    selectedCategory,
    searchQuery,
    onlyMastered,
    masteredIds
  );

  const handleCopy = (id: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPreciseEN.trim() || !newFrenchC1.trim() || !newArabic.trim()) {
      setFormError('Veuillez renseigner au minimum les termes en Anglais, Français et Arabe.');
      return;
    }

    const categoryMap: Record<Exclude<DomainCategory, 'all'>, string> = {
      sip_voip: 'Téléphonie IP Fixe · SIP & VoIP',
      mobile_fleet: 'Téléphonie Mobile · Flotte, eSIM & Roaming',
      porting_provisioning: 'Portabilité & Déploiement (Fixe & Mobile)',
      sla_escalation: 'SLA, Escalade Opérateur & Gouvernance SDM',
    };

    const created: LexiconItem = {
      id: `lex-custom-${Date.now()}`,
      category: newCategory,
      categoryLabel: categoryMap[newCategory],
      weakEnglish: newWeakEN.trim() || 'Expression approximative à remplacer',
      preciseEnglish: newPreciseEN.trim(),
      pronunciationCue: 'Terme personnalisé SDM',
      frenchC1: newFrenchC1.trim(),
      arabicBridge: newArabic.trim(),
      contextExampleEN:
        newExampleEN.trim() || `We need to verify ${newPreciseEN.trim()} with the carrier team.`,
      contextExampleFR: `Terme métier : ${newFrenchC1.trim()}`,
      contextExampleAR: newArabic.trim(),
      grammarTip: 'Expression ajoutée à votre référentiel personnel trilingue.',
    };

    onAddCustomItem(created);
    setNewWeakEN('');
    setNewPreciseEN('');
    setNewFrenchC1('');
    setNewArabic('');
    setNewExampleEN('');
    setFormError('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-medium text-sky-700">
              Matrice de Remplacement Lexical (EN · FR · AR)
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Ne cherchez plus vos mots : remplacez le vocabulaire vague par le terme SDM exact
            </h1>
            <p className="text-sm text-slate-600">
              Chaque carte relie l’expression anglaise standard opérateur à son équivalent Français C1 et à son ancrage en Arabe.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>{showAddForm ? 'Fermer le formulaire' : 'Ajouter un terme trilingue'}</span>
            </button>
          </div>
        </div>

        {/* Add Custom Term Form */}
        {showAddForm && (
          <form
            onSubmit={handleCreateEntry}
            className="p-5 bg-slate-50 border border-slate-200 rounded-lg space-y-4"
          >
            <h2 className="text-sm font-bold text-slate-900">
              Ajouter une nouvelle expression à votre lexique trilingue SDM
            </h2>
            {formError && (
              <p role="alert" className="text-xs font-medium text-rose-700">
                {formError}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="custom-cat" className="block text-xs font-medium text-slate-700 mb-1">
                  Domaine Télécom
                </label>
                <select
                  id="custom-cat"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Exclude<DomainCategory, 'all'>)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
                >
                  <option value="sip_voip">SIP & VoIP Fixe</option>
                  <option value="mobile_fleet">Mobile & Flotte</option>
                  <option value="porting_provisioning">Portabilité & SDA</option>
                  <option value="sla_escalation">SLA & Escalade</option>
                </select>
              </div>

              <div>
                <label htmlFor="custom-weak" className="block text-xs font-medium text-slate-700 mb-1">
                  Mot approximatif à éviter (Optionnel)
                </label>
                <input
                  id="custom-weak"
                  type="text"
                  value={newWeakEN}
                  onChange={(e) => setNewWeakEN(e.target.value)}
                  placeholder="Ex: Change the SIM card"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div>
                <label htmlFor="custom-en" className="block text-xs font-medium text-slate-700 mb-1">
                  Terme Anglais SDM Exact *
                </label>
                <input
                  id="custom-en"
                  type="text"
                  value={newPreciseEN}
                  onChange={(e) => setNewPreciseEN(e.target.value)}
                  placeholder="Ex: Execute an urgent SIM swap"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div>
                <label htmlFor="custom-fr" className="block text-xs font-medium text-slate-700 mb-1">
                  Équivalent Français C1 *
                </label>
                <input
                  id="custom-fr"
                  type="text"
                  value={newFrenchC1}
                  onChange={(e) => setNewFrenchC1(e.target.value)}
                  placeholder="Ex: Exécuter un échange de carte SIM (SIM swap)"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div>
                <label htmlFor="custom-ar" className="block text-xs font-medium text-slate-700 mb-1">
                  Ancrage en Arabe (العربية) *
                </label>
                <input
                  id="custom-ar"
                  type="text"
                  dir="rtl"
                  value={newArabic}
                  onChange={(e) => setNewArabic(e.target.value)}
                  placeholder="مثال: استبدال شريحة الاتصال فوراً"
                  className="w-full px-3 py-2 text-sm font-arabic bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div>
                <label htmlFor="custom-ex" className="block text-xs font-medium text-slate-700 mb-1">
                  Phrase d’exemple en réunion (Optionnel)
                </label>
                <input
                  id="custom-ex"
                  type="text"
                  value={newExampleEN}
                  onChange={(e) => setNewExampleEN(e.target.value)}
                  placeholder="Ex: Please execute a SIM swap for this VIP line."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 rounded-md hover:bg-sky-800 cursor-pointer"
              >
                Enregistrer dans le lexique
              </button>
            </div>
          </form>
        )}

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-slate-100">
          {/* Interactive Segmented Category Tabs */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:w-80">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                aria-label="Rechercher en anglais, français ou arabe"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher (SIP, roaming, انقطاع...)"
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <button
              type="button"
              onClick={() => setOnlyMastered((prev) => !prev)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                onlyMastered
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {onlyMastered ? `Maîtrisés uniquement (${masteredIds.length})` : `Voir maîtrisés (${masteredIds.length})`}
            </button>
          </div>
        </div>
      </section>

      {/* Lexicon Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <p className="text-base font-semibold text-slate-900">
            Aucun terme ne correspond à votre filtre actuel.
          </p>
          <p className="text-sm text-slate-500">
            Réinitialisez la recherche ou changez de catégorie pour afficher l’ensemble du lexique trilingue.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setOnlyMastered(false);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredItems.map((item) => {
            const isMastered = masteredIds.includes(item.id);
            return (
              <article
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Unboxed Metadata Line */}
                  <div className="flex items-center justify-between gap-4 text-xs text-slate-500">
                    <span>{item.categoryLabel}</span>
                    <span className="font-mono-tabular text-slate-400">
                      Rythme : {item.pronunciationCue}
                    </span>
                  </div>

                  {/* Weak vs Precise Upgrade Box */}
                  <div className="space-y-2">
                    <div className="text-xs text-rose-700 line-through">
                      À éviter : &ldquo;{item.weakEnglish}&rdquo;
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {item.preciseEnglish}
                    </h2>
                  </div>

                  {/* Trilingual Bridge */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                    <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                      <div className="text-xs font-medium text-slate-500">
                        Pont Français (C1 Métier)
                      </div>
                      <p className="text-sm font-medium text-slate-900">
                        {item.frenchC1}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                      <div className="text-xs font-medium text-slate-500 text-right">
                        الربط الذهني بالعربية (Arabe)
                      </div>
                      <p
                        dir="rtl"
                        lang="ar"
                        className="text-sm font-arabic font-medium text-slate-900 text-right"
                      >
                        {item.arabicBridge}
                      </p>
                    </div>
                  </div>

                  {/* Full Sentence in Context (EN / FR / AR) */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-sm">
                    <div className="text-xs font-semibold text-sky-700">
                      Phrase prête à prononcer ou écrire en réunion :
                    </div>
                    <p className="font-medium text-slate-900">
                      &ldquo;{item.contextExampleEN}&rdquo;
                    </p>
                    <p className="text-xs text-slate-600">
                      <strong>FR :</strong> {item.contextExampleFR}
                    </p>
                    <p dir="rtl" lang="ar" className="text-xs font-arabic text-slate-600">
                      <strong>AR :</strong> {item.contextExampleAR}
                    </p>
                  </div>
                </div>

                {/* Footer: Grammar Rule & Actions */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <p className="text-xs text-slate-500">
                    <strong className="text-slate-700">Astuce structure :</strong> {item.grammarTip}
                  </p>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.contextExampleEN)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                          <span>Phrase copiée</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copier la phrase EN</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleMastered(item.id)}
                      aria-label={`Marquer "${item.preciseEnglish}" comme maîtrisé`}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isMastered
                          ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{isMastered ? 'Terme Maîtrisé ✓' : 'Marquer comme maîtrisé'}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
