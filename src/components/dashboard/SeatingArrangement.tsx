import { useState, useMemo } from "react";
import { GameSetup } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowRight, Play, Star } from "lucide-react";

interface SeatingArrangementProps {
  setup: GameSetup;
  onStartGame: (setup: GameSetup) => void;
  onCancel: () => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const SeatingArrangement = ({
  setup,
  onStartGame,
  onCancel,
}: SeatingArrangementProps) => {
  const arrangedPlayers = useMemo(() => {
    const shuffledA = shuffleArray(setup.teamA.players);
    const shuffledB = shuffleArray(setup.teamB.players);
    const result: { name: string; team: "A" | "B" }[] = [];
    let i = 0;
    while (i < shuffledA.length || i < shuffledB.length) {
      if (i < shuffledA.length) {
        result.push({ name: shuffledA[i], team: "A" });
      }
      if (i < shuffledB.length) {
        result.push({ name: shuffledB[i], team: "B" });
      }
      i++;
    }
    return result;
  }, [setup]);

  const [startingPlayerIndex] = useState(
    Math.floor(Math.random() * arrangedPlayers.length)
  );

  const totalPlayers = arrangedPlayers.length;
  const angleStep = (2 * Math.PI) / totalPlayers;

  return (
    <div className="max-w-4xl mx-auto text-white">
      <h2 className="text-3xl font-bold text-center mb-8">
        Seating Arrangement
      </h2>

      <div className="flex justify-center items-center mb-12">
        <div className="relative w-96 h-96 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center">
          <div className="absolute text-slate-400 flex items-center">
            <span className="mr-2">Clockwise</span>
            <ArrowRight className="h-5 w-5" />
          </div>
          {arrangedPlayers.map((player, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const x = Math.cos(angle) * 160;
            const y = Math.sin(angle) * 160;
            const isStartingPlayer = index === startingPlayerIndex;

            return (
              <div
                key={index}
                className="absolute flex flex-col items-center"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              >
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-center p-2 ${
                    player.team === "A" ? "bg-blue-500/80" : "bg-green-500/80"
                  } ${
                    isStartingPlayer
                      ? "ring-4 ring-yellow-400 shadow-lg shadow-yellow-400/50"
                      : ""
                  }`}
                >
                  <span className="font-semibold">{player.name}</span>
                </div>
                {isStartingPlayer && (
                  <div className="absolute -top-6 flex items-center bg-yellow-400 text-black px-2 py-1 rounded-full text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Starter
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              {setup.teamA.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-slate-300">
              {setup.teamA.players.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              {setup.teamB.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-slate-300">
              {setup.teamB.players.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-4 justify-center">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          Back to Setup
        </Button>
        <Button
          onClick={() => onStartGame(setup)}
          className="bg-green-600 hover:bg-green-700 px-8 flex items-center"
        >
          <Play className="h-5 w-5 mr-2" />
          Start Game
        </Button>
      </div>
    </div>
  );
};
