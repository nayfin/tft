import { Team, Player } from '../../models/shuffleboard.model';

export const initialGameState: {[key in Team]: Player} = {
  'RED': {
    score: 0,
    pucksRemaining: 3,
    pucks: {
      a: {
        startLocation: { x: 10, y: 20},
        location: {x: 10, y: 20}
      },
      b: {
        startLocation: { x: 10, y: 25},
        location: {x: 10, y: 25}

      },
      c: {
        startLocation: { x: 10, y: 30},
        location: {x: 10, y: 30}

      }
    }
  },
  'BLUE': {
    score: 0,
    pucksRemaining: 3,
    pucks: {
      a: {
        startLocation: { x: 10, y: 120},
        location: {x: 10, y: 120}
      },
      b: {
        startLocation: { x: 10, y: 125},
        location: {x: 10, y: 125}
      },
      c: {
        startLocation: { x: 10, y: 130},
        location: {x: 10, y: 130}
      }
    }
  }
};