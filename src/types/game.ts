
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
  finishedAt?: Date;
}

export interface GameSetup {
  teamA: Team;
  teamB: Team;
}

export interface DatabaseGame {
  id: string;
  user_id: string;
  team_a_name: string;
  team_b_name: string;
  team_a_players: string[];
  team_b_players: string[];
  status: 'active' | 'completed';
  winner?: string;
  final_score_team_a?: number;
  final_score_team_b?: number;
  created_at: string;
  finished_at?: string;
}

export interface DatabaseRound {
  id: string;
  game_id: string;
  round_number: number;
  team_a_bid: number;
  team_a_won: number;
  team_a_bags: number;
  team_a_score: number;
  team_b_bid: number;
  team_b_won: number;
  team_b_bags: number;
  team_b_score: number;
}
