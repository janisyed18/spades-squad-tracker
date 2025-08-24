import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy } from "lucide-react";
import { Game } from "@/types/game";
import { RoundInput } from "./RoundInput";
import { ScoreDisplay } from "./ScoreDisplay";
import { GameCompleteModal } from "./GameCompleteModal";
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

  useEffect(() => {
    let scoreA = 0,
      scoreB = 0,
      bagsA = 0,
      bagsB = 0;

    currentGame.rounds.forEach((round) => {
      scoreA += round.teamA.score;
      scoreB += round.teamB.score;
      bagsA += round.teamA.bags;
      bagsB += round.teamB.bags;
    });

    const bagPenaltyA = Math.floor(bagsA / 10) * 100;
    const bagPenaltyB = Math.floor(bagsB / 10) * 100;

    setTotalScores({
      teamA: scoreA - bagPenaltyA,
      teamB: scoreB - bagPenaltyB,
    });
    setTotalBags({
      teamA: bagsA % 10,
      teamB: bagsB % 10,
    });
  }, [currentGame.rounds]);

  const updateRound = async (
    roundNumber: number,
    team: "teamA" | "teamB",
    bid: number,
    won: number
  ) => {
    const bags = calculateBags(bid, won);
    const score = calculateScore(bid, won);

    setCurrentGame((prev) => ({
      ...prev,
      rounds: prev.rounds.map((round) =>
        round.round === roundNumber
          ? { ...round, [team]: { bid, won, bags, score } }
          : round
      ),
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

  const isGameComplete =
    currentGame.rounds.length === 10 &&
    currentGame.rounds.every(
      (round) =>
        round.teamA.bid >= 0 &&
        round.teamA.won >= 0 &&
        round.teamB.bid >= 0 &&
        round.teamB.won >= 0
    );

  return (
    <div className="space-y-6 animate-fade-in p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            onClick={onBackToDashboard}
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-white animate-slide-in-left">
              {currentGame.teamA.name} vs {currentGame.teamB.name}
            </h2>
            <p className="text-sm text-slate-400">
              Started: {new Date(currentGame.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {isGameComplete && currentGame.status !== "completed" && (
          <Button
            onClick={handleCompleteGame}
            className="bg-green-600 hover:bg-green-700 animate-pulse"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Complete Game
          </Button>
        )}
      </div>

      <ScoreDisplay
        teamA={currentGame.teamA}
        teamB={currentGame.teamB}
        scores={totalScores}
        bags={totalBags}
        winner={currentGame.winner}
      />

      <div className="grid md:grid-cols-2 gap-6">
        {(["teamA", "teamB"] as const).map((team) => (
          <Card
            key={team}
            className="bg-blue-900/50 border-blue-800 transform hover:scale-105 transition-transform duration-300"
          >
            <CardHeader>
              <CardTitle
                className={`${
                  team === "teamA" ? "text-blue-400" : "text-green-400"
                } text-xl font-bold`}
              >
                {currentGame[team].name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-blue-800">
                      <th className="p-2 text-left text-slate-300">Round</th>
                      <th className="p-2 text-center text-slate-400">Bid</th>
                      <th className="p-2 text-center text-slate-400">Won</th>
                      <th className="p-2 text-center text-slate-400">Bags</th>
                      <th className="p-2 text-right text-slate-300">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentGame.rounds.map((round) => (
                      <RoundInput
                        key={round.round}
                        round={round}
                        team={team}
                        onUpdate={updateRound}
                        disabled={currentGame.status === "completed"}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showCompleteModal && (
        <GameCompleteModal
          winner={
            totalScores.teamA > totalScores.teamB
              ? currentGame.teamA.name
              : currentGame.teamB.name
          }
          scores={totalScores}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};
