import { HoppingResult, MapType } from './types';

export class MapUtil {
  currentX: number;
  currentY: number;
  hitTrees: number;
  totalJumps: number;

  private jumpDistanceX: number;
  private jumpDistanceY: number;

  private readonly map: MapType;
  private readonly mapWidth: number;
  private readonly mapHeight: number;

  constructor(map: MapType) {
    this.map = map;

    this.mapWidth = this.map[0].length;
    this.mapHeight = this.map.length;
  }

  jumpToBottom(offsetX: number, offsetY: number, startX?: number, startY?: number): HoppingResult {
    this.currentX = startX ?? 0;
    this.currentY = startY ?? 0;
    this.hitTrees = 0;
    this.totalJumps = 0;
    this.jumpDistanceX = offsetX;
    this.jumpDistanceY = offsetY;

    while (this.currentY < this.mapHeight - 1) {
      this.jumpOnce();
    }

    return { totalJumps: this.totalJumps, hitTrees: this.hitTrees };
  }

  private jumpOnce() {
    this.currentX += this.jumpDistanceX;
    this.currentY += this.jumpDistanceY;

    if (this.map[this.currentY][this.currentX % this.mapWidth]) {
      ++this.hitTrees;
    }
    ++this.totalJumps;
  }
}
