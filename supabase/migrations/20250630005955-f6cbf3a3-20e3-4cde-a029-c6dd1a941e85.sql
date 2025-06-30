
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create games table
CREATE TABLE public.games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  team_a_name TEXT NOT NULL,
  team_b_name TEXT NOT NULL,
  team_a_players TEXT[] DEFAULT '{}',
  team_b_players TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  winner TEXT,
  final_score_team_a INTEGER,
  final_score_team_b INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  finished_at TIMESTAMP WITH TIME ZONE
);

-- Create rounds table
CREATE TABLE public.rounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES public.games ON DELETE CASCADE NOT NULL,
  round_number INTEGER NOT NULL,
  team_a_bid INTEGER DEFAULT 0,
  team_a_won INTEGER DEFAULT 0,
  team_a_bags INTEGER DEFAULT 0,
  team_a_score INTEGER DEFAULT 0,
  team_b_bid INTEGER DEFAULT 0,
  team_b_won INTEGER DEFAULT 0,
  team_b_bags INTEGER DEFAULT 0,
  team_b_score INTEGER DEFAULT 0,
  UNIQUE(game_id, round_number)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rounds ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS policies for games
CREATE POLICY "Users can view their own games" ON public.games
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own games" ON public.games
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own games" ON public.games
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own games" ON public.games
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for rounds
CREATE POLICY "Users can view rounds for their games" ON public.rounds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.games 
      WHERE games.id = rounds.game_id 
      AND games.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create rounds for their games" ON public.rounds
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.games 
      WHERE games.id = rounds.game_id 
      AND games.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update rounds for their games" ON public.rounds
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.games 
      WHERE games.id = rounds.game_id 
      AND games.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete rounds for their games" ON public.rounds
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.games 
      WHERE games.id = rounds.game_id 
      AND games.user_id = auth.uid()
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
