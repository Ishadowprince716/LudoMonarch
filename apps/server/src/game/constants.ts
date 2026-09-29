export type Color = "red" | "blue" | "green" | "yellow";

export const COLOR_MAP: Record<number, Color> = {
  0: "red",
  1: "blue",
  2: "green",
  3: "yellow",
};

export const HOME_OFFSETS: Record<Color, number> = {
  red: 52,
  blue: 53,
  green: 54,
  yellow: 55,
};

export const BOARD_SIZE = 52;
export const HOME_LANE_START = 52;
export const FINISHED_POSITION = 56;
export const PIECES_PER_PLAYER = 4;
export const MAX_PLAYERS = 4;