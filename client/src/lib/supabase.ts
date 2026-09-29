import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (data.user) {
    await supabase.from("users").insert({
      id: data.user.id,
      username,
      email,
    });
  }
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function saveGameResult(game: {
  room_code: string;
  status: string;
  winner_id?: string;
  players: { user_id: string; color: string; final_position?: number }[];
}) {
  const { data, error } = await supabase.from("games").insert({
    room_code: game.room_code,
    status: game.status,
    winner_id: game.winner_id,
  }).select().single();

  if (error) throw error;

  for (const player of game.players) {
    await supabase.from("game_players").insert({
      game_id: data.id,
      user_id: player.user_id,
      color: player.color,
      final_position: player.final_position,
    });
  }

  return data;
}

export async function saveGameMove(move: {
  game_id: string;
  player_id: string;
  dice_value: number;
  piece_id: number;
  from_position: number;
  to_position: number;
}) {
  const { error } = await supabase.from("game_moves").insert(move);
  if (error) throw error;
}

export async function getGameHistory(userId: string) {
  const { data, error } = await supabase
    .from("game_players")
    .select("*, games(*)")
    .eq("user_id", userId)
    .order("joined_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
}
