export interface PlayCell {
  color: "red" | "blue" | "green" | "yellow";
  checked: boolean;
  id: number;
  parentId: number;
}

export interface PlayRow {
  id: number;
  children: PlayCell[];
}

export enum Colors {
  red,
  blue,
  green,
  yellow,
  purple,
}
