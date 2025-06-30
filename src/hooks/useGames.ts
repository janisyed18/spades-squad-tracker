
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Game, DatabaseGame, DatabaseRound } from '@/types/game';

export const useGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const convertDatabaseGameToGame = (dbGame: DatabaseGame, rounds: DatabaseRound[] = []): Game => {
    const gameRounds = rounds.map(round => ({
      round: round.round_number,
      teamA: {
        bid: round.team_a_bid,
        won: round.team_a_won,
        bags: round.team_a_bags,
        score: round.team_a_score
      },
      teamB: {
        bid: round.team_b_bid,
        won: round.team_b_won,
        bags: round.team_b_bags,
        score: round.team_b_score
      }
    }));

    return {
      id: dbGame.id,
      teamA: {
        name: dbGame.team_a_name,
        players: dbGame.team_a_players || []
      },
      teamB: {
        name: dbGame.team_b_name,
        players: dbGame.team_b_players || []
      },
      rounds: gameRounds,
      status: dbGame.status as 'active' | 'completed',
      winner: dbGame.winner,
      finalScores: dbGame.final_score_team_a !== null && dbGame.final_score_team_b !== null ? {
        teamA: dbGame.final_score_team_a,
        teamB: dbGame.final_score_team_b
      } : undefined,
      createdAt: new Date(dbGame.created_at),
      finishedAt: dbGame.finished_at ? new Date(dbGame.finished_at) : undefined
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

      const gamesWithRounds = await Promise.all(
        gamesData.map(async (game) => {
          const { data: roundsData, error: roundsError } = await supabase
            .from('rounds')
            .select('*')
            .eq('game_id', game.id)
            .order('round_number');

          if (roundsError) throw roundsError;

          return convertDatabaseGameToGame(game as DatabaseGame, roundsData);
        })
      );

      setGames(gamesWithRounds);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const createGame = async (teamAName: string, teamBName: string, teamAPlayers: string[], teamBPlayers: string[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .insert({
          user_id: user.id,
          team_a_name: teamAName,
          team_b_name: teamBName,
          team_a_players: teamAPlayers,
          team_b_players: teamBPlayers,
          status: 'active'
        })
        .select()
        .single();

      if (gameError) throw gameError;

      // Create 13 rounds for the game with proper ID generation
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

      const { data: roundsData, error: roundsError } = await supabase
        .from('rounds')
        .insert(rounds)
        .select();

      if (roundsError) throw roundsError;

      const newGame = convertDatabaseGameToGame(gameData as DatabaseGame, roundsData || []);
      setGames(prev => [newGame, ...prev]);
      return newGame;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  };

  const updateRound = async (gameId: string, roundNumber: number, team: 'teamA' | 'teamB', bid: number, won: number, bags: number, score: number) => {
    try {
      const updateData = team === 'teamA' ? {
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

      setGames(prev => prev.map(game => {
        if (game.id === gameId) {
          return {
            ...game,
            rounds: game.rounds.map(round => {
              if (round.round === roundNumber) {
                return {
                  ...round,
                  [team]: { bid, won, bags, score }
                };
              }
              return round;
            })
          };
        }
        return game;
      }));
    } catch (error) {
      console.error('Error updating round:', error);
      throw error;
    }
  };

  const completeGame = async (gameId: string, winner: string, finalScores: { teamA: number; teamB: number }) => {
    try {
      const { error } = await supabase
        .from('games')
        .update({
          status: 'completed',
          winner,
          final_score_team_a: finalScores.teamA,
          final_score_team_b: finalScores.teamB,
          finished_at: new Date().toISOString()
        })
        .eq('id', gameId);

      if (error) throw error;

      setGames(prev => prev.map(game => {
        if (game.id === gameId) {
          return {
            ...game,
            status: 'completed' as const,
            winner,
            finalScores,
            finishedAt: new Date()
          };
        }
        return game;
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
