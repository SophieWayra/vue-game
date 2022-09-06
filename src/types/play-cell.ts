export interface PlayCell {
  color: 'red' | 'blue' | 'green' | 'yellow';
  checked: boolean;
  rowIndex: number;
}

export enum Colors {
  red,
  blue,
  green,
  yellow,
}

