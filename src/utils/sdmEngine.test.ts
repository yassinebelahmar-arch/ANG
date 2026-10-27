import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_50_SESSIONS,
  ALL_1500_WORDS,
  SESSIONS_B1_TO_B2,
  SESSIONS_C1_TO_C2,
  ALL_95_SESSIONS,
  ALL_2850_WORDS,
} from '../data/curriculum50Sessions';
import { LEVEL_VALIDATION_QUIZZES } from '../data/levelValidationQuizzes';
import {
  calculateCurriculumProgress,
  evaluateWrittenWordRecall,
  filterSessionsByPalier,
  filterSessionWords,
  searchGlobal1500Words,
  searchGlobalTrackWords,
} from './sdmEngine';

describe('95-Session / 2,850-Word Trilingual Accelerated Program (B1->B2+ · B2->C1+ · C1+->C2)', () => {
  it('contains 25 sessions in B1->B2+ (750 words), 50 sessions in B2->C1+ (1,500 words), and 20 sessions in C1+->C2 (600 words)', () => {
    assert.equal(SESSIONS_B1_TO_B2.length, 25);
    assert.equal(ALL_50_SESSIONS.length, 50);
    assert.equal(SESSIONS_C1_TO_C2.length, 20);
    assert.equal(ALL_95_SESSIONS.length, 95);
    assert.equal(ALL_2850_WORDS.length, 2850);
    assert.equal(ALL_1500_WORDS.length, 1500);
  });

  it('assigns continuous accelerated day numbers from Day 1 to Day 95 (1 Session = 1 Day)', () => {
    assert.equal(SESSIONS_B1_TO_B2[0].dayNumber, 1);
    assert.equal(SESSIONS_B1_TO_B2[24].dayNumber, 25);
    assert.equal(ALL_50_SESSIONS[0].dayNumber, 26);
    assert.equal(ALL_50_SESSIONS[49].dayNumber, 75);
    assert.equal(SESSIONS_C1_TO_C2[0].dayNumber, 76);
    assert.equal(SESSIONS_C1_TO_C2[19].dayNumber, 95);
  });

  it('contains exactly 30 words and 30 complete trilingual sentences in every single session across all 95 sessions', () => {
    for (const session of ALL_95_SESSIONS) {
      assert.equal(
        session.words.length,
        30,
        `Session ${session.id} (Day ${session.dayNumber}) should have 30 words`
      );
      for (const word of session.words) {
        assert.ok(word.wordEN.length > 0, `Missing wordEN in ${word.id}`);
        assert.ok(word.wordFR.length > 0, `Missing wordFR in ${word.id}`);
        assert.ok(word.wordAR.length > 0, `Missing wordAR in ${word.id}`);
        assert.ok(word.sentenceEN.length > 20, `Short sentenceEN in ${word.id}`);
        assert.ok(word.sentenceFR.length > 20, `Short sentenceFR in ${word.id}`);
        assert.ok(word.sentenceAR.length > 15, `Short sentenceAR in ${word.id}`);
      }
    }
  });

  it('progresses across 4 paliers in each track and searches across all 2,850 words', () => {
    const p1 = filterSessionsByPalier(ALL_50_SESSIONS, 1);
    const p2 = filterSessionsByPalier(ALL_50_SESSIONS, 2);
    const p3 = filterSessionsByPalier(ALL_50_SESSIONS, 3);
    const p4 = filterSessionsByPalier(ALL_50_SESSIONS, 4);

    assert.equal(p1.length, 12);
    assert.equal(p2.length, 13);
    assert.equal(p3.length, 13);
    assert.equal(p4.length, 12);

    const s1Words = ALL_50_SESSIONS[0].words;
    const filteredAgenda = filterSessionWords(s1Words, 'agenda');
    assert.ok(filteredAgenda.length >= 1);

    const globalArabicResults = searchGlobal1500Words('جدول الأعمال');
    assert.ok(globalArabicResults.length >= 1);

    const allTrackResults = searchGlobalTrackWords('err on the side of caution', 'all');
    assert.ok(allTrackResults.length >= 1);
  });

  it('validates the 3 official Level Validation Quizzes (B1->B2+, B2->C1+, C1+->C2)', () => {
    assert.equal(LEVEL_VALIDATION_QUIZZES.b1_b2.questions.length, 15);
    assert.equal(LEVEL_VALIDATION_QUIZZES.b2_c1.questions.length, 15);
    assert.equal(LEVEL_VALIDATION_QUIZZES.c1_c2.questions.length, 15);

    const s1WordIds = ALL_50_SESSIONS[0].words.map((w) => w.id);
    const progress = calculateCurriculumProgress(s1WordIds);
    assert.equal(progress.completedSessionsCount, 1);
    assert.equal(progress.masteredWordsCount, 30);

    const recall1 = evaluateWrittenWordRecall('To align on', 'align on');
    assert.equal(recall1.isMatch, true);
  });
});
