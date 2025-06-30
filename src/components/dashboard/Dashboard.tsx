import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GameHistory } from "./GameHistory";
import { NewGameForm } from "./NewGameForm";
import { Scorecard } from "../game/Scorecard";
import { LogOut, Plus, Spade } from "lucide-react";
import { Game, GameSetup } from "@/types/game";
import { useGames } from "@/hooks/useGames";

interface DashboardProps {
  user: string;
  onLogout: () => void;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "newGame" | "game"
  >("dashboard");
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const { games, loading, createGame, updateRound, completeGame, deleteGame } =
    useGames();

  const handleNewGame = async (setup: GameSetup) => {
    try {
      const newGame = await createGame(
        setup.teamA.name,
        setup.teamB.name,
        setup.teamA.players,
        setup.teamB.players
      );
      setCurrentGame(newGame);
      setCurrentView("game");
    } catch (error) {
      console.error("Error creating new game:", error);
      alert("Failed to create new game. Please try again.");
    }
  };

  const handleGameComplete = async (completedGame: Game) => {
    if (completedGame.finalScores && completedGame.winner) {
      await completeGame(
        completedGame.id,
        completedGame.winner,
        completedGame.finalScores
      );
    }
    setCurrentGame(null);
    setCurrentView("dashboard");
  };

  const handleViewGame = (game: Game) => {
    setCurrentGame(game);
    setCurrentView("game");
  };

  const handleDeleteGame = async (gameId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this game? This action cannot be undone."
      )
    ) {
      try {
        await deleteGame(gameId);
      } catch (error) {
        console.error("Error deleting game:", error);
        alert("Failed to delete game. Please try again.");
      }
    }
  };

  const handleUpdateRound = async (
    gameId: string,
    roundNumber: number,
    team: "teamA" | "teamB",
    bid: number,
    won: number,
    bags: number,
    score: number
  ) => {
    await updateRound(gameId, roundNumber, team, bid, won, bags, score);
  };

  const handleHomeClick = () => {
    setCurrentView("dashboard");
    setCurrentGame(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading games...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleHomeClick}
              variant="ghost"
              className="flex items-center space-x-2 text-white hover:bg-transparent"
            >
              <Spade className="h-6 w-6 text-blue-400" />
              <h1 className="text-xl font-bold">Spades Scorecard</h1>
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-300">Welcome, {user}</span>
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === "dashboard" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Your Games</h2>
              <Button
                onClick={() => setCurrentView("newGame")}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Game
              </Button>
            </div>
            <GameHistory
              games={games}
              onViewGame={handleViewGame}
              onDeleteGame={handleDeleteGame}
            />
          </div>
        )}

        {currentView === "newGame" && (
          <NewGameForm
            onStartGame={handleNewGame}
            onCancel={() => setCurrentView("dashboard")}
          />
        )}

        {currentView === "game" && currentGame && (
          <Scorecard
            game={currentGame}
            onGameComplete={handleGameComplete}
            onBackToDashboard={() => setCurrentView("dashboard")}
            onUpdateRound={handleUpdateRound}
          />
        )}
      </main>
    </div>
  );
};
