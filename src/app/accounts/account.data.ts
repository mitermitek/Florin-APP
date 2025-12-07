export interface AccountData {
  id: number;
  name: string;
  startingBalance: number | null;
}

export interface CreateAccountData {
  name: string;
  startingBalance: number | null;
}
