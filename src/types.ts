export type PassStatus = 'ACTIVE' | 'REDEEMED' | 'DENIED' | 'EXPIRED';

export interface HistoryItem {
  id: string;
  passId: string;
  time: string;
  date: string;
  result: string;
  bac: number;
  status: PassStatus;
}

export type Screen = 'DASHBOARD' | 'VERIFY' | 'SUCCESS' | 'HISTORY' | 'SETTINGS';
