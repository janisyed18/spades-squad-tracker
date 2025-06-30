
import { Input } from '@/components/ui/input';
import { Round } from '@/types/game';

interface RoundInputProps {
  round: Round;
  onUpdate: (roundNumber: number, team: 'teamA' | 'teamB', bid: number, won: number) => void;
  disabled?: boolean;
}

export const RoundInput = ({ round, onUpdate, disabled = false }: RoundInputProps) => {
  const handleBidChange = (team: 'teamA' | 'teamB', value: string) => {
    const bid = parseInt(value) || 0;
    const won = round[team].won;
    onUpdate(round.round, team, bid, won);
  };

  const handleWonChange = (team: 'teamA' | 'teamB', value: string) => {
    const won = parseInt(value) || 0;
    const bid = round[team].bid;
    onUpdate(round.round, team, bid, won);
  };

  return (
    <tr className="border-b border-slate-700 hover:bg-slate-700/30">
      <td className="p-2 text-white font-medium">{round.round}</td>
      
      {/* Team A */}
      <td className="p-2">
        <Input
          type="number"
          min="0"
          max="13"
          value={round.teamA.bid || ''}
          onChange={(e) => handleBidChange('teamA', e.target.value)}
          className="w-16 h-8 bg-slate-700 border-slate-600 text-white text-center"
          disabled={disabled}
        />
      </td>
      <td className="p-2">
        <Input
          type="number"
          min="0"
          max="13"
          value={round.teamA.won || ''}
          onChange={(e) => handleWonChange('teamA', e.target.value)}
          className="w-16 h-8 bg-slate-700 border-slate-600 text-white text-center"
          disabled={disabled}
        />
      </td>
      <td className="p-2 text-center text-yellow-400">
        {round.teamA.bags > 0 ? round.teamA.bags : '-'}
      </td>
      <td className="p-2 text-center">
        <span className={round.teamA.score >= 0 ? 'text-green-400' : 'text-red-400'}>
          {round.teamA.score || 0}
        </span>
      </td>
      
      {/* Team B */}
      <td className="p-2">
        <Input
          type="number"
          min="0"
          max="13"
          value={round.teamB.bid || ''}
          onChange={(e) => handleBidChange('teamB', e.target.value)}
          className="w-16 h-8 bg-slate-700 border-slate-600 text-white text-center"
          disabled={disabled}
        />
      </td>
      <td className="p-2">
        <Input
          type="number"
          min="0"
          max="13"
          value={round.teamB.won || ''}
          onChange={(e) => handleWonChange('teamB', e.target.value)}
          className="w-16 h-8 bg-slate-700 border-slate-600 text-white text-center"
          disabled={disabled}
        />
      </td>
      <td className="p-2 text-center text-yellow-400">
        {round.teamB.bags > 0 ? round.teamB.bags : '-'}
      </td>
      <td className="p-2 text-center">
        <span className={round.teamB.score >= 0 ? 'text-green-400' : 'text-red-400'}>
          {round.teamB.score || 0}
        </span>
      </td>
    </tr>
  );
};
