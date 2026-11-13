import {
  Box,
  boxDelta,
  centerOf,
  Edge,
  edgePoint,
  offset,
  pointIn,
} from './geometry';

describe('geometry', () => {
  const box: Box = { x: 10, y: 20, width: 100, height: 50 };

  describe('centerOf', () => {
    it('should return the middle of the box', () => {
      expect(centerOf(box)).toEqual({ x: 60, y: 45 });
    });

    it('should return the origin for an empty box at the origin', () => {
      expect(centerOf({ x: 0, y: 0, width: 0, height: 0 })).toEqual({
        x: 0,
        y: 0,
      });
    });

    it('should handle a box with negative coordinates', () => {
      expect(centerOf({ x: -20, y: -10, width: 40, height: 20 })).toEqual({
        x: 0,
        y: 0,
      });
    });
  });

  describe('pointIn', () => {
    it('should return the top-left corner for fraction 0, 0', () => {
      expect(pointIn(box, { x: 0, y: 0 })).toEqual({ x: 10, y: 20 });
    });

    it('should return the centre for fraction 0.5, 0.5', () => {
      expect(pointIn(box, { x: 0.5, y: 0.5 })).toEqual(centerOf(box));
    });

    it('should return the bottom-right corner for fraction 1, 1', () => {
      expect(pointIn(box, { x: 1, y: 1 })).toEqual({ x: 110, y: 70 });
    });

    it('should apply each fraction to its own axis', () => {
      expect(pointIn(box, { x: 1, y: 0 })).toEqual({ x: 110, y: 20 });
      expect(pointIn(box, { x: 0, y: 1 })).toEqual({ x: 10, y: 70 });
      expect(pointIn(box, { x: 0.25, y: 0.5 })).toEqual({ x: 35, y: 45 });
    });
  });

  describe('offset', () => {
    it('should move a point by dx and dy', () => {
      expect(offset({ x: 5, y: 5 }, 3, 4)).toEqual({ x: 8, y: 9 });
    });

    it('should move a point by negative offsets', () => {
      expect(offset({ x: 5, y: 5 }, -10, -2)).toEqual({ x: -5, y: 3 });
    });

    it('should return an equal point for a zero offset', () => {
      expect(offset({ x: 5, y: 5 }, 0, 0)).toEqual({ x: 5, y: 5 });
    });

    it('should not mutate the point it was given', () => {
      const point = { x: 1, y: 2 };
      offset(point, 5, 5);
      expect(point).toEqual({ x: 1, y: 2 });
    });
  });

  describe('boxDelta', () => {
    it('should return zeros for identical boxes', () => {
      expect(boxDelta(box, { ...box })).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    });

    it('should return after minus before for every property', () => {
      expect(boxDelta(box, { x: 15, y: 30, width: 120, height: 60 })).toEqual({
        x: 5,
        y: 10,
        width: 20,
        height: 10,
      });
    });

    it('should return negative values when the box moved up/left and shrank', () => {
      expect(boxDelta(box, { x: 0, y: 0, width: 80, height: 40 })).toEqual({
        x: -10,
        y: -20,
        width: -20,
        height: -10,
      });
    });
  });

  describe('edgePoint', () => {
    // box spans x 10..110 and y 20..70, centre (60, 45)
    const expected: Record<Edge, { x: number; y: number }> = {
      top: { x: 60, y: 24 },
      right: { x: 106, y: 45 },
      bottom: { x: 60, y: 66 },
      left: { x: 14, y: 45 },
      'top-left': { x: 14, y: 24 },
      'top-right': { x: 106, y: 24 },
      'bottom-left': { x: 14, y: 66 },
      'bottom-right': { x: 106, y: 66 },
    };

    it.each(Object.keys(expected) as Edge[])(
      'should return the default-inset point for the %s edge',
      (edge) => {
        expect(edgePoint(box, edge)).toEqual(expected[edge]);
      }
    );

    it('should cover every Edge value', () => {
      expect(Object.keys(expected).sort()).toEqual(
        [
          'top',
          'right',
          'bottom',
          'left',
          'top-left',
          'top-right',
          'bottom-left',
          'bottom-right',
        ].sort()
      );
    });

    it('should use a custom inset', () => {
      expect(edgePoint(box, 'top-left', 10)).toEqual({ x: 20, y: 30 });
      expect(edgePoint(box, 'bottom-right', 10)).toEqual({ x: 100, y: 60 });
      expect(edgePoint(box, 'top', 10)).toEqual({ x: 60, y: 30 });
      expect(edgePoint(box, 'right', 10)).toEqual({ x: 100, y: 45 });
    });

    it('should put points on the box edge for an inset of 0', () => {
      expect(edgePoint(box, 'top-left', 0)).toEqual({ x: 10, y: 20 });
      expect(edgePoint(box, 'bottom-right', 0)).toEqual({ x: 110, y: 70 });
    });

    it('should centre edges along the other axis regardless of the inset', () => {
      expect(edgePoint(box, 'top', 0).x).toBe(centerOf(box).x);
      expect(edgePoint(box, 'bottom', 20).x).toBe(centerOf(box).x);
      expect(edgePoint(box, 'left', 0).y).toBe(centerOf(box).y);
      expect(edgePoint(box, 'right', 20).y).toBe(centerOf(box).y);
    });
  });
});
