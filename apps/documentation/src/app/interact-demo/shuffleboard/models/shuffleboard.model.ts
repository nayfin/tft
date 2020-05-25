import { Point } from '@interactjs/types/index';

export interface Puck {
  location?: Point;
  startLocation: Point;
  team?: Team;
}

export interface Player {
  score: number;
  pucksRemaining: number;
  pucks: { [key: string]: Puck};
}
export enum Team {
  RED = 'RED',
  BLUE = 'BLUE'
}

