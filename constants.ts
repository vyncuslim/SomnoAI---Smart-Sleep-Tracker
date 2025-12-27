
import { SleepRecord } from './types';

export const MOCK_SLEEP_DATA: SleepRecord[] = [
  {
    id: '1',
    date: '2023-10-20',
    score: 85,
    durationHours: 7.5,
    stages: { deep: 20, rem: 25, light: 45, awake: 10 },
    heartRate: { avg: 58, min: 48, max: 72 }
  },
  {
    id: '2',
    date: '2023-10-21',
    score: 72,
    durationHours: 6.2,
    stages: { deep: 15, rem: 20, light: 55, awake: 10 },
    heartRate: { avg: 62, min: 52, max: 80 }
  },
  {
    id: '3',
    date: '2023-10-22',
    score: 91,
    durationHours: 8.1,
    stages: { deep: 25, rem: 30, light: 40, awake: 5 },
    heartRate: { avg: 56, min: 45, max: 68 }
  },
  {
    id: '4',
    date: '2023-10-23',
    score: 78,
    durationHours: 6.8,
    stages: { deep: 18, rem: 22, light: 50, awake: 10 },
    heartRate: { avg: 60, min: 50, max: 75 }
  },
  {
    id: '5',
    date: '2023-10-24',
    score: 88,
    durationHours: 7.8,
    stages: { deep: 22, rem: 26, light: 45, awake: 7 },
    heartRate: { avg: 57, min: 47, max: 70 }
  },
  {
    id: '6',
    date: '2023-10-25',
    score: 65,
    durationHours: 5.5,
    stages: { deep: 10, rem: 15, light: 60, awake: 15 },
    heartRate: { avg: 65, min: 55, max: 85 }
  },
  {
    id: '7',
    date: '2023-10-26',
    score: 82,
    durationHours: 7.2,
    stages: { deep: 19, rem: 24, light: 48, awake: 9 },
    heartRate: { avg: 59, min: 49, max: 74 }
  }
];

export const COLORS = {
  deep: '#3b82f6', // blue-500
  rem: '#8b5cf6',  // purple-500
  light: '#06b6d4', // cyan-500
  awake: '#facc15', // yellow-400
  scoreGood: '#10b981', // emerald-500
  scoreOk: '#f59e0b', // amber-500
  scoreBad: '#ef4444' // red-500
};
