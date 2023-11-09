export interface WordleStat {
  games: WordleStatGame[];
}

export interface WordleStatGame {
  date: number;
  won: boolean;
  nbAttempts: number;
}
