import { useState, useEffect } from "react";
import { GameHistory } from "./GameHistory";
import { NewGameForm } from "./NewGameForm";
import { SeatingArrangement } from "./SeatingArrangement";
import { Scorecard } from "../game/Scorecard";
import { Game, GameSetup } from "@/types/game";
import { useGames } from "@/hooks/useGames";
import { useUser } from "@/hooks/useUser";
import { GameFilters } from "./GameFilters";
import { Header } from "@/components/ui/header";

interface DashboardProps {
  user: string;
  onLogout: () => void;
}

const GAMES_PER_PAGE = 10;

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const { isAdmin } = useUser();
  const [showDeleted, setShowDeleted] = useState(false);
  const [currentView, setCurrentView] = useState<
    "dashboard" | "newGame" | "seatingArrangement" | "game"
  >("dashboard");
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [gameSetup, setGameSetup] = useState<GameSetup | null>(null);
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

  const handleShowSeating = (setup: GameSetup) => {
    setGameSetup(setup);
    setCurrentView("seatingArrangement");
  };

  const handleStartGame = async (setup: GameSetup) => {
    try {
      const newGame = await createGame(
        setup.teamA.name,
        setup.teamB.name,
        setup.teamA.players,
        setup.teamB.players,
        setup.maxRounds
      );
      if (newGame) {
        setCurrentGame(newGame);
        setCurrentView("game");
      }
    } catch (error) {
      console.error("Error starting game:", error);
      // You might want to show an error to the user here
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setCurrentGame(null);
    setGameSetup(null);
  };

  const handleViewGame = async (gameId: string) => {
    const gameDetails = await fetchGameDetails(gameId);
    if (gameDetails) {
      setCurrentGame(gameDetails);
      setCurrentView("game");
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

  const handleCompleteGame = async (
    gameId: string,
    winner: string,
    finalScores: { teamA: number; teamB: number }
  ) => {
    await completeGame(gameId, winner, finalScores);
    const updatedGame = await fetchGameDetails(gameId);
    if (updatedGame) {
      setCurrentGame(updatedGame);
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    await deleteGame(gameId);
    // The useGames hook will update the games list
  };

  if (currentView === "newGame") {
    return (
      <div className="container mx-auto p-4">
        <NewGameForm
          onStartGame={handleShowSeating}
          onCancel={handleBackToDashboard}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading games...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Header
        userEmail={user}
        onLogout={onLogout}
      />

      {currentView === "dashboard" && (
        <div>
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
            onNewGame={() => setCurrentView("newGame")}
          />
          <main className="mt-4">
            {filteredAndSortedGames.length === 0 ? (
              <div className="text-white text-center py-4">
                No games found. Adjust your filters or create a new game.
              </div>
            ) : (
              <GameHistory
                games={paginatedGames}
                onViewGame={(game) => handleViewGame(game.id)}
                onDeleteGame={handleDeleteGame}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalGames={filteredAndSortedGames.length}
              />
            )}
          </main>
        </div>
      )}

      {currentView === "newGame" && (
        <NewGameForm
          onStartGame={handleShowSeating}
          onCancel={handleBackToDashboard}
        />
      )}

      {currentView === "seatingArrangement" && gameSetup && (
        <SeatingArrangement
          setup={gameSetup}
          onStartGame={handleStartGame}
          onCancel={() => setCurrentView("newGame")}
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
