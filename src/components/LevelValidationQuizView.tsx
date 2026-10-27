import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  Volume2,
  Square,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { TrackId, TRACKS_META } from '../data/curriculum50Sessions';
import { LEVEL_VALIDATION_QUIZZES, ValidationQuizQuestion } from '../data/levelValidationQuizzes';
import {
  speakEnglishText,
  stopEnglishSpeech,
  subscribeToSpeechState,
  SpeechSpeed,
  EnglishAccent
} from '../utils/speechAudio';

interface LevelValidationQuizViewProps {
  initialTrackId?: TrackId;
  validatedCertificates: Record<TrackId, { score: number; total: number; date: string } | null>;
  onSaveCertificate: (trackId: TrackId, score: number, total: number) => void;
  onJumpToTrackSessions: (trackId: TrackId) => void;
}

export const LevelValidationQuizView: React.FC<LevelValidationQuizViewProps> = ({
  initialTrackId = 'b1_b2',
  validatedCertificates,
  onSaveCertificate,
  onJumpToTrackSessions
}) => {
  const [selectedTrack, setSelectedTrack] = useState<TrackId>(initialTrackId);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [speechSpeed, setSpeechSpeed] = useState<SpeechSpeed>(1);
  const [accent, setAccent] = useState<EnglishAccent>('en-US');

  useEffect(() => {
    setSelectedTrack(initialTrackId);
  }, [initialTrackId]);

  useEffect(() => {
    const unsub = subscribeToSpeechState((id) => setPlayingId(id));
    return () => {
      unsub();
      stopEnglishSpeech();
    };
  }, []);

  const currentQuiz = LEVEL_VALIDATION_QUIZZES[selectedTrack];
  const questions = currentQuiz.questions;
  const totalQuestions = questions.length;
  const answeredCount = questions.filter((q) => selectedAnswers[q.id] !== undefined).length;

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const calculateScore = (): number => {
    return questions.reduce((acc, q) => {
      return selectedAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
    }, 0);
  };

  const handleSubmitExam = () => {
    const score = calculateScore();
    setSubmitted(true);
    const percent = Math.round((score / totalQuestions) * 100);
    if (percent >= currentQuiz.passingScorePercent) {
      onSaveCertificate(selectedTrack, score, totalQuestions);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetQuiz = () => {
    stopEnglishSpeech();
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const handleSwitchTrack = (trackId: TrackId) => {
    stopEnglishSpeech();
    setSelectedTrack(trackId);
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = calculateScore();
  const scorePercent = Math.round((score / totalQuestions) * 100);
  const isPassed = submitted && scorePercent >= currentQuiz.passingScorePercent;

  return (
    <div className="space-y-6">
      {/* Top Category Quiz Selector (3 Quizzes for the 3 Categories) */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
                Validation Officielle des Niveaux CECRL Pro
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Seuil de réussite : 80% (12/15)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5">
              3 Examens de Validation : B1 → B2+ · B2 → C1+ · C1+ → C2
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Testez vos connaissances sur les expressions professionnelles et obtenez votre certificat de niveau pour chaque palier du programme 90 Jours.
            </p>
          </div>

          {/* English Audio Controls */}
          <div className="flex flex-wrap items-center gap-2 bg-stone-50 px-3.5 py-2.5 rounded-lg border border-stone-200 shrink-0">
            <Volume2 className="w-4 h-4 text-teal-700" />
            <span className="text-xs font-semibold text-slate-700">Voix EN :</span>
            <button
              onClick={() => setAccent(accent === 'en-US' ? 'en-GB' : 'en-US')}
              className="px-2 py-1 text-xs font-mono font-semibold rounded bg-white border border-stone-300 text-slate-800 hover:bg-stone-100 cursor-pointer"
            >
              {accent === 'en-US' ? 'US (Américain)' : 'UK (Britannique)'}
            </button>
            <button
              onClick={() => setSpeechSpeed(speechSpeed === 1 ? 0.82 : 1)}
              className={`px-2 py-1 text-xs font-mono font-semibold rounded border cursor-pointer ${
                speechSpeed === 0.82
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-white border-stone-300 text-slate-800 hover:bg-stone-100'
              }`}
            >
              {speechSpeed === 1 ? 'Vitesse 1.0x' : 'Lent 0.85x'}
            </button>
          </div>
        </div>

        {/* 3 Track Quiz Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {(['b1_b2', 'b2_c1', 'c1_c2'] as TrackId[]).map((trackId) => {
            const meta = TRACKS_META[trackId];
            const quiz = LEVEL_VALIDATION_QUIZZES[trackId];
            const cert = validatedCertificates[trackId];
            const isActive = selectedTrack === trackId;

            return (
              <button
                key={trackId}
                onClick={() => handleSwitchTrack(trackId)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-stone-50/70 hover:bg-white text-slate-900 border-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-semibold ${
                        isActive
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : 'bg-white text-slate-700 border border-stone-200'
                      }`}
                    >
                      {quiz.badgeLabel}
                    </span>
                    {cert ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Validé ({cert.score}/{cert.total})
                      </span>
                    ) : (
                      <span
                        className={`text-[11px] font-mono ${
                          isActive ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        15 questions
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold mt-2.5">
                    Catégorie {meta.categoryNumber} : {meta.shortTitleFR}
                  </h3>
                  <p
                    className={`text-xs mt-1 ${
                      isActive ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    Basé sur les {meta.sessionCount} sessions ({meta.wordCount} mots · {meta.dayRangeLabel})
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/20 flex items-center justify-between text-xs font-semibold">
                  <span>{cert ? 'Repasser l’examen' : 'Passer l’examen de validation'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Exam Result & Certificate Banner (when submitted) */}
      {submitted && (
        <div
          className={`p-6 rounded-xl border shadow-sm ${
            isPassed
              ? 'bg-emerald-950 text-white border-emerald-700'
              : 'bg-amber-50 text-slate-900 border-amber-300'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-xs font-mono uppercase tracking-wider">
                {isPassed ? (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="text-emerald-200 font-bold">
                      NIVEAU OFFICIELLEMENT VALIDÉ · {currentQuiz.certificateLevelCode}
                    </span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 text-amber-800" />
                    <span className="text-amber-900 font-bold">
                      SCORE INSUFFISANT POUR LA CERTIFICATION (MINIMUM 80% REQUIS)
                    </span>
                  </>
                )}
              </div>

              <h3 className="text-2xl font-bold">
                {isPassed
                  ? currentQuiz.certificateTitleFR
                  : `Score obtenu : ${score} / ${totalQuestions} (${scorePercent}%)`}
              </h3>

              <p className={`text-sm ${isPassed ? 'text-emerald-100' : 'text-slate-700'}`}>
                {isPassed
                  ? `Félicitations ! Vous avez obtenu ${score}/${totalQuestions} (${scorePercent}%). Vous maîtrisez le lexique et les structures de phrases professionnelles de cette catégorie.`
                  : `Il vous faut au moins 12 bonnes réponses sur 15 (80%) pour valider ce palier. Consultez les explications trilingues ci-dessous puis réessayez.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div
                className={`px-5 py-3 rounded-xl text-center border ${
                  isPassed
                    ? 'bg-emerald-900/70 border-emerald-600 text-white'
                    : 'bg-white border-amber-300 text-slate-900'
                }`}
              >
                <div className="text-xs font-mono uppercase opacity-75">Score Final</div>
                <div className="text-2xl font-bold font-mono">
                  {score}/{totalQuestions} ({scorePercent}%)
                </div>
              </div>

              <button
                onClick={handleResetQuiz}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white text-slate-900 hover:bg-stone-100 font-semibold text-xs border border-stone-300 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Recommencer le Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Quiz Header Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{currentQuiz.titleFR}</h3>
          <p className="text-xs text-slate-600 mt-0.5">{currentQuiz.subtitleFR}</p>
          <p className="text-xs font-medium text-teal-800 mt-1" dir="rtl">
            {currentQuiz.titleAR}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onJumpToTrackSessions(selectedTrack)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-700" />
            Réviser les sessions
          </button>
          <div className="px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-mono font-semibold">
            Répondu : {answeredCount} / {totalQuestions}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q: ValidationQuizQuestion) => {
          const userChoice = selectedAnswers[q.id];
          const isAnswered = userChoice !== undefined;
          const isCorrect = submitted && userChoice === q.correctIndex;
          const isWrong = submitted && userChoice !== q.correctIndex;
          const playPromptId = `quiz-prompt-${q.id}`;
          const playFullId = `quiz-full-${q.id}`;

          return (
            <div
              key={q.id}
              className={`bg-white rounded-xl border p-5 transition-all ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-400 bg-emerald-50/20'
                    : 'border-rose-300 bg-rose-50/20'
                  : isAnswered
                  ? 'border-teal-500/60 shadow-2xs'
                  : 'border-stone-200'
              }`}
            >
              {/* Question Top Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-slate-900 text-white font-mono text-xs font-bold">
                    Question #{String(q.questionNumber).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-mono text-slate-500 bg-stone-100 px-2 py-0.5 rounded">
                    {q.sessionRef}
                  </span>
                </div>

                {/* Audio button for the full English sentence */}
                <button
                  onClick={() =>
                    speakEnglishText(q.fullSentenceEN, playPromptId, {
                      rate: speechSpeed,
                      accent
                    })
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                    playingId === playPromptId
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-200'
                  }`}
                  title="Écouter la phrase complète en anglais"
                >
                  {playingId === playPromptId ? (
                    <>
                      <Square className="w-3 h-3 fill-current" />
                      <span>Arrêter l’écoute (EN)</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Écouter la phrase (EN)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trilingual Context (FR + AR Situation) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3.5 p-3.5 rounded-lg bg-stone-50 border border-stone-200/80">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                    Situation Professionnelle (FR)
                  </span>
                  <p className="text-xs text-slate-800 font-medium mt-0.5">{q.scenarioFR}</p>
                  <p className="text-xs text-teal-800 font-semibold mt-1">
                    Sens recherché : « {q.targetWordFR} »
                  </p>
                </div>
                <div dir="rtl" className="border-t md:border-t-0 md:border-r border-stone-200 pt-2 md:pt-0 md:pr-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                    السياق المهني (AR)
                  </span>
                  <p className="text-xs text-slate-800 font-medium mt-0.5">{q.scenarioAR}</p>
                  <p className="text-xs text-teal-800 font-semibold mt-1">
                    المعنى المطلوب: « {q.targetWordAR} »
                  </p>
                </div>
              </div>

              {/* English Sentence with Blank */}
              <div className="p-3.5 rounded-lg bg-slate-900 text-white font-medium text-sm sm:text-base leading-relaxed">
                {q.promptEN}
              </div>

              {/* 4 English Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
                {q.optionsEN.map((opt, idx) => {
                  const isSelected = userChoice === idx;
                  const isRightAnswer = q.correctIndex === idx;

                  let btnStyle =
                    'bg-white hover:bg-stone-50 text-slate-800 border-stone-300';
                  if (!submitted && isSelected) {
                    btnStyle = 'bg-teal-700 text-white border-teal-700 shadow-xs';
                  } else if (submitted) {
                    if (isRightAnswer) {
                      btnStyle =
                        'bg-emerald-600 text-white border-emerald-600 font-bold';
                    } else if (isSelected && !isRightAnswer) {
                      btnStyle = 'bg-rose-600 text-white border-rose-600';
                    } else {
                      btnStyle = 'bg-stone-50 text-slate-400 border-stone-200';
                    }
                  }

                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between gap-2 p-3 rounded-lg border text-xs sm:text-sm transition-all ${btnStyle}`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectOption(q.id, idx)}
                        disabled={submitted}
                        className="flex-1 text-left flex items-center gap-2.5 cursor-pointer disabled:cursor-default"
                      >
                        <span className="w-6 h-6 rounded-md bg-black/15 font-mono text-xs flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-semibold">{opt}</span>
                      </button>

                      {/* Listen to this English option word */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakEnglishText(opt, `opt-${q.id}-${idx}`, {
                            rate: speechSpeed,
                            accent
                          });
                        }}
                        className="p-1.5 rounded hover:bg-black/10 transition-colors cursor-pointer shrink-0"
                        title={`Écouter "${opt}" en anglais`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Post-submission Trilingual Explanation */}
              {submitted && (
                <div
                  className={`mt-4 p-4 rounded-lg border text-xs space-y-2 ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50 border-amber-200 text-slate-900'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span className="text-emerald-900">
                            Bonne réponse : « {q.optionsEN[q.correctIndex]} »
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-700" />
                          <span className="text-rose-900">
                            Réponse attendue : « {q.optionsEN[q.correctIndex]} »
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        speakEnglishText(q.fullSentenceEN, playFullId, {
                          rate: speechSpeed,
                          accent
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 text-white font-semibold cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Réécouter la phrase complète (EN)</span>
                    </button>
                  </div>

                  <p className="font-mono text-xs bg-white/80 p-2.5 rounded border border-black/10 text-slate-900">
                    <strong>EN :</strong> {q.fullSentenceEN}
                  </p>
                  <p className="text-slate-800">
                    <strong>Explication (FR) :</strong> {q.explanationFR}
                  </p>
                  <p className="text-slate-800" dir="rtl">
                    <strong>الشرح (AR) :</strong> {q.explanationAR}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Exam Footer */}
      {!submitted && (
        <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold">
                Prêt à valider votre certificat {currentQuiz.certificateLevelCode} ?
              </h4>
              <p className="text-xs text-slate-300">
                Vous avez répondu à {answeredCount} question(s) sur {totalQuestions}. Un score de 12/15 (80%) valide officiellement ce niveau.
              </p>
            </div>
          </div>

          <button
            onClick={handleSubmitExam}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm transition-colors cursor-pointer shadow-md"
          >
            <ShieldCheck className="w-4 h-4" />
            Valider mes réponses & Calculer mon niveau
          </button>
        </div>
      )}
    </div>
  );
};
