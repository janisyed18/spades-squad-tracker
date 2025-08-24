import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, Plus, X } from 'lucide-react';
import { GameSetup } from '@/types/game';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';

interface NewGameFormProps {
  onStartGame: (setup: GameSetup) => void;
  onCancel: () => void;
}

const playerSchema = z.object({ name: z.string().min(1, 'Player name is required') });
const teamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  players: z.array(playerSchema).min(1).max(10)
});
const gameSetupSchema = z.object({ teamA: teamSchema, teamB: teamSchema });
type GameSetupForm = z.infer<typeof gameSetupSchema>;

export const NewGameForm = ({ onStartGame, onCancel }: NewGameFormProps) => {
  const form = useForm<GameSetupForm>({
    resolver: zodResolver(gameSetupSchema),
    defaultValues: {
      teamA: { name: '', players: [{ name: '' }] },
      teamB: { name: '', players: [{ name: '' }] }
    }
  });

  const teamAPlayers = useFieldArray({ control: form.control, name: 'teamA.players' });
  const teamBPlayers = useFieldArray({ control: form.control, name: 'teamB.players' });

  const onSubmit = (values: GameSetupForm) => {
    const finalSetup: GameSetup = {
      teamA: {
        name: values.teamA.name.trim(),
        players: values.teamA.players.map(p => p.name.trim()).filter(Boolean)
      },
      teamB: {
        name: values.teamB.name.trim(),
        players: values.teamB.players.map(p => p.name.trim()).filter(Boolean)
      }
    };
    onStartGame(finalSetup);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          onClick={onCancel}
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-2xl font-bold text-white">Setup New Game</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Team A */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team A
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Enter team name and player names (up to 10 players)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="teamA.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Team Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Enter team name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Label className="text-slate-300">Players</Label>
                  {teamAPlayers.fields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name={`teamA.players.${index}.name` as const}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-slate-700 border-slate-600 text-white"
                                placeholder={`Player ${index + 1}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {teamAPlayers.fields.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => teamAPlayers.remove(index)}
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {teamAPlayers.fields.length < 10 && (
                    <Button
                      type="button"
                      onClick={() => teamAPlayers.append({ name: '' })}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Player
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Team B */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team B
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Enter team name and player names (up to 10 players)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="teamB.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Team Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Enter team name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Label className="text-slate-300">Players</Label>
                  {teamBPlayers.fields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name={`teamB.players.${index}.name` as const}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-slate-700 border-slate-600 text-white"
                                placeholder={`Player ${index + 1}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {teamBPlayers.fields.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => teamBPlayers.remove(index)}
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {teamBPlayers.fields.length < 10 && (
                    <Button
                      type="button"
                      onClick={() => teamBPlayers.append({ name: '' })}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Player
                    </Button>
                  )}
                </div>
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
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 px-8"
            >
              Start Game
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
