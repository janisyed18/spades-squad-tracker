
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Game, Round } from '@/types/game';
import { RoundInput } from './RoundInput';
import { ScoreDisplay } from './ScoreDisplay';
import { calculateScore, calculateBags } from '@/utils/gameLogic';

interface ScorecardProps {
  game: Game;
  onGameComplete: (game: Game) => void;
  onBackToDashboard: () => void;
  onUpdateRound?: (gameId: string, roundNumber: number, team: 'teamA' | 'teamB', bid: number, won: number, bags: number, score: number) => void;
}

export const Scorecard = ({ game, onGameComplete, onBackToDashboard, onUpdateRound }: ScorecardProps) => {
  const [currentGame, setCurrentGame] = useState<Game>(game);
  const [totalScores, setTotalScores] = useState({ teamA: 0, teamB: 0 });
  const [totalBags, setTotalBags] = useState({ teamA: 0, teamB: 0 });

  // Recalculate totals whenever rounds change
  useEffect(() => {
    let scoreA = 0, scoreB = 0, bagsA = 0, bagsB = 0;
    let bagPenaltyA = 0, bagPenaltyB = 0;

    currentGame.rounds.forEach(round => {
      scoreA += round.teamA.score;
      scoreB += round.teamB.score;
      bagsA += round.teamA.bags;
      bagsB += round.teamB.bags;
    });

    // Apply bag penalties (every 5 bags = -50 points)
    bagPenaltyA = Math.floor(bagsA / 5) * 50;
    bagPenaltyB = Math.floor(bagsB / 5) * 50;
    
    // Add individual bag points to score (1 point per bag)
    const totalBagsScoreA = bagsA;
    const totalBagsScoreB = bagsB;
    
    setTotalScores({ 
      teamA: scoreA + totalBagsScoreA - bagPenaltyA, 
      teamB: scoreB + totalBagsScoreB - bagPenaltyB 
    });
    setTotalBags({ 
      teamA: bagsA % 5, 
      teamB: bagsB % 5 
    });
  }, [currentGame.rounds]);

  const updateRound = async (roundNumber: number, team: 'teamA' | 'teamB', bid: number, won: number) => {
    const bags = calculateBags(bid, won);
    const score = calculateScore(bid, won);
    
    // Update local state
    setCurrentGame(prev => ({
      ...prev,
      rounds: prev.rounds.map(round => {
        if (round.round === roundNumber) {
          return {
            ...round,
            [team]: { bid, won, bags, score }
          };
        }
        return round;
      })
    }));

    // Update database if callback provided
    if (onUpdateRound) {
      await onUpdateRound(currentGame.id, roundNumber, team, bid, won, bags, score);
    }
  };

  const handleCompleteGame = () => {
    const winner = totalScores.teamA > totalScores.teamB ? currentGame.teamA.name : currentGame.teamB.name;
    
    const completedGame: Game = {
      ...currentGame,
      status: 'completed',
      winner,
      finalScores: totalScores,
      finishedAt: new Date()
    };
    
    onGameComplete(completedGame);
  };

  const isGameComplete = currentGame.rounds.every(round => 
    round.teamA.bid >= 0 && round.teamA.won >= 0 && 
    round.teamB.bid >= 0 && round.teamB.won >= 0 &&
    (round.teamA.bid > 0 || round.teamA.won === 0) &&
    (round.teamB.bid > 0 || round.teamB.won === 0)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            onClick={onBackToDashboard}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {currentGame.teamA.name} vs {currentGame.teamB.name}
            </h2>
            {/* Display player names */}
            <div className="text-sm text-slate-400 mt-1 space-y-1">
              {currentGame.teamA.players.length > 0 && (
                <div>
                  <span className="text-blue-400">{currentGame.teamA.name}:</span> {currentGame.teamA.players.filter(p => p).join(', ')}
                </div>
              )}
              {currentGame.teamB.players.length > 0 && (
                <div>
                  <span className="text-green-400">{currentGame.teamB.name}:</span> {currentGame.teamB.players.filter(p => p).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {isGameComplete && currentGame.status !== 'completed' && (
          <Button
            onClick={handleCompleteGame}
            className="bg-green-600 hover:bg-green-700"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Complete Game
          </Button>
        )}
      </div>

      {/* Score Display */}
      <ScoreDisplay
        teamA={currentGame.teamA}
        teamB={currentGame.teamB}
        scores={totalScores}
        bags={totalBags}
        winner={currentGame.winner}
        createdAt={currentGame.createdAt}
        finishedAt={currentGame.finishedAt}
      />

      {/* Rounds Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Round by Round</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left text-slate-300 p-2">Round</th>
                  <th className="text-center text-blue-400 p-2" colSpan={4}>{currentGame.teamA.name}</th>
                  <th className="text-center text-green-400 p-2" colSpan={4}>{currentGame.teamB.name}</th>
                </tr>
                <tr className="border-b border-slate-600 text-sm">
                  <th className="text-slate-400 p-2"></th>
                  <th className="text-slate-400 p-2">Bid</th>
                  <th className="text-slate-400 p-2">Won</th>
                  <th className="text-slate-400 p-2">Bags</th>
                  <th className="text-slate-400 p-2">Score</th>
                  <th className="text-slate-400 p-2">Bid</th>
                  <th className="text-slate-400 p-2">Won</th>
                  <th className="text-slate-400 p-2">Bags</th>
                  <th className="text-slate-400 p-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {currentGame.rounds.map((round) => (
                  <RoundInput
                    key={round.round}
                    round={round}
                    onUpdate={updateRound}
                    disabled={currentGame.status === 'completed'}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
