export enum MapObjectEnum {
  OPEN,
  TREE
}

export type MapRowType = MapObjectEnum[];

export type MapType = MapRowType[][];

export type HoppingResult = {
  totalJumps: number;
  hitTrees: number;
}
