import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Palette, ShoppingBag } from "lucide-react";
import { Team } from "@/types/game";

interface ScoreDisplayProps {
  teamA: Team;
  teamB: Team;
  scores: { teamA: number; teamB: number };
  bags: { teamA: number; teamB: number };
  winner?: string;
  createdAt?: Date;
  finishedAt?: Date;
  selectedThemes?: { teamA?: any; teamB?: any };
  onThemeSelect?: (team: "teamA" | "teamB") => void;
}

export const ScoreDisplay = ({
  teamA,
  teamB,
  scores,
  bags,
  winner,
  createdAt,
  finishedAt,
  selectedThemes,
  onThemeSelect,
}: ScoreDisplayProps) => {
  const formatDateTime = (date: Date): string => {
    return date.toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-4">
      {/* Game Times */}
      <div className="flex justify-between text-slate-400 text-sm">
        {createdAt && (
          <div className="text-left">Started: {formatDateTime(createdAt)}</div>
        )}
        {finishedAt && (
          <div className="text-right">
            Finished: {formatDateTime(finishedAt)}
          </div>
        )}
      </div>

      {/* Team Scores */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Team A Score */}
        <Card
          className={`relative border-2 transition-colors ${
            selectedThemes?.teamA?.background || ""
          } ${
            scores.teamA > scores.teamB
              ? "border-green-500 bg-green-900/20"
              : "border-slate-700 bg-slate-800/50"
          }`}
        >
          <CardContent className="p-6 pt-10">
            {onThemeSelect && (
              <Button
                onClick={() => onThemeSelect("teamA")}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
              >
                <Palette className="h-4 w-4" />
              </Button>
            )}

            <div className="flex items-center justify-between">
              {/* Left Section: Team Name & Icons */}
              <div className="flex items-center">
                <h3
                  className={`text-5xl font-bold ${
                    selectedThemes?.teamA?.text || "text-blue-400"
                  }`}
                >
                  {teamA.name}
                </h3>
                {winner === teamA.name && (
                  <Trophy className="h-5 w-5 text-yellow-400 ml-2" />
                )}
              </div>

              {/* Center Section: Score & Bags */}
              <div className="flex flex-col items-center">
                <div
                  className={`text-6xl font-bold ${
                    selectedThemes?.teamA?.accent || "text-white"
                  }`}
                >
                  {scores.teamA}
                </div>
                <div
                  className={`flex items-center text-sm ${
                    selectedThemes?.teamA?.accent || "text-yellow-400"
                  }`}
                >
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  {bags.teamA} bags
                </div>
              </div>

              {/* Right Section: Player Names */}
              {teamA.players.length > 0 && (
                <div
                  className={`text-sm ${
                    selectedThemes?.teamA?.text || "text-slate-400"
                  } max-w-[30%] text-left`}
                >
                  {teamA.players
                    .filter((p) => p)
                    .map((player, i) => (
                      <div key={i}>{player}</div>
                    ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Team B Score */}
        <Card
          className={`relative border-2 transition-colors ${
            selectedThemes?.teamB?.background || ""
          } ${
            scores.teamB > scores.teamA
              ? "border-green-500 bg-green-900/20"
              : "border-slate-700 bg-slate-800/50"
          }`}
        >
          <CardContent className="p-6 pt-10">
            {onThemeSelect && (
              <Button
                onClick={() => onThemeSelect("teamB")}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
              >
                <Palette className="h-4 w-4" />
              </Button>
            )}

            <div className="flex items-center justify-between">
              {/* Left Section: Team Name & Icons */}
              <div className="flex items-center">
                <h3
                  className={`text-5xl font-bold ${
                    selectedThemes?.teamB?.text || "text-green-400"
                  }`}
                >
                  {teamB.name}
                </h3>
                {winner === teamB.name && (
                  <Trophy className="h-5 w-5 text-yellow-400 ml-2" />
                )}
              </div>

              {/* Center Section: Score & Bags */}
              <div className="flex flex-col items-center">
                <div
                  className={`text-6xl font-bold ${
                    selectedThemes?.teamB?.accent || "text-white"
                  }`}
                >
                  {scores.teamB}
                </div>
                <div
                  className={`flex items-center text-sm ${
                    selectedThemes?.teamB?.accent || "text-yellow-400"
                  }`}
                >
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  {bags.teamB} bags
                </div>
              </div>

              {/* Right Section: Player Names */}
              {teamB.players.length > 0 && (
                <div
                  className={`text-sm ${
                    selectedThemes?.teamB?.text || "text-slate-400"
                  } max-w-[30%] text-left`}
                >
                  {teamB.players
                    .filter((p) => p)
                    .map((player, i) => (
                      <div key={i}>{player}</div>
                    ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
