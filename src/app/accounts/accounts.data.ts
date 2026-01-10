export interface Account {
  id: number;
  name: string;
  startingBalance?: number;
}

export interface AccountRequest {
  name: string;
  startingBalance?: number;
}
