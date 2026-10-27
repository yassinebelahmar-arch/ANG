import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { WRITTEN_EXERCISES, WrittenExercise } from '../data/sdmData';
import { evaluateExerciseChoice } from '../utils/sdmEngine';

interface WrittenDrillsViewProps {
  completedExerciseIds: string[];
  onCompleteExercise: (id: string) => void;
  onResetExercises: () => void;
}

export const WrittenDrillsView: React.FC<WrittenDrillsViewProps> = ({
  completedExerciseIds,
  onCompleteExercise,
  onResetExercises,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [writtenDrafts, setWrittenDrafts] = useState<Record<string, string>>({});

  const handleSelectOption = (exercise: WrittenExercise, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [exercise.id]: optionId }));
    const evaluation = evaluateExerciseChoice(exercise, optionId);
    if (evaluation.isCorrect) {
      onCompleteExercise(exercise.id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-medium text-sky-700">
            Entraînement Écrit Actif (Zéro Audio · Ancrage Visuel EN · FR · AR)
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Sprints de Précision SDM : éliminez le « petit B2 » par l’écrit
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl">
            Pour chaque situation réelle de téléphonie IP ou mobile, observez le besoin en Français et en Arabe, repérez l’erreur B1/B2 typique, puis sélectionnez et recopiez la formulation exacte d’un SDM senior.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <div className="text-xs text-slate-500">Situations validées</div>
            <div className="text-xl font-bold font-mono-tabular text-slate-900">
              {completedExerciseIds.length} / {WRITTEN_EXERCISES.length}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedAnswers({});
              setWrittenDrafts({});
              onResetExercises();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Réinitialiser</span>
          </button>
        </div>
      </section>

      {/* Exercises List */}
      <div className="space-y-6">
        {WRITTEN_EXERCISES.map((ex, index) => {
          const chosenId = selectedAnswers[ex.id];
          const evaluation = chosenId ? evaluateExerciseChoice(ex, chosenId) : null;
          const isSolved = completedExerciseIds.includes(ex.id);
          const draftValue = writtenDrafts[ex.id] || '';

          return (
            <article
              key={ex.id}
              className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6"
            >
              {/* Top Meta */}
              <div className="flex items-center justify-between gap-4 text-xs text-slate-500 border-b border-slate-100 pb-3">
                <span className="font-mono-tabular font-semibold text-slate-900">
                  SITUATION 0{index + 1} · {ex.categoryLabel}
                </span>
                <span className={isSolved ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                  {isSolved ? '✓ Situation Maîtrisée' : 'À valider'}
                </span>
              </div>

              {/* Prompt in FR & AR + Weak Attempt */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="text-xs font-semibold text-slate-500">
                    Ce que vous voulez exprimer (Français & Arabe) :
                  </div>
                  <p className="text-sm font-medium text-slate-900">{ex.situationFR}</p>
                  <p dir="rtl" lang="ar" className="text-sm font-arabic text-slate-700 text-right">
                    {ex.situationAR}
                  </p>
                </div>

                <div className="p-4 bg-rose-50/50 rounded-lg border border-rose-200 space-y-2">
                  <div className="text-xs font-semibold text-rose-800">
                    Le piège du « petit B2 » (Traduction mot à mot à éviter) :
                  </div>
                  <p className="text-sm font-mono-tabular text-rose-900">{ex.weakAttemptEN}</p>
                  <p className="text-xs text-slate-600">
                    <strong>Objectif C1 FR :</strong> {ex.targetFrenchC1}
                  </p>
                </div>
              </div>

              {/* Multiple Choice Selection */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-slate-900">{ex.promptQuestion}</h2>
                <div className="space-y-2.5">
                  {ex.options.map((opt) => {
                    const isSelected = chosenId === opt.id;
                    let buttonStyle =
                      'bg-white border-slate-200 hover:bg-slate-50 text-slate-800';
                    if (isSelected && opt.isCorrect) {
                      buttonStyle = 'bg-emerald-50 border-emerald-600 text-slate-900';
                    } else if (isSelected && !opt.isCorrect) {
                      buttonStyle = 'bg-rose-50 border-rose-500 text-slate-900';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(ex, opt.id)}
                        className={`w-full text-left p-4 rounded-lg border transition-colors cursor-pointer flex items-start justify-between gap-4 ${buttonStyle}`}
                      >
                        <span className="text-sm font-medium">{opt.textEN}</span>
                        {isSelected && (
                          <span className="shrink-0 text-xs font-semibold">
                            {opt.isCorrect ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700">
                                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                                Correct
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-700">
                                <XCircle className="w-4 h-4" aria-hidden="true" />
                                À corriger
                              </span>
                            )}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trilingual Feedback */}
              {evaluation && (
                <div
                  className={`p-4 rounded-lg border space-y-2 text-sm ${
                    evaluation.isCorrect
                      ? 'bg-emerald-50/70 border-emerald-200 text-slate-900'
                      : 'bg-amber-50/70 border-amber-200 text-slate-900'
                  }`}
                >
                  <p className="font-semibold">
                    {evaluation.isCorrect ? '✓ Analyse SDM Validée :' : 'Pourquoi ce choix vous pénalise :'}
                  </p>
                  <p className="text-xs text-slate-700">{evaluation.explanationFR}</p>
                  <p dir="rtl" lang="ar" className="text-xs font-arabic text-slate-800 text-right">
                    {evaluation.explanationAR}
                  </p>
                </div>
              )}

              {/* Active Written Memory Box (Type to anchor in memory) */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <label
                  htmlFor={`write-${ex.id}`}
                  className="block text-xs font-semibold text-slate-700"
                >
                  Ancrage par l’écriture : réécrivez ici la phrase ou les mots-clés anglais pour les fixer dans votre mémoire
                </label>
                <input
                  id={`write-${ex.id}`}
                  type="text"
                  value={draftValue}
                  onChange={(e) =>
                    setWrittenDrafts((prev) => ({ ...prev, [ex.id]: e.target.value }))
                  }
                  placeholder="Tapez la tournure clé (ex: We are experiencing intermittent call drops and one-way audio...)"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
