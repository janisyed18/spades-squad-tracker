import { Input } from "@/components/ui/input";
import { Round } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface RoundInputProps {
  round: Round;
  onUpdate: (
    roundNumber: number,
    team: "teamA" | "teamB",
    bid: number,
    won: number
  ) => void;
  disabled?: boolean;
  team: "teamA" | "teamB";
}

export const RoundInput = ({
  round,
  onUpdate,
  disabled = false,
  team,
}: RoundInputProps) => {
  const handleBidChange = (value: string) => {
    const bid = parseInt(value, 10);
    if (isNaN(bid) || bid < 0) {
      onUpdate(round.round, team, 0, round[team].won);
    } else if (bid > round.round) {
      onUpdate(round.round, team, round.round, round[team].won);
    } else {
      onUpdate(round.round, team, bid, round[team].won);
    }
  };

  const handleWonChange = (value: number) => {
    if (value < 0) {
      value = 0;
    } else if (value > round.round) {
      value = round.round;
    }
    const bid = round[team].bid;
    onUpdate(round.round, team, bid, value);
  };

  const IntegerStepper = ({ value, onChange, max }) => {
    return (
      <div className="flex items-center justify-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(value - 1)}
          disabled={disabled || value <= 0}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{value}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(value + 1)}
          disabled={disabled || value >= max}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <tr className="border-b border-slate-700 hover:bg-slate-700/30">
      <td className="p-2 text-white font-medium">{round.round}</td>

      <td className="p-2">
        <Input
          type="number"
          min="0"
          max={round.round}
          placeholder="0"
          value={round[team].bid || ""}
          onChange={(e) => handleBidChange(e.target.value)}
          className="w-16 h-8 bg-slate-700 border-slate-600 text-white text-center"
          disabled={disabled}
        />
      </td>
      <td className="p-2">
        <IntegerStepper
          value={round[team].won}
          onChange={(newValue) => handleWonChange(newValue)}
          max={round.round}
        />
      </td>
      <td className="p-2 text-center text-yellow-400">
        {round[team].bags > 0 ? round[team].bags : "-"}
      </td>
      <td className="p-2 text-center">
        <span
          className={round[team].score >= 0 ? "text-green-400" : "text-red-400"}
        >
          {round[team].score || 0}
        </span>
      </td>
    </tr>
  );
};
