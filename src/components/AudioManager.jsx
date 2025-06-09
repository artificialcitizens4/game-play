import { useEffect, useRef, useState } from 'react';
import { useUIState, useCurrentScreen, useAppDispatch } from '../hooks/useRedux';
import { toggleSound } from '../store/slices/uiSlice';

const AudioManager = () => {
  const uiState = useUIState();
  const currentScreen = useCurrentScreen();
  const dispatch = useAppDispatch();
  
  const backgroundMusicRef = useRef(null);
  const soundEffectsRef = useRef({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  // Audio context for better control
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Initialize audio context
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        // Create audio context
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        
        setIsInitialized(true);
      } catch (error) {
        console.warn('Audio context initialization failed:', error);
      }
    };

    initializeAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Create audio elements with Web Audio API integration
  const createAudioElement = (src, loop = false, volume = 0.5) => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.loop = loop;
    audio.volume = volume;
    
    // Create a more realistic military-style audio using oscillators and noise
    if (audioContextRef.current && gainNodeRef.current) {
      const source = audioContextRef.current.createMediaElementSource(audio);
      const filter = audioContextRef.current.createBiquadFilter();
      
      // Add some military radio-style filtering
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(8000, audioContextRef.current.currentTime);
      
      source.connect(filter);
      filter.connect(gainNodeRef.current);
    }
    
    return audio;
  };

  // Generate synthetic military-style background music
  const createSyntheticBackgroundMusic = () => {
    if (!audioContextRef.current) return null;

    const context = audioContextRef.current;
    let isPlaying = false;
    
    const playDrumPattern = () => {
      if (!isPlaying) return;
      
      // Create kick drum
      const kickOsc = context.createOscillator();
      const kickGain = context.createGain();
      const kickFilter = context.createBiquadFilter();
      
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(60, context.currentTime);
      kickOsc.frequency.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
      
      kickFilter.type = 'lowpass';
      kickFilter.frequency.setValueAtTime(100, context.currentTime);
      
      kickGain.gain.setValueAtTime(0.8, context.currentTime);
      kickGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
      
      kickOsc.connect(kickFilter);
      kickFilter.connect(kickGain);
      kickGain.connect(gainNodeRef.current);
      
      kickOsc.start(context.currentTime);
      kickOsc.stop(context.currentTime + 0.5);
      
      // Schedule next beat
      setTimeout(() => playDrumPattern(), 800);
    };

    const playAtmosphericPad = () => {
      if (!isPlaying) return;
      
      // Create atmospheric pad
      const osc1 = context.createOscillator();
      const osc2 = context.createOscillator();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();
      
      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(110, context.currentTime);
      osc2.frequency.setValueAtTime(220, context.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, context.currentTime);
      filter.Q.setValueAtTime(5, context.currentTime);
      
      gain.gain.setValueAtTime(0, context.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, context.currentTime + 2);
      gain.gain.linearRampToValueAtTime(0, context.currentTime + 8);
      
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(gainNodeRef.current);
      
      osc1.start(context.currentTime);
      osc2.start(context.currentTime);
      osc1.stop(context.currentTime + 8);
      osc2.stop(context.currentTime + 8);
      
      // Schedule next pad
      setTimeout(() => playAtmosphericPad(), 6000);
    };

    return {
      start: () => {
        isPlaying = true;
        playDrumPattern();
        playAtmosphericPad();
      },
      stop: () => {
        isPlaying = false;
      }
    };
  };

  // Create synthetic sound effects
  const createSyntheticSoundEffect = (type) => {
    if (!audioContextRef.current) return () => {};

    const context = audioContextRef.current;
    
    return () => {
      switch (type) {
        case 'button-click':
          // Military radio beep
          const beepOsc = context.createOscillator();
          const beepGain = context.createGain();
          
          beepOsc.type = 'square';
          beepOsc.frequency.setValueAtTime(800, context.currentTime);
          beepGain.gain.setValueAtTime(0.3, context.currentTime);
          beepGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
          
          beepOsc.connect(beepGain);
          beepGain.connect(gainNodeRef.current);
          
          beepOsc.start(context.currentTime);
          beepOsc.stop(context.currentTime + 0.1);
          break;

        case 'war-start':
          // Explosion-like sound
          const explosionNoise = context.createBufferSource();
          const explosionGain = context.createGain();
          const explosionFilter = context.createBiquadFilter();
          
          // Create noise buffer
          const bufferSize = context.sampleRate * 0.5;
          const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
          const data = buffer.getChannelData(0);
          
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          
          explosionNoise.buffer = buffer;
          explosionFilter.type = 'bandpass';
          explosionFilter.frequency.setValueAtTime(200, context.currentTime);
          explosionFilter.Q.setValueAtTime(10, context.currentTime);
          
          explosionGain.gain.setValueAtTime(0.5, context.currentTime);
          explosionGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
          
          explosionNoise.connect(explosionFilter);
          explosionFilter.connect(explosionGain);
          explosionGain.connect(gainNodeRef.current);
          
          explosionNoise.start(context.currentTime);
          explosionNoise.stop(context.currentTime + 0.5);
          break;

        case 'screen-transition':
          // Tactical swoosh
          const swooshOsc = context.createOscillator();
          const swooshGain = context.createGain();
          const swooshFilter = context.createBiquadFilter();
          
          swooshOsc.type = 'sawtooth';
          swooshOsc.frequency.setValueAtTime(400, context.currentTime);
          swooshOsc.frequency.exponentialRampToValueAtTime(100, context.currentTime + 0.3);
          
          swooshFilter.type = 'highpass';
          swooshFilter.frequency.setValueAtTime(200, context.currentTime);
          
          swooshGain.gain.setValueAtTime(0.2, context.currentTime);
          swooshGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
          
          swooshOsc.connect(swooshFilter);
          swooshFilter.connect(swooshGain);
          swooshGain.connect(gainNodeRef.current);
          
          swooshOsc.start(context.currentTime);
          swooshOsc.stop(context.currentTime + 0.3);
          break;

        case 'character-select':
          // Military confirmation beep
          const confirmOsc = context.createOscillator();
          const confirmGain = context.createGain();
          
          confirmOsc.type = 'triangle';
          confirmOsc.frequency.setValueAtTime(600, context.currentTime);
          confirmOsc.frequency.setValueAtTime(800, context.currentTime + 0.05);
          
          confirmGain.gain.setValueAtTime(0.2, context.currentTime);
          confirmGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.15);
          
          confirmOsc.connect(confirmGain);
          confirmGain.connect(gainNodeRef.current);
          
          confirmOsc.start(context.currentTime);
          confirmOsc.stop(context.currentTime + 0.15);
          break;

        case 'save-character':
          // Success chime
          const saveOsc1 = context.createOscillator();
          const saveOsc2 = context.createOscillator();
          const saveGain = context.createGain();
          
          saveOsc1.type = 'sine';
          saveOsc2.type = 'sine';
          saveOsc1.frequency.setValueAtTime(523, context.currentTime); // C5
          saveOsc2.frequency.setValueAtTime(659, context.currentTime); // E5
          
          saveGain.gain.setValueAtTime(0.15, context.currentTime);
          saveGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.4);
          
          saveOsc1.connect(saveGain);
          saveOsc2.connect(saveGain);
          saveGain.connect(gainNodeRef.current);
          
          saveOsc1.start(context.currentTime);
          saveOsc2.start(context.currentTime + 0.1);
          saveOsc1.stop(context.currentTime + 0.4);
          saveOsc2.stop(context.currentTime + 0.5);
          break;
      }
    };
  };

  // Initialize sound effects
  useEffect(() => {
    if (!isInitialized) return;

    soundEffectsRef.current = {
      buttonClick: createSyntheticSoundEffect('button-click'),
      warStart: createSyntheticSoundEffect('war-start'),
      screenTransition: createSyntheticSoundEffect('screen-transition'),
      characterSelect: createSyntheticSoundEffect('character-select'),
      saveCharacter: createSyntheticSoundEffect('save-character')
    };

    // Create background music
    backgroundMusicRef.current = createSyntheticBackgroundMusic();

  }, [isInitialized]);

  // Handle background music based on current screen
  useEffect(() => {
    if (!backgroundMusicRef.current || !uiState.soundEnabled) return;

    const musicScreens = ['main', 'select-experience', 'story', 'team-setup', 'build-teams', 'view-characters', 'war-summary'];
    
    if (musicScreens.includes(currentScreen)) {
      if (currentTrack !== 'background') {
        backgroundMusicRef.current.start();
        setCurrentTrack('background');
      }
    } else {
      if (currentTrack === 'background') {
        backgroundMusicRef.current.stop();
        setCurrentTrack(null);
      }
    }
  }, [currentScreen, uiState.soundEnabled, currentTrack]);

  // Global sound effect functions
  window.playWarSound = (soundType) => {
    if (!uiState.soundEnabled || !soundEffectsRef.current) return;
    
    const soundEffect = soundEffectsRef.current[soundType];
    if (soundEffect) {
      soundEffect();
    }
  };

  // Handle volume changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        uiState.soundEnabled ? 0.3 : 0, 
        audioContextRef.current?.currentTime || 0
      );
    }
  }, [uiState.soundEnabled]);

  // Resume audio context on user interaction (required by browsers)
  useEffect(() => {
    const resumeAudio = () => {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    document.addEventListener('click', resumeAudio, { once: true });
    document.addEventListener('keydown', resumeAudio, { once: true });

    return () => {
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('keydown', resumeAudio);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default AudioManager;