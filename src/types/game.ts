
export interface Team {
  name: string;
  players: string[];
}

export interface RoundData {
  bid: number;
  won: number;
  bags: number;
  score: number;
}

export interface Round {
  round: number;
  teamA: RoundData;
  teamB: RoundData;
}

export interface Game {
  id: string;
  teamA: Team;
  teamB: Team;
  rounds: Round[];
  status: 'active' | 'completed';
  winner?: string;
  finalScores?: { teamA: number; teamB: number };
  createdAt: Date;
}

export interface GameSetup {
  teamA: Team;
  teamB: Team;
}
