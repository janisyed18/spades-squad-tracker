
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Eye, Trash2 } from 'lucide-react';
import { Game } from '@/types/game';
import { formatDateTime } from '@/utils/gameLogic';

interface GameHistoryProps {
  games: Game[];
  onViewGame: (game: Game) => void;
  onDeleteGame: (gameId: string) => void;
}

export const GameHistory = ({ games, onViewGame, onDeleteGame }: GameHistoryProps) => {
  if (games.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-8 text-center">
          <p className="text-slate-400">No games yet. Create your first game to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <Card key={game.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <span className="text-blue-400">{game.teamA.name}</span>
                <span className="mx-2 text-slate-400">vs</span>
                <span className="text-green-400">{game.teamB.name}</span>
                {game.status === 'completed' && game.winner && (
                  <Trophy className="h-5 w-5 text-yellow-400 ml-2" />
                )}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => onViewGame(game)}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  onClick={() => onDeleteGame(game.id)}
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-400 hover:bg-red-900/20 hover:border-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status:</span>
                <span className={`font-medium ${
                  game.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {game.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
              </div>
              
              {game.status === 'active' && game.finalScores && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Current Scores:</span>
                  <span className="text-white font-medium">
                    {game.teamA.name}: {game.finalScores.teamA} | {game.teamB.name}: {game.finalScores.teamB}
                  </span>
                </div>
              )}
              
              {game.status === 'completed' && game.winner && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Winner:</span>
                  <span className="text-yellow-400 font-medium">{game.winner}</span>
                </div>
              )}
              
              {game.finalScores && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Final Score:</span>
                  <span className="text-white font-medium">
                    {game.finalScores.teamA} - {game.finalScores.teamB}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Started:</span>
                <span className="text-slate-300">{formatDateTime(game.createdAt)}</span>
              </div>
              
              {game.finishedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Finished:</span>
                  <span className="text-slate-300">{formatDateTime(game.finishedAt)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
