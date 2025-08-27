import { useState, useEffect } from "react";
import { GameHistory } from "./GameHistory";
import { FlexibleNewGameForm } from "./FlexibleNewGameForm";
import { ModernSeatingArrangement } from "./ModernSeatingArrangement";
import { Scorecard } from "../game/Scorecard";
import { Game, GameSetup } from "@/types/game";
import { useGames } from "@/hooks/useGames";
import { useUser } from "@/hooks/useUser";
import { GameFilters } from "./GameFilters";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ModernDashboardProps {
  user: string;
  onLogout: () => void;
}

const GAMES_PER_PAGE = 10;

export const ModernDashboard = ({ user, onLogout }: ModernDashboardProps) => {
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

  const handleDeleteGame = async (gameId: string) => {
    await deleteGame(gameId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center">
        <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-8 shadow-lg">
          <div className="text-foreground text-lg">Loading games...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <Header
        userEmail={user}
        onLogout={onLogout}
      />

      {currentView === "dashboard" && (
        <div className="container mx-auto py-8 space-y-8">
          {/* Modern Header with glass effect */}
          <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-8 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Game Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">
                  Track your Spades mastery journey
                </p>
              </div>
              <Button
                onClick={() => setCurrentView("newGame")}
                className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground px-8 py-3 shadow-lg font-medium"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Game
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
            onNewGame={() => setCurrentView("newGame")}
          />
          
          <main>
            {filteredAndSortedGames.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-8 shadow-lg">
                  <p className="text-muted-foreground text-lg">
                    No games found. Adjust your filters or create a new game.
                  </p>
                </div>
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
        <FlexibleNewGameForm
          onStartGame={handleShowSeating}
          onCancel={handleBackToDashboard}
        />
      )}

      {currentView === "seatingArrangement" && gameSetup && (
        <ModernSeatingArrangement
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