import Option_data, {default as option_data} from '../model/option_data'

type coord = { x: number, y: number };

export default class Move extends Option_data {
    level:number;//等级
    constructor() {
        super();
        this.level = 1;
    }

    addLevel(level:number){
        this.level  = level;
        this.distance = this.distance + level;

    }

    up<T extends coord>(geo: T): T {

        if (geo.y > this.min_y) {  //是否移动到顶端
            geo.y -= this.distance;
        } else {
            geo.y += this.distance;
        }
        return geo;
    }

    down<T extends coord>(geo: T): T {
        if (geo.y < this.max_y) {  //是否移动到底端
            geo.y += this.distance;
        } else {
            geo.y -= this.distance;
        }
        return geo;
    }

    left<T extends coord>(geo: T): T {
        if (geo.x > this.min_x) {  //是否移动到左端
            geo.x -= this.distance;
        } else {
            geo.x += this.distance;
        }
        return geo;
    }

    right<T extends coord>(geo: T): T {
        if (geo.x < this.max_x) {  //是否移动到右端
            geo.x += this.distance;
        } else {
            geo.x -= this.distance;
        }
        return geo;
    }
}