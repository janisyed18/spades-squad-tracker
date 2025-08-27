import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, Users } from "lucide-react";
import { GameSetup } from "@/types/game";

interface FlexibleNewGameFormProps {
  onStartGame: (setup: GameSetup) => void;
  onCancel: () => void;
}

export const FlexibleNewGameForm = ({ onStartGame, onCancel }: FlexibleNewGameFormProps) => {
  const [teamA, setTeamA] = useState({ name: "Team A", players: ["", ""] });
  const [teamB, setTeamB] = useState({ name: "Team B", players: ["", ""] });
  const [maxRounds, setMaxRounds] = useState(13);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const setup: GameSetup = {
      teamA: {
        name: teamA.name,
        players: teamA.players.filter(p => p.trim() !== "")
      },
      teamB: {
        name: teamB.name,
        players: teamB.players.filter(p => p.trim() !== "")
      },
      maxRounds
    };
    onStartGame(setup);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card/60 backdrop-blur-sm border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Setup New Game</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
                  <CardHeader>
                    <CardTitle className="text-info flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Team A
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="teamA-name">Team Name</Label>
                      <Input
                        id="teamA-name"
                        value={teamA.name}
                        onChange={(e) => setTeamA(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Players</Label>
                      {teamA.players.map((player, index) => (
                        <Input
                          key={index}
                          value={player}
                          onChange={(e) => {
                            const newPlayers = [...teamA.players];
                            newPlayers[index] = e.target.value;
                            setTeamA(prev => ({ ...prev, players: newPlayers }));
                          }}
                          placeholder={`Player ${index + 1}`}
                          className="bg-background/50"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                  <CardHeader>
                    <CardTitle className="text-success flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Team B
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="teamB-name">Team Name</Label>
                      <Input
                        id="teamB-name"
                        value={teamB.name}
                        onChange={(e) => setTeamB(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Players</Label>
                      {teamB.players.map((player, index) => (
                        <Input
                          key={index}
                          value={player}
                          onChange={(e) => {
                            const newPlayers = [...teamB.players];
                            newPlayers[index] = e.target.value;
                            setTeamB(prev => ({ ...prev, players: newPlayers }));
                          }}
                          placeholder={`Player ${index + 1}`}
                          className="bg-background/50"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center gap-4">
                <Button type="button" onClick={onCancel} variant="outline">
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground"
                >
                  Continue to Seating
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};