
export interface Team {
  id: string;
  name: string;
  players: string[];
  teamNumber: number;
  themeId?: string;
}

export interface RoundData {
  bid: number;
  won: number;
  bags: number;
  score: number;
}

export interface Round {
  round: number;
  teams: { [teamId: string]: RoundData };
}

export interface Game {
  id: string;
  teams: Team[];
  rounds: Round[];
  status: 'active' | 'completed';
  winner?: string;
  finalScores?: { [teamId: string]: number };
  createdAt: Date;
  finishedAt?: Date;
  teamCount: number;
}

export interface GameSetup {
  teamCount: number;
  teams: Omit<Team, 'id'>[];
}

// Legacy types for backward compatibility
export interface LegacyTeam {
  name: string;
  players: string[];
}

export interface LegacyRound {
  round: number;
  teamA: RoundData;
  teamB: RoundData;
}

export interface LegacyGame {
  id: string;
  teamA: LegacyTeam;
  teamB: LegacyTeam;
  rounds: LegacyRound[];
  status: 'active' | 'completed';
  winner?: string;
  finalScores?: { teamA: number; teamB: number };
  createdAt: Date;
  finishedAt?: Date;
}

export interface LegacyGameSetup {
  teamA: LegacyTeam;
  teamB: LegacyTeam;
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
  team_count?: number;
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

export interface DatabaseTeam {
  id: string;
  game_id: string;
  team_number: number;
  team_name: string;
  players: string[];
  theme_id?: string;
  created_at: string;
}

export interface DatabaseTeamRound {
  id: string;
  game_id: string;
  team_id: string;
  round_number: number;
  bid: number;
  won: number;
  bags: number;
  score: number;
  created_at: string;
}
