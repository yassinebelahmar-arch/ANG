// English Speech Synthesis Utility (EN Only — FR and AR strictly have no audio per user specification)

export type SpeechSpeed = 1 | 0.82;
export type EnglishAccent = 'en-US' | 'en-GB';

let currentPlayingId: string | null = null;
const listeners = new Set<(playingId: string | null) => void>();

function notifyListeners(id: string | null) {
  currentPlayingId = id;
  listeners.forEach((cb) => cb(id));
}

export function subscribeToSpeechState(cb: (playingId: string | null) => void): () => void {
  listeners.add(cb);
  cb(currentPlayingId);
  return () => {
    listeners.delete(cb);
  };
}

export function stopEnglishSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  notifyListeners(null);
}

function pickBestEnglishVoice(preferredAccent: EnglishAccent): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Exact accent match with high-quality neural/natural voice names
  const exactHighQuality = voices.find(
    (v) =>
      v.lang.toLowerCase().startsWith(preferredAccent.toLowerCase()) &&
      /(natural|google|premium|enhanced|siri|daniel|samantha|alex|guy|aria|jenny)/i.test(v.name)
  );
  if (exactHighQuality) return exactHighQuality;

  // 2. Exact accent match
  const exactMatch = voices.find((v) =>
    v.lang.toLowerCase().startsWith(preferredAccent.toLowerCase())
  );
  if (exactMatch) return exactMatch;

  // 3. Any English voice
  const anyEnglish = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
  return anyEnglish || null;
}

export function speakEnglishText(
  text: string,
  playId: string,
  options?: { rate?: SpeechSpeed; accent?: EnglishAccent }
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  // If clicking the exact same item that is currently playing, toggle stop
  if (currentPlayingId === playId) {
    stopEnglishSpeech();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const accent = options?.accent ?? 'en-US';
  const rate = options?.rate ?? 1;

  utterance.lang = accent;
  utterance.rate = rate;
  utterance.pitch = 1;

  const voice = pickBestEnglishVoice(accent);
  if (voice) {
    utterance.voice = voice;
  }

  utterance.onstart = () => {
    notifyListeners(playId);
  };

  utterance.onend = () => {
    if (currentPlayingId === playId) {
      notifyListeners(null);
    }
  };

  utterance.onerror = () => {
    if (currentPlayingId === playId) {
      notifyListeners(null);
    }
  };

  notifyListeners(playId);
  window.speechSynthesis.speak(utterance);
}
