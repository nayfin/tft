import { Point } from '@interactjs/types/types';

export interface Puck {
  location: Point;
  team: Team;
}

export interface Player {
  score: number;
}
export enum Team {
  RED = 'RED',
  BLUE = 'BLUE'
}

