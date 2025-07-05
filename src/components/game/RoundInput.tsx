import { Round } from "@/types/game";
import { IntegerStepper } from "@/components/ui/IntegerStepper";

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
  const handleBidChange = (value: number) => {
    if (value < 0) {
      value = 0;
    } else if (value > round.round) {
      value = round.round;
    }
    const won = round[team].won;
    onUpdate(round.round, team, value, won);
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

  return (
    <tr className="border-b border-slate-700 hover:bg-slate-700/30">
      {/* Round column - black bold */}
      <td className="p-2 text-black font-bold">{round.round}</td>

      <td className="p-2">
        <IntegerStepper
          value={round[team].bid}
          onChange={(newValue) => handleBidChange(newValue)}
          max={round.round}
          disabled={disabled}
        />
      </td>
      <td className="p-2">
        <IntegerStepper
          value={round[team].won}
          onChange={(newValue) => handleWonChange(newValue)}
          max={round.round}
          disabled={disabled}
        />
      </td>
      {/* Bags column - black bold */}
      <td className="p-2 text-center text-black font-bold">
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
