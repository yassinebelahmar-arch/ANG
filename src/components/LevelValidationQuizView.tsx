import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Volume2,
  Square,
  RotateCcw,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { TrackId, TRACKS_META } from '../data/curriculum50Sessions';
import { LEVEL_VALIDATION_QUIZZES, ValidationQuizQuestion } from '../data/levelValidationQuizzes';
import {
  speakEnglishText,
  stopEnglishSpeech,
  subscribeToSpeechState,
  SpeechSpeed,
  EnglishAccent,
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
  onJumpToTrackSessions,
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
      [questionId]: optionIdx,
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
    <div className="space-y-8">
      {/* Top Category Quiz Selector (3 Official Level Exams) */}
      <div className="border-b-2 border-stone-900 pb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-stone-300">
          <div>
            <div className="text-xs font-mono-tabular uppercase tracking-widest text-[#9A3412] font-semibold">
              Validation Officielle des Niveaux CECRL · Seuil de réussite : 80% (12/15)
            </div>
            <h1 className="font-serif-editorial text-3xl sm:text-4xl text-stone-950 mt-1.5">
              Examens de Validation : B1 → B2+ · B2 → C1+ · C1+ → C2
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Validez vos acquis sur chacun des 3 volumes du programme 90 Jours avec écoute audio en anglais et corrections trilingues détaillées.
            </p>
          </div>

          {/* English Audio Controls */}
          <div className="inline-flex items-center border border-stone-400 bg-white px-3 py-2 text-xs gap-2 shrink-0 self-start lg:self-auto">
            <Volume2 className="w-3.5 h-3.5 text-[#9A3412]" />
            <span className="text-stone-600">Prononciation EN :</span>
            <button
              onClick={() => setAccent(accent === 'en-US' ? 'en-GB' : 'en-US')}
              className="font-mono-tabular font-bold text-stone-950 underline cursor-pointer"
            >
              {accent === 'en-US' ? 'US' : 'UK'}
            </button>
            <span className="text-stone-300">|</span>
            <button
              onClick={() => setSpeechSpeed(speechSpeed === 1 ? 0.82 : 1)}
              className="font-mono-tabular font-bold text-stone-950 underline cursor-pointer"
            >
              {speechSpeed === 1 ? '1.0x' : '0.85x Lent'}
            </button>
          </div>
        </div>

        {/* 3 Track Quiz Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-300 pt-6">
          {(['b1_b2', 'b2_c1', 'c1_c2'] as TrackId[]).map((trackId, index) => {
            const meta = TRACKS_META[trackId];
            const quiz = LEVEL_VALIDATION_QUIZZES[trackId];
            const cert = validatedCertificates[trackId];
            const isActive = selectedTrack === trackId;

            return (
              <button
                key={trackId}
                onClick={() => handleSwitchTrack(trackId)}
                className={`text-left p-5 transition-colors cursor-pointer flex flex-col justify-between ${
                  index === 0 ? 'md:pr-6' : index === 1 ? 'md:px-6' : 'md:pl-6'
                } ${
                  isActive
                    ? 'bg-white border-t-4 border-t-[#9A3412] shadow-2xs'
                    : 'hover:bg-white/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs font-mono-tabular">
                    <span className={isActive ? 'text-[#9A3412] font-bold' : 'text-stone-500 font-semibold'}>
                      {quiz.badgeLabel}
                    </span>
                    {cert ? (
                      <span className="text-[#14532D] font-bold">
                        ✓ Validé ({cert.score}/{cert.total})
                      </span>
                    ) : (
                      <span className="text-stone-500">15 questions</span>
                    )}
                  </div>
                  <h2 className="font-serif-editorial text-xl font-semibold text-stone-950 mt-2">
                    {meta.shortTitleFR}
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    {meta.sessionCount} sessions · {meta.wordCount} mots · {meta.dayRangeLabel}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-xs font-semibold text-[#9A3412]">
                  <span>{cert ? 'Repasser l’examen' : 'Sélectionner cet examen'}</span>
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
          className={`p-6 sm:p-8 border-2 ${
            isPassed
              ? 'bg-[#F2F6F3] text-stone-950 border-[#14532D]'
              : 'bg-white text-stone-950 border-[#9A3412]'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="text-xs font-mono-tabular uppercase tracking-widest">
                {isPassed ? (
                  <span className="text-[#14532D] font-bold">
                    ✓ Certificat Officiellement Validé · {currentQuiz.certificateLevelCode}
                  </span>
                ) : (
                  <span className="text-[#9A3412] font-bold">
                    Score insuffisant pour la certification (Minimum 80% requis)
                  </span>
                )}
              </div>

              <h3 className="font-serif-editorial text-2xl font-bold">
                {isPassed
                  ? currentQuiz.certificateTitleFR
                  : `Score obtenu : ${score} / ${totalQuestions} (${scorePercent}%)`}
              </h3>

              <p className="text-sm text-stone-700">
                {isPassed
                  ? `Félicitations ! Vous avez obtenu ${score}/${totalQuestions} (${scorePercent}%). Votre certificat de niveau est enregistré.`
                  : `Il vous faut au moins 12 bonnes réponses sur 15 (80%) pour valider ce palier. Consultez les explications ci-dessous puis réessayez.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="px-5 py-3 bg-white border border-stone-300 text-center">
                <div className="text-xs font-mono-tabular text-stone-500">Score Final</div>
                <div className="font-serif-editorial text-2xl font-bold font-mono-tabular">
                  {score}/{totalQuestions} ({scorePercent}%)
                </div>
              </div>

              <button
                onClick={handleResetQuiz}
                className="inline-flex items-center gap-2 px-4 py-3 bg-stone-900 text-white hover:bg-stone-800 font-semibold text-xs cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Recommencer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Quiz Header Bar */}
      <div className="bg-white border border-stone-300 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-editorial text-2xl text-stone-950">{currentQuiz.titleFR}</h2>
          <p className="text-xs text-stone-600 mt-1">{currentQuiz.subtitleFR}</p>
          <p className="text-xs font-medium text-[#14532D] font-arabic mt-1" dir="rtl">
            {currentQuiz.titleAR}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onJumpToTrackSessions(selectedTrack)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-stone-300 bg-[#F6F3EC] hover:border-stone-900 text-xs font-semibold text-stone-800 cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#9A3412]" />
            <span>Réviser les sessions</span>
          </button>
          <div className="px-4 py-2 bg-stone-900 text-white text-xs font-mono-tabular font-semibold whitespace-nowrap">
            Répondu : {answeredCount} / {totalQuestions}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white border border-stone-300 divide-y divide-stone-200">
        {questions.map((q: ValidationQuizQuestion) => {
          const userChoice = selectedAnswers[q.id];
          const isCorrect = submitted && userChoice === q.correctIndex;
          const playPromptId = `quiz-prompt-${q.id}`;
          const playFullId = `quiz-full-${q.id}`;

          return (
            <div key={q.id} className="p-6 space-y-4">
              {/* Question Top Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-mono-tabular text-stone-500">
                  <span className="font-serif-editorial text-base font-bold text-[#9A3412]">
                    {String(q.questionNumber).padStart(2, '0')}.
                  </span>
                  <span className="font-bold text-stone-900">
                    Question {q.questionNumber} sur {totalQuestions}
                  </span>
                  <span>·</span>
                  <span>{q.sessionRef}</span>
                </div>

                <button
                  onClick={() =>
                    speakEnglishText(q.fullSentenceEN, playPromptId, {
                      rate: speechSpeed,
                      accent,
                    })
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1 border text-xs font-semibold transition-colors cursor-pointer ${
                    playingId === playPromptId
                      ? 'bg-[#9A3412] text-white border-[#9A3412]'
                      : 'bg-[#F6F3EC] hover:bg-stone-200 text-stone-900 border-stone-300'
                  }`}
                >
                  {playingId === playPromptId ? (
                    <>
                      <Square className="w-3 h-3 fill-current" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#9A3412]" />
                      <span>Écouter la phrase (EN)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trilingual Context (FR + AR Situation) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-3 px-4 bg-[#F6F3EC] border border-stone-200">
                <div>
                  <span className="text-[11px] font-mono-tabular uppercase text-stone-500 block">
                    Situation professionnelle (FR)
                  </span>
                  <p className="text-xs text-stone-800 mt-0.5 leading-relaxed">
                    {q.scenarioFR}
                  </p>
                  <p className="text-xs text-[#9A3412] font-semibold mt-1">
                    Sens recherché : « {q.targetWordFR} »
                  </p>
                </div>
                <div
                  dir="rtl"
                  className="border-t md:border-t-0 md:border-r border-stone-300 pt-3 md:pt-0 md:pr-5 font-arabic"
                >
                  <span className="text-[11px] font-mono-tabular text-stone-500 block">
                    السياق المهني (AR)
                  </span>
                  <p className="text-xs text-stone-800 mt-0.5 leading-relaxed">
                    {q.scenarioAR}
                  </p>
                  <p className="text-xs text-[#14532D] font-bold mt-1">
                    المعنى المطلوب: « {q.targetWordAR} »
                  </p>
                </div>
              </div>

              {/* English Sentence with Blank */}
              <div className="p-4 bg-stone-900 text-[#F6F3EC] font-serif-editorial text-base sm:text-lg leading-relaxed">
                {q.promptEN}
              </div>

              {/* 4 English Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.optionsEN.map((opt, idx) => {
                  const isSelected = userChoice === idx;
                  const isRightAnswer = q.correctIndex === idx;

                  let btnStyle =
                    'bg-white hover:bg-[#F6F3EC] text-stone-900 border-stone-300';
                  if (!submitted && isSelected) {
                    btnStyle = 'bg-stone-900 text-white border-stone-900';
                  } else if (submitted) {
                    if (isRightAnswer) {
                      btnStyle = 'bg-[#14532D] text-white border-[#14532D] font-bold';
                    } else if (isSelected && !isRightAnswer) {
                      btnStyle = 'bg-[#9A3412] text-white border-[#9A3412]';
                    } else {
                      btnStyle = 'bg-stone-50 text-stone-400 border-stone-200';
                    }
                  }

                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between gap-2 p-3 border text-xs sm:text-sm transition-colors ${btnStyle}`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectOption(q.id, idx)}
                        disabled={submitted}
                        className="flex-1 text-left flex items-center gap-3 cursor-pointer disabled:cursor-default"
                      >
                        <span className="font-mono-tabular text-xs font-bold">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span className="font-semibold">{opt}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakEnglishText(opt, `opt-${q.id}-${idx}`, {
                            rate: speechSpeed,
                            accent,
                          });
                        }}
                        className="p-1.5 hover:opacity-75 transition-opacity cursor-pointer shrink-0"
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
                  className={`p-4 border text-xs space-y-2 ${
                    isCorrect
                      ? 'bg-[#F2F6F3] border-[#14532D] text-stone-900'
                      : 'bg-[#FAF5F0] border-[#9A3412] text-stone-900'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#14532D]" />
                          <span className="text-[#14532D]">
                            Bonne réponse : « {q.optionsEN[q.correctIndex]} »
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-[#9A3412]" />
                          <span className="text-[#9A3412]">
                            Réponse attendue : « {q.optionsEN[q.correctIndex]} »
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        speakEnglishText(q.fullSentenceEN, playFullId, {
                          rate: speechSpeed,
                          accent,
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-900 text-white font-semibold cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Réécouter la phrase (EN)</span>
                    </button>
                  </div>

                  <p className="font-medium text-xs text-stone-900 pt-1">
                    <strong>Phrase complète (EN) :</strong> “{q.fullSentenceEN}”
                  </p>
                  <p className="text-stone-700">
                    <strong>Explication (FR) :</strong> {q.explanationFR}
                  </p>
                  <p className="text-stone-800 font-arabic" dir="rtl">
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
        <div className="bg-stone-900 text-[#F6F3EC] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-serif-editorial text-lg">
              Validation du Certificat {currentQuiz.certificateLevelCode}
            </h4>
            <p className="text-xs text-stone-300 mt-0.5">
              Vous avez répondu à {answeredCount} question(s) sur {totalQuestions}. Un score de 12/15 (80%) valide officiellement ce niveau.
            </p>
          </div>

          <button
            onClick={handleSubmitExam}
            className="w-full sm:w-auto px-6 py-3 bg-[#9A3412] hover:bg-[#7C2D12] text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
          >
            Valider mes réponses & Calculer mon niveau
          </button>
        </div>
      )}
    </div>
  );
};
