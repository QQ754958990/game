import * as $ from 'jquery';
import Move from './move';
import Canvas from '../model/canvas';
import '../img/enemy.png';

type coord = { x: number, y: number };

const canvas = new Canvas();

export class Monster extends Move {
    name: string;
    mark: number;
    time: number;

    coord: {
        x: number,//开始坐标X
        y: number//开始坐标y
    };


    constructor(begin_x: number, begin_y: number) {
        super();
        this.name = 'monster';
        this.coord = {
            x: begin_x,
            y: begin_y
        };
        this.mark = 0;
        this.time = 0;

    }

    /**
     * 初始化怪兽图片
     */
    static getMonsterImg() {
        const def = $.Deferred();

        //获取图片实例
        const monster_element = new Image();
        monster_element.src = '/src/img/enemy.png';
        monster_element.onload = function () {
            def.resolve(monster_element)
        };

        return def.promise();
    }

    getRandom() {
        return parseInt(4 * Math.random() + '');
    }

    drawImg(imag_element: HTMLImageElement) {
        const self = this;

        switch (this.mark) {
            case 0:  // 点击上方向键
                self.up(self.coord);
                break;

            case 1:  // 点击下方向键
                self.down(self.coord);
                break;

            case 2: // 点击左方向键
                self.left(self.coord);
                break;

            case 3: // 点击右方向键
                self.right(self.coord);
                break;

        }

        canvas.drawImg(imag_element, this.coord.x, this.coord.y, this.size, this.size)


        this.time = this.getRandom();

        if (this.time / 3 === 0) {
            this.mark = this.getRandom();
        }
    }

    up<T extends coord>(geo: T): T {

        if (geo.y > this.min_y) {  //是否移动到顶端
            geo.y -= this.distance;
        } else {
            this.mark = this.getRandom();
        }
        return geo;
    }

    down<T extends coord>(geo: T): T {
        if (geo.y < this.max_y) {  //是否移动到底端
            geo.y += this.distance;
        } else {
            this.mark = this.getRandom();
        }
        return geo;
    }

    left<T extends coord>(geo: T): T {
        if (geo.x > this.min_x) {  //是否移动到左端
            geo.x -= this.distance;
        } else {
            this.mark = this.getRandom();
        }
        return geo;
    }

    right<T extends coord>(geo: T): T {
        if (geo.x < this.max_x) {  //是否移动到右端
            geo.x += this.distance;
        } else {
            this.mark = this.getRandom();
        }
        return geo;
    }
}

