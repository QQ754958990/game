import * as $ from 'jquery';
import Move from './move';
import Canvas from '../model/canvas';
import {Bullet} from "./bullet";
import '../img/plane.png';

const canvas = new Canvas();


export class Plane extends Move {
    name: string;
    direction: string;
    bullets: any[];
    coord: {
        x: number,//开始坐标X
        y: number//开始坐标y
    };


    constructor(begin_x: number, begin_y: number) {
        super();
        this.initEvent();
        this.name = 'plan';
        this.coord = {
            x: begin_x,
            y: begin_y
        };
        this.distance = 10;
        this.direction = 'up';
        this.bullets = [];
    }

    /**
     * 初始化飞机图片
     */
    static getPlaneImg() {
        const def = $.Deferred();

        //获取飞机图片实例
        const plan_element = new Image();
        plan_element.src = './src/img/plane.png';
        plan_element.onload = function () {
            def.resolve(plan_element)
        };

        return def.promise();
    }

    drawImg(imag_element: HTMLImageElement) {
        let self = this;
        canvas.drawImg(imag_element, self.coord.x, self.coord.y, self.size, self.size);

    }

    initEvent() {
        const self = this;
        let key_code:number = 0;
        //设置一个定时，时间为50左右，不要太高也不要太低
        setInterval(function(){

            switch (key_code) {
                case 38:  // 点击上方向键
                    self.up(self.coord);
                    self.direction = 'up';
                    break;

                case 40:  // 点击下方向键
                    self.down(self.coord);
                    self.direction = 'down';
                    break;

                case 37: // 点击左方向键
                    self.left(self.coord);
                    self.direction = 'left';
                    break;

                case 39: // 点击右方向键
                    self.right(self.coord);
                    self.direction = 'right';
                    break;

                case 32: // 点击空格
                    let bullet = new Bullet(self.coord.x + 25, self.coord.y, self.direction);
                    self.bullets.push(bullet); //添加需要发射的子弹
                    break;
            }
        },50);

        document.onkeydown = function (e) {

            // 获取被按下的键值 (兼容写法)
            key_code = e.keyCode || e.which || e.charCode;

        };

        //执行完后，所有对应变量恢复为false，保持静止不动
        document.onkeyup = function(e){

            let keyCode = e.keyCode || e.which || e.charCode;

            switch(keyCode){
                case 37:
                    key_code = 0;
                    break;
                case 38:
                    key_code = 0;
                    break;
                case 39:
                    key_code = 0;
                    break;
                case 40:
                    key_code = 0;
                    break;
            }
        }


    }
}

