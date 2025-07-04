import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, AlertTriangle } from "lucide-react";
import { Game, Round } from "@/types/game";
import { RoundInput } from "./RoundInput";
import { ScoreDisplay } from "./ScoreDisplay";
import { GameCompleteModal } from "./GameCompleteModal";
import { ThemeSelector } from "./ThemeSelector";
import { calculateScore, calculateBags } from "@/utils/gameLogic";

interface ScorecardProps {
  game: Game;
  onGameComplete: (game: Game) => void;
  onBackToDashboard: () => void;
  onUpdateRound?: (
    gameId: string,
    roundNumber: number,
    team: "teamA" | "teamB",
    bid: number,
    won: number,
    bags: number,
    score: number
  ) => void;
}

type Theme = {
  id: string;
  name: string;
  background: string;
  text: string;
  accent: string;
};

export const Scorecard = ({
  game,
  onGameComplete,
  onBackToDashboard,
  onUpdateRound,
}: ScorecardProps) => {
  const [currentGame, setCurrentGame] = useState<Game>(game);
  const [totalScores, setTotalScores] = useState({ teamA: 0, teamB: 0 });
  const [totalBags, setTotalBags] = useState({ teamA: 0, teamB: 0 });
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState<{
    teamA?: Theme;
    teamB?: Theme;
  }>({});
  const [showThemeSelector, setShowThemeSelector] = useState<
    "teamA" | "teamB" | null
  >(null);
  const [roundErrors, setRoundErrors] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Load saved themes from localStorage
  useEffect(() => {
    const savedThemes = localStorage.getItem(`game-themes-${currentGame.id}`);
    if (savedThemes) {
      setSelectedThemes(JSON.parse(savedThemes));
    }
  }, [currentGame.id]);

  // Save themes to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(selectedThemes).length > 0) {
      localStorage.setItem(
        `game-themes-${currentGame.id}`,
        JSON.stringify(selectedThemes)
      );
    }
  }, [selectedThemes, currentGame.id]);

  // Fix scoring calculation - don't add bag points to score
  useEffect(() => {
    let scoreA = 0,
      scoreB = 0,
      bagsA = 0,
      bagsB = 0;

    currentGame.rounds.forEach((round) => {
      scoreA += round.teamA.score; // Only round score, no bag points
      scoreB += round.teamB.score; // Only round score, no bag points
      bagsA += round.teamA.bags;
      bagsB += round.teamB.bags;
    });

    // Apply bag penalties (every 5 bags = -50 points)
    const bagPenaltyA = Math.floor(bagsA / 5) * 50;
    const bagPenaltyB = Math.floor(bagsB / 5) * 50;

    setTotalScores({
      teamA: scoreA - bagPenaltyA, // Only subtract penalties, don't add bag points
      teamB: scoreB - bagPenaltyB, // Only subtract penalties, don't add bag points
    });
    setTotalBags({
      teamA: bagsA % 5,
      teamB: bagsB % 5,
    });
  }, [currentGame.rounds]);

  const validateRoundInputs = (
    roundNumber: number,
    bid: number,
    won: number
  ) => {
    return bid <= roundNumber && won <= roundNumber && bid >= 0 && won >= 0;
  };

  const updateRound = async (
    roundNumber: number,
    team: "teamA" | "teamB",
    bid: number,
    won: number
  ) => {
    const currentRound = currentGame.rounds.find(
      (r) => r.round === roundNumber
    );
    if (!currentRound) return;

    const otherTeam = team === "teamA" ? "teamB" : "teamA";
    const otherTeamWon = currentRound[otherTeam].won;

    if (won + otherTeamWon > roundNumber) {
      won = roundNumber - otherTeamWon;
    }

    if (won < 0) {
      won = 0;
    }

    const isValid = validateRoundInputs(roundNumber, bid, won);
    const errorKey = `${roundNumber}-${team}`;

    setRoundErrors((prev) => ({
      ...prev,
      [errorKey]: !isValid,
    }));

    if (!isValid) return;

    const bags = calculateBags(bid, won);
    const score = calculateScore(bid, won);

    setCurrentGame((prev) => ({
      ...prev,
      rounds: prev.rounds.map((round) => {
        if (round.round === roundNumber) {
          return {
            ...round,
            [team]: { bid, won, bags, score },
          };
        }
        return round;
      }),
    }));

    if (onUpdateRound) {
      await onUpdateRound(
        currentGame.id,
        roundNumber,
        team,
        bid,
        won,
        bags,
        score
      );
    }
  };

  const handleCompleteGame = () => {
    setShowCompleteModal(true);
  };

  const handleModalClose = () => {
    setShowCompleteModal(false);
    const winner =
      totalScores.teamA > totalScores.teamB
        ? currentGame.teamA.name
        : currentGame.teamB.name;

    const completedGame: Game = {
      ...currentGame,
      status: "completed",
      winner,
      finalScores: totalScores,
      finishedAt: new Date(),
    };

    onGameComplete(completedGame);
  };

  const handleThemeSelect = (theme: Theme, team: "teamA" | "teamB") => {
    setSelectedThemes((prev) => ({
      ...prev,
      [team]: theme,
    }));
    setShowThemeSelector(null);
  };

  const availableThemes = (team: "teamA" | "teamB") => {
    const otherTeamTheme =
      team === "teamA" ? selectedThemes.teamB : selectedThemes.teamA;
    return []; // Not used in new implementation
  };

  const isGameComplete = currentGame.rounds.every(
    (round) =>
      round.teamA.bid >= 0 &&
      round.teamA.won >= 0 &&
      round.teamB.bid >= 0 &&
      round.teamB.won >= 0 &&
      validateRoundInputs(round.round, round.teamA.bid, round.teamA.won) &&
      validateRoundInputs(round.round, round.teamB.bid, round.teamB.won)
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
          </div>
        </div>

        {isGameComplete && currentGame.status !== "completed" && (
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
        selectedThemes={selectedThemes}
        onThemeSelect={setShowThemeSelector}
      />

      {/* Team Scorecards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Team A Scorecard */}
        <Card
          className={`${
            selectedThemes.teamA?.background || "bg-slate-800/50"
          } border-slate-700`}
        >
          <CardHeader>
            <CardTitle
              className={`${
                selectedThemes.teamA?.text || "text-blue-400"
              } text-xl font-bold`}
            >
              {currentGame.teamA.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th
                      className={`text-left ${
                        selectedThemes.teamA?.text || "text-slate-300"
                      } p-2`}
                    >
                      Round
                    </th>
                    <th
                      className={`text-center ${
                        selectedThemes.teamA?.text || "text-slate-400"
                      } p-2`}
                    >
                      Bid
                    </th>
                    <th
                      className={`text-center ${
                        selectedThemes.teamA?.text || "text-slate-400"
                      } p-2`}
                    >
                      Won
                    </th>
                    <th
                      className={`text-center ${
                        selectedThemes.teamA?.text || "text-slate-400"
                      } p-2`}
                    >
                      Bags
                    </th>
                    <th
                      className={`text-center ${
                        selectedThemes.teamA?.text || "text-slate-400"
                      } p-2`}
                    >
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentGame.rounds.map((round) => (
                    <RoundInput
                      key={round.round}
                      round={round}
                      team="teamA"
                      onUpdate={updateRound}
                      disabled={currentGame.status === "completed"}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Team B Scorecard */}
        <Card
          className={`${
            selectedThemes.teamB?.background || "bg-slate-800/50"
          } border-slate-700`}
        >
          <CardHeader>
            <CardTitle
              className={`${
                selectedThemes.teamB?.text || "text-green-400"
              } text-xl font-bold`}
            >
              {currentGame.teamB.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th
                      className={`text-left ${
                        selectedThemes.teamB?.text || "text-slate-300"
                      } p-2`}
                    >
                      Round
                    </th>
                    <th
                      className={`text-center ${
                        selectedThemes.teamB?.text || "text-slate-400"
                      } p-2`}
                    >
                      Bid
                    </th>
                    <th
                      className={`text-center ${
                        selectedThemes.teamB?.text || "text-slate-400"
                      } p-2`}
                    >
                      Won
                    </th>
                    <th
                      className={`text-center ${
                        selectedThemes.teamB?.text || "text-slate-400"
                      } p-2`}
                    >
                      Bags
                    </th>
                    <th
                      className={`text-center ${
                        selectedThemes.teamB?.text || "text-slate-400"
                      } p-2`}
                    >
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentGame.rounds.map((round) => (
                    <RoundInput
                      key={round.round}
                      round={round}
                      team="teamB"
                      onUpdate={updateRound}
                      disabled={currentGame.status === "completed"}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Theme Selector Modal */}
      {showThemeSelector && (
        <ThemeSelector
          team={showThemeSelector}
          themes={availableThemes(showThemeSelector)}
          onSelect={(theme) => handleThemeSelect(theme, showThemeSelector)}
          onClose={() => setShowThemeSelector(null)}
          currentGame={currentGame}
          previewTeam={showThemeSelector}
        />
      )}

      {/* Game Complete Modal */}
      {showCompleteModal && (
        <GameCompleteModal
          winner={
            totalScores.teamA > totalScores.teamB
              ? currentGame.teamA.name
              : currentGame.teamB.name
          }
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};
