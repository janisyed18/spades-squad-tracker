import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Trash2 } from "lucide-react";
import { Game } from "@/types/game";
import { formatDateTime } from "@/utils/gameLogic";

interface GameHistoryProps {
  games: Game[];
  onViewGame: (game: Game) => void;
  onDeleteGame: (gameId: string) => void;
}

export const GameHistory = ({
  games,
  onViewGame,
  onDeleteGame,
}: GameHistoryProps) => {
  if (games.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-8 text-center">
          <p className="text-slate-400">
            No games yet. Create your first game to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {games.map((game) => (
        <Card
          key={game.id}
          onClick={() => onViewGame(game)}
          className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <span className="text-blue-400">{game.teamA.name}</span>
                <span className="mx-2 text-slate-400">vs</span>
                <span className="text-green-400">{game.teamB.name}</span>
                {game.status === "completed" && game.winner && (
                  <Trophy className="h-5 w-5 text-yellow-400 ml-2" />
                )}
              </CardTitle>
              <div className="flex items-center space-x-2">
                {/* View button is removed, card is now clickable */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    onDeleteGame(game.id);
                  }}
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
              {/* Status Row - Always displayed */}
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status:</span>
                <span
                  className={`font-medium ${
                    game.status === "completed"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {game.status === "completed" ? "Completed" : "In Progress"}
                </span>
              </div>

              {/* Winner Row - Always displayed */}
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Winner:</span>
                <span className="text-yellow-400 font-medium">
                  {game.winner || "—"}
                </span>
              </div>

              {/* Score Row - Conditional on game status */}
              <div className="flex justify-between items-center">
                <span className="text-slate-400">
                  {game.status === "completed"
                    ? "Final Score:"
                    : "Current Scores:"}
                </span>
                <span className="text-white font-medium">
                  {game.finalScores
                    ? `${game.finalScores.teamA} - ${game.finalScores.teamB}`
                    : "—"}
                </span>
              </div>

              {/* Started Row - Always displayed */}
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Started:</span>
                <span className="text-slate-300">
                  {formatDateTime(game.createdAt)}
                </span>
              </div>

              {/* Finished Row - Always display label with a placeholder if no data */}
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Finished:</span>
                <span className="text-slate-300">
                  {game.finishedAt ? formatDateTime(game.finishedAt) : "—"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
