
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trophy } from 'lucide-react';
import { Game } from '@/types/game';
import { formatDateTime } from '@/utils/gameLogic';

interface GameHistoryProps {
  games: Game[];
  onViewGame: (game: Game) => void;
}

export const GameHistory = ({ games, onViewGame }: GameHistoryProps) => {
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
      {games.map((game) => (
        <Card key={game.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white">{game.teamA.name} vs {game.teamB.name}</CardTitle>
              <Badge 
                variant={game.status === 'completed' ? 'default' : 'secondary'}
                className={game.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'}
              >
                {game.status}
              </Badge>
            </div>
            <CardDescription className="text-slate-400">
              {formatDateTime(game.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {game.status === 'completed' && game.finalScores && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">{game.teamA.name}</span>
                  <span className={`font-bold ${game.winner === game.teamA.name ? 'text-green-400' : 'text-slate-400'}`}>
                    {game.finalScores.teamA}
                    {game.winner === game.teamA.name && <Trophy className="inline h-4 w-4 ml-1" />}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">{game.teamB.name}</span>
                  <span className={`font-bold ${game.winner === game.teamB.name ? 'text-green-400' : 'text-slate-400'}`}>
                    {game.finalScores.teamB}
                    {game.winner === game.teamB.name && <Trophy className="inline h-4 w-4 ml-1" />}
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
      ))}
    </div>
  );
};
