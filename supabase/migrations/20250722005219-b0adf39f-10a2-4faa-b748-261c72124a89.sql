-- Create new tables to support multiple teams
-- First, create a new teams table
CREATE TABLE public.teams (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id uuid NOT NULL,
  team_number integer NOT NULL,
  team_name text NOT NULL,
  players text[] DEFAULT '{}',
  theme_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Create policies for teams table
CREATE POLICY "Users can view teams for their games"
ON public.teams
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM games
  WHERE games.id = teams.game_id
  AND games.user_id = auth.uid()
));

CREATE POLICY "Users can create teams for their games"
ON public.teams
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM games
  WHERE games.id = teams.game_id
  AND games.user_id = auth.uid()
));

CREATE POLICY "Users can update teams for their games"
ON public.teams
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM games
  WHERE games.id = teams.game_id
  AND games.user_id = auth.uid()
));

CREATE POLICY "Users can delete teams for their games"
ON public.teams
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM games
  WHERE games.id = teams.game_id
  AND games.user_id = auth.uid()
));

-- Create new team_rounds table to replace the hardcoded teamA/teamB structure
CREATE TABLE public.team_rounds (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id uuid NOT NULL,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  round_number integer NOT NULL,
  bid integer DEFAULT 0,
  won integer DEFAULT 0,
  bags integer DEFAULT 0,
  score integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(game_id, team_id, round_number)
);

-- Enable RLS
ALTER TABLE public.team_rounds ENABLE ROW LEVEL SECURITY;

-- Create policies for team_rounds table
CREATE POLICY "Users can view team rounds for their games"
ON public.team_rounds
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM games
  WHERE games.id = team_rounds.game_id
  AND games.user_id = auth.uid()
));

CREATE POLICY "Users can create team rounds for their games"
ON public.team_rounds
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM games
  WHERE games.id = team_rounds.game_id
  AND games.user_id = auth.uid()
));

CREATE POLICY "Users can update team rounds for their games"
ON public.team_rounds
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM games
  WHERE games.id = team_rounds.game_id
  AND games.user_id = auth.uid()
));

CREATE POLICY "Users can delete team rounds for their games"
ON public.team_rounds
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM games
  WHERE games.id = team_rounds.game_id
  AND games.user_id = auth.uid()
));

-- Add team_count to games table to track how many teams are in each game
ALTER TABLE public.games ADD COLUMN team_count integer DEFAULT 2;