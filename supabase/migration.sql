# Supabase Database Migration — Ludo Monarch
# Run in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting',
  winner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);

CREATE TABLE game_players (
  game_id UUID REFERENCES games(id),
  user_id UUID REFERENCES users(id),
  color TEXT NOT NULL,
  final_position INT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (game_id, user_id)
);

CREATE TABLE game_moves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id),
  player_id UUID REFERENCES users(id),
  dice_value INT NOT NULL,
  piece_id INT NOT NULL,
  from_position INT,
  to_position INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);