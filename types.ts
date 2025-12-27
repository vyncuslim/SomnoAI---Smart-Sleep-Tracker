
export enum SleepStage {
  DEEP = '深睡',
  REM = 'REM',
  LIGHT = '浅睡',
  AWAKE = '清醒'
}

export interface Alarm {
  id: string;
  time: string;
  days: string[];
  enabled: boolean;
  smartWake: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  isPremium: boolean;
  fitConnected: boolean;
}

export interface SleepRecord {
  id: string;
  date: string;
  score: number;
  durationHours: number;
  stages: {
    deep: number;
    rem: number;
    light: number;
    awake: number;
  };
  heartRate: {
    avg: number;
    min: number;
    max: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type ViewType = 'dashboard' | 'insights' | 'assistant' | 'profile' | 'alarms' | 'auth' | 'notifications' | 'settings';
