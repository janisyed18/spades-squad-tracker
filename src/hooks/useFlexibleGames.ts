import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Game, GameSetup, Team, DatabaseGame, DatabaseTeam, DatabaseTeamRound, Round } from '@/types/game';

export const useFlexibleGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const convertDatabaseToGame = async (dbGame: DatabaseGame): Promise<Game> => {
    // For new flexible games, fetch teams and team rounds
    if (dbGame.team_count && dbGame.team_count > 2) {
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .eq('game_id', dbGame.id)
        .order('team_number');

      if (teamsError) throw teamsError;

      const { data: teamRoundsData, error: teamRoundsError } = await supabase
        .from('team_rounds')
        .select('*')
        .eq('game_id', dbGame.id)
        .order('round_number, team_id');

      if (teamRoundsError) throw teamRoundsError;

      const teams: Team[] = (teamsData as DatabaseTeam[]).map(team => ({
        id: team.id,
        name: team.team_name,
        players: team.players || [],
        teamNumber: team.team_number,
        themeId: team.theme_id
      }));

      // Group team rounds by round number
      const roundsMap = new Map<number, { [teamId: string]: any }>();
      (teamRoundsData as DatabaseTeamRound[]).forEach(teamRound => {
        if (!roundsMap.has(teamRound.round_number)) {
          roundsMap.set(teamRound.round_number, {});
        }
        roundsMap.get(teamRound.round_number)![teamRound.team_id] = {
          bid: teamRound.bid,
          won: teamRound.won,
          bags: teamRound.bags,
          score: teamRound.score
        };
      });

      const rounds: Round[] = Array.from(roundsMap.entries()).map(([roundNumber, teamsData]) => ({
        round: roundNumber,
        teams: teamsData
      }));

      const finalScores: { [teamId: string]: number } = {};
      teams.forEach(team => {
        if (dbGame.winner && dbGame.final_score_team_a !== null) {
          // For completed games, we need to calculate final scores
          finalScores[team.id] = 0; // This will be calculated from rounds
        }
      });

      return {
        id: dbGame.id,
        teams,
        rounds,
        status: dbGame.status as 'active' | 'completed',
        winner: dbGame.winner,
        finalScores: Object.keys(finalScores).length > 0 ? finalScores : undefined,
        createdAt: new Date(dbGame.created_at),
        finishedAt: dbGame.finished_at ? new Date(dbGame.finished_at) : undefined,
        teamCount: dbGame.team_count || teams.length
      };
    }

    // Legacy conversion for 2-team games
    const legacyTeams: Team[] = [
      {
        id: 'team-a',
        name: dbGame.team_a_name,
        players: dbGame.team_a_players || [],
        teamNumber: 0
      },
      {
        id: 'team-b',
        name: dbGame.team_b_name,
        players: dbGame.team_b_players || [],
        teamNumber: 1
      }
    ];

    // Get legacy rounds
    const { data: roundsData, error: roundsError } = await supabase
      .from('rounds')
      .select('*')
      .eq('game_id', dbGame.id)
      .order('round_number');

    if (roundsError) throw roundsError;

    const legacyRounds: Round[] = (roundsData || []).map(round => ({
      round: round.round_number,
      teams: {
        'team-a': {
          bid: round.team_a_bid,
          won: round.team_a_won,
          bags: round.team_a_bags,
          score: round.team_a_score
        },
        'team-b': {
          bid: round.team_b_bid,
          won: round.team_b_won,
          bags: round.team_b_bags,
          score: round.team_b_score
        }
      }
    }));

    const finalScores = dbGame.final_score_team_a !== null && dbGame.final_score_team_b !== null ? {
      'team-a': dbGame.final_score_team_a,
      'team-b': dbGame.final_score_team_b
    } : undefined;

    return {
      id: dbGame.id,
      teams: legacyTeams,
      rounds: legacyRounds,
      status: dbGame.status as 'active' | 'completed',
      winner: dbGame.winner,
      finalScores,
      createdAt: new Date(dbGame.created_at),
      finishedAt: dbGame.finished_at ? new Date(dbGame.finished_at) : undefined,
      teamCount: 2
    };
  };

  const fetchGames = async () => {
    try {
      setLoading(true);
      const { data: gamesData, error: gamesError } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });

      if (gamesError) throw gamesError;

      const gamesWithData = await Promise.all(
        gamesData.map(async (game) => {
          return await convertDatabaseToGame(game as DatabaseGame);
        })
      );

      setGames(gamesWithData);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const createGame = async (setup: GameSetup) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create the game record
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .insert({
          user_id: user.id,
          team_a_name: setup.teams[0]?.name || 'Team 1',
          team_b_name: setup.teams[1]?.name || 'Team 2',
          team_a_players: setup.teams[0]?.players || [],
          team_b_players: setup.teams[1]?.players || [],
          status: 'active',
          team_count: setup.teamCount
        })
        .select()
        .single();

      if (gameError) throw gameError;

      // For flexible games (more than 2 teams), use new schema
      if (setup.teamCount > 2) {
        // Create teams
        const teamsToInsert = setup.teams.map(team => ({
          game_id: gameData.id,
          team_number: team.teamNumber,
          team_name: team.name,
          players: team.players,
          theme_id: team.themeId
        }));

        const { data: teamsData, error: teamsError } = await supabase
          .from('teams')
          .insert(teamsToInsert)
          .select();

        if (teamsError) throw teamsError;

        // Create team rounds for 13 rounds
        const teamRoundsToInsert: any[] = [];
        (teamsData as DatabaseTeam[]).forEach(team => {
          for (let round = 1; round <= 13; round++) {
            teamRoundsToInsert.push({
              game_id: gameData.id,
              team_id: team.id,
              round_number: round,
              bid: 0,
              won: 0,
              bags: 0,
              score: 0
            });
          }
        });

        const { error: teamRoundsError } = await supabase
          .from('team_rounds')
          .insert(teamRoundsToInsert);

        if (teamRoundsError) throw teamRoundsError;
      } else {
        // For 2-team games, use legacy rounds table
        const rounds = Array.from({ length: 13 }, (_, i) => ({
          game_id: gameData.id,
          round_number: i + 1,
          team_a_bid: 0,
          team_a_won: 0,
          team_a_bags: 0,
          team_a_score: 0,
          team_b_bid: 0,
          team_b_won: 0,
          team_b_bags: 0,
          team_b_score: 0
        }));

        const { error: roundsError } = await supabase
          .from('rounds')
          .insert(rounds);

        if (roundsError) throw roundsError;
      }

      const newGame = await convertDatabaseToGame(gameData as DatabaseGame);
      setGames(prev => [newGame, ...prev]);
      return newGame;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  };

  const updateRound = async (gameId: string, roundNumber: number, teamId: string, bid: number, won: number, bags: number, score: number) => {
    try {
      const game = games.find(g => g.id === gameId);
      if (!game) return;

      if (game.teamCount > 2) {
        // Update team_rounds table
        const { error } = await supabase
          .from('team_rounds')
          .update({
            bid,
            won,
            bags,
            score
          })
          .eq('game_id', gameId)
          .eq('team_id', teamId)
          .eq('round_number', roundNumber);

        if (error) throw error;
      } else {
        // Update legacy rounds table
        const updateData = teamId === 'team-a' ? {
          team_a_bid: bid,
          team_a_won: won,
          team_a_bags: bags,
          team_a_score: score
        } : {
          team_b_bid: bid,
          team_b_won: won,
          team_b_bags: bags,
          team_b_score: score
        };

        const { error } = await supabase
          .from('rounds')
          .update(updateData)
          .eq('game_id', gameId)
          .eq('round_number', roundNumber);

        if (error) throw error;
      }

      // Update local state
      setGames(prev => prev.map(g => {
        if (g.id === gameId) {
          return {
            ...g,
            rounds: g.rounds.map(round => {
              if (round.round === roundNumber) {
                return {
                  ...round,
                  teams: {
                    ...round.teams,
                    [teamId]: { bid, won, bags, score }
                  }
                };
              }
              return round;
            })
          };
        }
        return g;
      }));
    } catch (error) {
      console.error('Error updating round:', error);
      throw error;
    }
  };

  const completeGame = async (gameId: string, winner: string, finalScores: { [teamId: string]: number }) => {
    try {
      const game = games.find(g => g.id === gameId);
      if (!game) return;

      const updateData: any = {
        status: 'completed',
        winner,
        finished_at: new Date().toISOString()
      };

      // For legacy 2-team games, also update the old final score fields
      if (game.teamCount <= 2) {
        const teamAScore = finalScores['team-a'];
        const teamBScore = finalScores['team-b'];
        if (teamAScore !== undefined) updateData.final_score_team_a = teamAScore;
        if (teamBScore !== undefined) updateData.final_score_team_b = teamBScore;
      }

      const { error } = await supabase
        .from('games')
        .update(updateData)
        .eq('id', gameId);

      if (error) throw error;

      setGames(prev => prev.map(g => {
        if (g.id === gameId) {
          return {
            ...g,
            status: 'completed' as const,
            winner,
            finalScores,
            finishedAt: new Date()
          };
        }
        return g;
      }));
    } catch (error) {
      console.error('Error completing game:', error);
      throw error;
    }
  };

  const deleteGame = async (gameId: string) => {
    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', gameId);

      if (error) throw error;

      setGames(prev => prev.filter(game => game.id !== gameId));
    } catch (error) {
      console.error('Error deleting game:', error);
      throw error;
    }
  };

  return {
    games,
    loading,
    createGame,
    updateRound,
    completeGame,
    deleteGame,
    refetchGames: fetchGames
  };
};