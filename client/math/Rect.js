import { Vec2 } from './Vec2.js'





export class Rect {
    constructor(min_x, min_y, max_x, max_y) {
        this.min = new Vec2(min_x, min_y)
        this.max = new Vec2(max_x, max_y)
    }
}














