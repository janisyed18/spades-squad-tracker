import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GameHistory } from "./GameHistory";
import { NewGameForm } from "./NewGameForm";
import { Scorecard } from "../game/Scorecard";
import { LogOut, Plus, Spade } from "lucide-react";
import { Game, GameSetup } from "@/types/game";
import { useGames } from "@/hooks/useGames";
import { useUser } from "@/hooks/useUser";
import { GameFilters } from "./GameFilters";

interface DashboardProps {
  user: string;
  onLogout: () => void;
}

const GAMES_PER_PAGE = 10;

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const { isAdmin } = useUser();
  const [showDeleted, setShowDeleted] = useState(false);
  const [currentView, setCurrentView] = useState<
    "dashboard" | "newGame" | "game"
  >("dashboard");
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const {
    games,
    loading,
    createGame,
    updateRound,
    completeGame,
    deleteGame,
    fetchGameDetails,
  } = useGames(showDeleted);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "in-progress" | "completed">(
    "all"
  );
  const [sort, setSort] = useState({ key: "createdAt", order: "desc" });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedGames = games
    .filter((game) => {
      if (filter === "in-progress") return game.status === "active";
      if (filter === "completed") return game.status === "completed";
      return true;
    })
    .filter((game) => {
      const lowercasedTerm = searchTerm.toLowerCase();
      return (
        game.teamA.name.toLowerCase().includes(lowercasedTerm) ||
        game.teamB.name.toLowerCase().includes(lowercasedTerm) ||
        game.teamA.players.some((p) =>
          p.toLowerCase().includes(lowercasedTerm)
        ) ||
        game.teamB.players.some((p) => p.toLowerCase().includes(lowercasedTerm))
      );
    })
    .sort((a, b) => {
      if (sort.key === "createdAt") {
        return sort.order === "asc"
          ? a.createdAt.getTime() - b.createdAt.getTime()
          : b.createdAt.getTime() - a.createdAt.getTime();
      }
      if (sort.key === "teamName") {
        const nameA = `${a.teamA.name} vs ${a.teamB.name}`;
        const nameB = `${b.teamA.name} vs ${b.teamB.name}`;
        return sort.order === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      if (sort.key === "score") {
        const scoreA = a.finalScores
          ? a.finalScores.teamA + a.finalScores.teamB
          : 0;
        const scoreB = b.finalScores
          ? b.finalScores.teamA + b.finalScores.teamB
          : 0;
        return sort.order === "asc" ? scoreA - scoreB : scoreB - scoreA;
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredAndSortedGames.length / GAMES_PER_PAGE);
  const paginatedGames = filteredAndSortedGames.slice(
    (currentPage - 1) * GAMES_PER_PAGE,
    currentPage * GAMES_PER_PAGE
  );

  const handleSortChange = (key: string) => {
    setSort((prev) => ({
      key,
      order: prev.key === key && prev.order === "desc" ? "asc" : "desc",
    }));
  };

  const handleNewGame = async (setup: GameSetup) => {
    try {
      const newGame = await createGame(
        setup.teamA.name,
        setup.teamB.name,
        setup.teamA.players,
        setup.teamB.players,
        setup.maxRounds
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

  const handleViewGame = async (game: Game) => {
    const updatedGame = await fetchGameDetails(game.id);
    setCurrentGame(updatedGame || game);
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
    teamAData: { bid: number; won: number; bags: number; score: number },
    teamBData: { bid: number; won: number; bags: number; score: number }
  ) => {
    await updateRound(gameId, roundNumber, teamAData, teamBData);
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
    <div className="container mx-auto py-8 space-y-8">
      {currentView === "dashboard" && (
        <>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Spade className="h-8 w-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">Spades Squad</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => setCurrentView("newGame")}>
                <Plus className="h-4 w-4 mr-2" /> New Game
              </Button>
              <Button onClick={onLogout} variant="ghost">
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </div>
          </div>

          <GameFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filter={filter}
            onFilterChange={setFilter}
            sort={sort as { key: string; order: "asc" | "desc" }}
            onSortChange={handleSortChange}
            showDeleted={showDeleted}
            onShowDeletedChange={setShowDeleted}
            isAdmin={isAdmin}
          />
          <GameHistory
            games={paginatedGames}
            onViewGame={handleViewGame}
            onDeleteGame={handleDeleteGame}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalGames={filteredAndSortedGames.length}
          />
        </>
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
    </div>
  );
};
