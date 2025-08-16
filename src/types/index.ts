export interface TOTPAccount {
  id: string;
  accountName: string;
  issuer: string;
  secret: string;
  createdAt: number;
}

export interface TOTPCode {
  code: string;
  remainingTime: number;
  totalTime: number;
}

export interface AddAccountData {
  accountName: string;
  issuer: string;
  secret: string;
}

export interface AppSettings {
  showSeconds: boolean;
}

export type AddAccountMethod = 'manual' | 'qr'; 