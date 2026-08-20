import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

type SpeechState = 'idle' | 'speaking' | 'unsupported';

let webSpeechSupported = false;
if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
  webSpeechSupported = true;
}

export function useSpeech() {
  const [state, setState] = useState<SpeechState>('idle');

  useEffect(() => {
    if (!webSpeechSupported) return;
    const synth = window.speechSynthesis;
    const handler = () => {
      setState(synth.speaking ? 'speaking' : 'idle');
    };
    synth.addEventListener('end', handler);
    synth.addEventListener('start', handler);
    return () => {
      synth.removeEventListener('end', handler);
      synth.removeEventListener('start', handler);
    };
  }, []);

  const speak = useCallback(
    (text: string, opts?: { rate?: number; pitch?: number }) => {
      if (!webSpeechSupported) {
        setState('unsupported');
        return;
      }
      const synth = window.speechSynthesis;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = opts?.rate ?? 0.9;
      utterance.pitch = opts?.pitch ?? 1.0;
      synth.speak(utterance);
      setState('speaking');
    },
    []
  );

  const stop = useCallback(() => {
    if (!webSpeechSupported) return;
    window.speechSynthesis.cancel();
    setState('idle');
  }, []);

  return { speak, stop, state, supported: webSpeechSupported };
}
