
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trophy, Trash2 } from 'lucide-react';
import { Game } from '@/types/game';
import { formatDateTime } from '@/utils/gameLogic';

interface GameHistoryProps {
  games: Game[];
  onViewGame: (game: Game) => void;
  onDeleteGame: (gameId: string) => void;
}

export const GameHistory = ({ games, onViewGame, onDeleteGame }: GameHistoryProps) => {
  const calculateCurrentScores = (game: Game) => {
    let scoreA = 0, scoreB = 0, bagsA = 0, bagsB = 0;

    game.rounds.forEach(round => {
      scoreA += round.teamA.score;
      scoreB += round.teamB.score;
      bagsA += round.teamA.bags;
      bagsB += round.teamB.bags;
    });

    const bagPenaltyA = Math.floor(bagsA / 5) * 50;
    const bagPenaltyB = Math.floor(bagsB / 5) * 50;

    return {
      teamA: scoreA - bagPenaltyA,
      teamB: scoreB - bagPenaltyB
    };
  };

  if (games.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="py-8 text-center">
          <p className="text-slate-400">No games played yet. Start your first game!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => {
        const currentScores = game.status === 'active' ? calculateCurrentScores(game) : null;
        const displayScores = game.status === 'completed' && game.finalScores ? game.finalScores : currentScores;
        
        return (
          <Card key={game.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white">{game.teamA.name} vs {game.teamB.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={game.status === 'completed' ? 'default' : 'secondary'}
                    className={game.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'}
                  >
                    {game.status}
                  </Badge>
                  <Button
                    onClick={() => onDeleteGame(game.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="text-slate-400">
                {formatDateTime(game.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {displayScores && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">{game.teamA.name}</span>
                    <span className={`font-bold ${
                      (game.status === 'completed' && game.winner === game.teamA.name) ||
                      (game.status === 'active' && displayScores.teamA > displayScores.teamB)
                        ? 'text-green-400' : 'text-slate-400'
                    }`}>
                      {displayScores.teamA}
                      {game.status === 'completed' && game.winner === game.teamA.name && 
                        <Trophy className="inline h-4 w-4 ml-1" />
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">{game.teamB.name}</span>
                    <span className={`font-bold ${
                      (game.status === 'completed' && game.winner === game.teamB.name) ||
                      (game.status === 'active' && displayScores.teamB > displayScores.teamA)
                        ? 'text-green-400' : 'text-slate-400'
                    }`}>
                      {displayScores.teamB}
                      {game.status === 'completed' && game.winner === game.teamB.name && 
                        <Trophy className="inline h-4 w-4 ml-1" />
                      }
                    </span>
                  </div>
                </div>
              )}
              <Button
                onClick={() => onViewGame(game)}
                variant="outline"
                size="sm"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Game
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
