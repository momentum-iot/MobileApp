export enum CheckStatus {
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}

export interface Check {
  id: string;
  userId: number;
  checkInTime: string;
  checkOutTime?: string;
  status: CheckStatus;
}



