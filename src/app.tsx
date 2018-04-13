import * as $ from 'jquery';
import './css/style.scss';
import Canvas from './model/canvas';
import {Plane} from './js/plane';
import {Monster} from './js/monster';
import {Bullet} from "./js/bullet";
import {Score} from "./js/score";
import './img/boom.png'

// 兼容定义
const requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 30);
    };

//设置分数
const score = new Score();

// 元素
const container: HTMLDivElement = document.getElementById('game') as HTMLDivElement; //主页面容器


/**
 * 整个游戏对象
 */
class GAME extends Canvas {

    //关卡
    level: number;

    //游戏进度
    static gameOver: boolean;

    //游戏元素
    feature: {
        plane: any,//飞机
        monsters: Monster[ ] //怪兽
    };

    //游戏状态
    status: string;

    /**
     * 初始化函数,这个函数只执行一次
     * @param  {object} opts
     * @return {[type]}      [description]
     */
    constructor() {
        super();
        this.level = 1;
        this.bindEvent();
        this.status = 'start';
        this.feature = {
            plane: {},
            monsters: []
        };

        GAME.gameOver = false;
    }

    /**
     * 绑定事件
     */
    bindEvent() {
        const self = this;
        const playBtn: HTMLButtonElement = document.querySelector('.js-play') as HTMLButtonElement;
        const resetBtn: HTMLButtonElement = document.querySelector('.js-replay') as HTMLButtonElement;
        const nextBtn: HTMLButtonElement = document.querySelector('.js-next') as HTMLButtonElement;
        // 开始游戏按钮绑定
        playBtn.onclick = function () {
            self.play();
        };

        //重新开始游戏
        resetBtn.onclick = function () {
            self.replay()
        }

        //继续游戏
        nextBtn.onclick = function () {
            $('.game-level').text('当前Level: ' + self.feature.plane.level);
            self.feature.plane.addLevel();//第N关
            self.next()
        }

    }

    /**
     * 更新游戏状态，分别有以下几种状态：
     * start  游戏前
     * playing 游戏中
     * failed 游戏失败
     * success 游戏成功
     * all-success 游戏通过
     * stop 游戏暂停（可选）
     */
    setStatus(status: string) {
        this.status = status;
        container.setAttribute("data-status", status);
    }


    /**
     * 添加元素
     */
    addFeature(level: number) {

        //游戏只有一架飞机
        const plane = new Plane(330, 500);

        //添加怪兽
        const monster1 = new Monster(150, 200);
        monster1.addLevel(level);
        const monster2 = new Monster(200, 200);
        monster2.addLevel(level);
        const monster3 = new Monster(250, 200);
        monster3.addLevel(level);
        const monster4 = new Monster(300, 200);
        monster4.addLevel(level);
        const monster5 = new Monster(350, 200);
        monster5.addLevel(level);
        const monster6 = new Monster(400, 200);
        monster6.addLevel(level);
        const monster7 = new Monster(450, 200);
        monster7.addLevel(level);

        this.feature.plane = plane;

        this.feature.monsters = [monster1, monster2, monster3, monster4, monster5, monster6, monster7];
    }

    /**
     * 移除元素
     */
    removeFeature(fry_element:HTMLImageElement) {
        const self = this;

        //判断碰撞
        self.feature.monsters.map(function (monster: Monster, monster_index: number) { //遍历怪兽
            const result_plan = self.getCrash(self.feature.plane.coord, monster.coord, null);
            if (result_plan) {
                self.over();//游戏结束
            }

            //遍历子弹
            const plane = self.feature.plane;
            plane.bullets.map(function (bullet: Bullet, bullet_index: number) {
                const result_bullet = self.getCrash(bullet.coord, monster.coord, bullet.direction);
                if (result_bullet) { //如果发生碰撞
                    self.feature.monsters.splice(monster_index, 1);//移除怪兽
                    plane.bullets.splice(bullet_index, 1);//移除子弹
                    self.context.drawImage(fry_element, monster.coord.x, monster.coord.y, 70, 70);//爆炸
                    score.add(1);//加分
                }

            });

            score.show();
            score.showLevel(self.level);
        });

        if (self.feature.monsters.length === 0) {
            GAME.gameOver = true;
            self.setStatus('success');
        }
    }

    /**
     * 碰撞检测
     * @param rect1
     * @param rect2
     * @returns {boolean}
     */
    getCrash(rect1: any, rect2: any, direction: string | null | undefined) {
        let mark = false, size = 50;

        if (direction) {
            if (direction === 'up' || direction === 'down') {
                if (!(rect2.x + size < rect1.x) &&
                    !(rect1.x + 1 < rect2.x) &&
                    !(rect2.y + size < rect1.y) &&
                    !(rect1.y + 10 < rect2.y)) {
                    // 物体碰撞了
                    mark = true;
                }
            } else {
                if (!(rect2.x + size < rect1.x) &&
                    !(rect1.x + 10 < rect2.x) &&
                    !(rect2.y + size < rect1.y) &&
                    !(rect1.y + 1 < rect2.y)) {
                    // 物体碰撞了
                    mark = true;
                }
            }

        } else {

            // 判断四边是否都没有空隙
            if (!(rect2.x + size < rect1.x) &&
                !(rect1.x + size < rect2.x) &&
                !(rect2.y + size < rect1.y) &&
                !(rect1.y + size < rect2.y)) {
                // 物体碰撞了
                mark = true;
            }
        }

        return mark;
    }


    /**
     * 开始游戏
     */
    play() {

        const self = this;
        this.addFeature(self.level);
        this.setStatus('playing');


        const fry_element = new Image();//获取爆炸图片实例
        fry_element.src = './src/img/boom.png';//爆炸图片


        fry_element.onload = function () {


            $.when(Plane.getPlaneImg(), Monster.getMonsterImg()).done(function (plan_element, monster_element) {
                // 动画执行函数
                function animate() {

                    // 清除画布
                    self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);


                    //绘制飞机和子弹
                    const plane = self.feature.plane;
                    plane.drawImg(plan_element);
                    plane.bullets.map(function (bullet: Bullet, bullet_index: number) {
                        if ( //判断是否在画布内
                        bullet.coord.x >= plane.min_x && bullet.coord.x <= plane.max_x + 50
                        && bullet.coord.y >= plane.min_y && bullet.coord.y <= plane.max_y
                        ) {
                            bullet.shoot();
                        } else {
                            plane.bullets.splice(bullet_index, 1);
                        }
                    });

                    //绘制怪兽
                    self.feature.monsters.map(function (monster: Monster, monster_index: number) {
                        monster.drawImg(monster_element);
                    });


                    self.removeFeature(fry_element);//清除元素

                    // 使用requestAnimationFrame实现动画循环
                    if (!GAME.gameOver) {
                        requestAnimFrame(animate);
                    }
                }

                // 执行animate
                animate();
            });

        };


    }

    /**
     * //重新开始游戏
     */
    replay() {
        GAME.gameOver = false;
        this.level = 1;
        score.mark = 0;//清分
        this.play();
    }

    /**
     * 继续游戏
     */
    next() {
        GAME.gameOver = false;
        this.level++;
        this.play();
    }

    /**
     * 结束游戏
     */
    over() {
        GAME.gameOver = true;
        this.setStatus('failed');
        $('.game-info-text').text(
            '游戏最终得分：' + score.mark//设置分数
        );
    }
};


// 初始化
const game = new GAME(); //他是一个类








