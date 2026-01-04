
export enum Language {
  ENGLISH = 'English',
  HINDI = 'Hindi',
  HINGLISH = 'Hinglish'
}

export enum Platform {
  REEL = 'Instagram Reel',
  SHORT = 'YouTube Short',
  YOUTUBE = 'YouTube Video',
  FILM = 'Short Film'
}

export enum Tone {
  CINEMATIC = 'Cinematic',
  EMOTIONAL = 'Emotional',
  RAW = 'Raw',
  MOTIVATIONAL = 'Motivational',
  DARK = 'Dark',
  SARCASTIC = 'Sarcastic'
}

export interface Scene {
  time: string;
  visual: string;
  script: string;
  camera: string;
}

export interface VideoBlueprint {
  title: string;
  hook: string;
  mainScript: string;
  visualBreakdown: Scene[];
  cameraGuidelines: string;
  moodAndColor: {
    vibe: string;
    lighting: string;
    palette: string[];
  };
  transitions: string[];
  musicDirection: string;
  endingCTA: string;
}

export interface UserInput {
  topic: string;
  language: Language;
  platform: Platform;
  duration: string;
  tone: Tone;
}
