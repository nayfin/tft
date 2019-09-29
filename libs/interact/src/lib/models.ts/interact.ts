export interface TftDraggable {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  width?: number;
  height?: number;
  targetElement: any;
}
export interface Delta {
  deltaX: number | null;
  deltaY: number | null;
  targetElement: any | null;
}

export interface Position {
  x: number | null;
  y: number | null;
  targetElement: any | null;
}

export interface Size {
  width: number | null; 
  height: number | null; 
  targetElement: any;
}