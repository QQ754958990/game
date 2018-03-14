// 元素
var container = document.getElementById('game');
//获取去画布元素
var canvas = document.getElementById("canvas");
//获取2D绘制对象
var context = canvas.getContext("2d");

/**
 * 整个游戏对象
 */
var GAME = {
    data: {
        begin_x: 310,//开始坐标X
        begin_y: 260,//开始坐标X
        min_x: 10,
        min_y: 10,
        max_x: 640,
        max_y: 540,
        distance: 2, //移动距离
        size: 50, //大小
    },
    plan: {},//飞机
    bullets: {
        begin_x: 0,//开始坐标X
        begin_y: 0,//开始坐标X
        size:0
    },//子弹
    monsters: {},//所有怪兽
    /**
     * 初始化函数,这个函数只执行一次
     * @param  {object} opts
     * @return {[type]}      [description]
     */
    init: function (opts) {
        this.status = 'start'; //游戏状态
        this.bindEvent(); //绑定事件
    },
    /**
     * 怪兽对象
     */
    monster: function () {

        var data = Object.assign({}, GAME.data); //获取配置参数
        data.action = true;
        var monster = new Image();//获取图片实例
        monster.src = './src/img/enemy.png';//怪物图片
        this.data = data;

        this.init = function () {

            var myPromise = new Promise(function (resolve) {
                monster.onload = function () {
                    resolve(monster);
                };
            });

            return myPromise;
        };

        this.move = function (monster_img) {
            if(!data.action) return;//是否显示怪兽

            var random_str = Math.random().toString(); //获取随机数

            var distance = data.distance; //移动距离
            //获取新坐标
            //0向上，1向下，2向左，3向右
            var num = parseInt(4 * Math.random());
            switch (num) {
                case 0: //向上移动
                    if (data.begin_y <= data.max_y) {
                        data.begin_y += distance;
                    }
                    break;
                case 1: //向下移动
                    if (data.begin_y >= data.min_y) {
                        data.begin_y -= distance;
                    }
                    break;
                case 2: //向左移动
                    if (data.begin_x >= data.min_x) {
                        data.begin_x -= distance;
                    }
                    break;
                case 3: //向右移动
                    if (data.begin_x <= data.max_x) {
                        data.begin_x += distance;
                    }
                    break;
            }

            context.drawImage(monster_img, data.begin_x, data.begin_y, data.size, data.size);

            data.mark = random_str; //标记
            GAME.monsters[random_str] = data; //更新坐标

        }
    },
    /**
     * 灰机对象
     */
    plane: function () {
        var data = Object.assign({}, GAME.data); //获取配置参数
        data.begin_x = (data.max_x) / 2;
        data.begin_y = data.max_y;
        var plan = new Image();//获取飞机图片实例
        plan.src = './src/img/plane.png';//飞机图片
        var shoot = null; //是否需要发射子弹

        this.init = function () {

            var myPromise = new Promise(function (resolve) {
                plan.onload = function () {
                    resolve(plan);
                };
            });

            return myPromise;
        };

        this.move = function (plan_img) {
            context.drawImage(plan_img, data.begin_x, data.begin_y, data.size, data.size);
            document.onkeydown = function (e) {
                var distance = data.distance = 5;//移动距离
                // 获取被按下的键值 (兼容写法)
                var key = e.keyCode || e.which || e.charCode;
                switch (key) {
                    case 40:  // 点击上方向键
                        if (data.begin_y <= data.max_y) {
                            data.begin_y += distance;
                        }
                        break;

                    case 38:  // 点击下方向键
                        if (data.begin_y >= data.min_y) {
                            data.begin_y -= distance;
                        }
                        break;

                    case 37: // 点击左方向键
                        if (data.begin_x >= data.min_x) {
                            data.begin_x -= distance;
                        }
                        break;

                    case 39: // 点击右方向键
                        if (data.begin_x <= data.max_x) {
                            data.begin_x += distance;
                        }
                        break;
                    case 32: // 点击空格
                        shoot = {
                            moveToX: data.begin_x + (data.size) / 2,
                            moveToY: data.begin_y,
                            size:1
                        };
                        break;
                }

                context.drawImage(plan_img, data.begin_x, data.begin_y, data.size, data.size);
            };
        };

        this.bullet = function () {
            if (!shoot) return; //不需要发射子弹
            var option = shoot; //添加配置数据
            var moveToX = option.moveToX;
            option.moveToY = option.moveToY -= 10;
            var moveToY = option.moveToY;

            var lineToX = option.moveToX;
            option.moveToY = option.moveToY -= 10;
            var lineToY = option.moveToY;

            if (option.moveToY >= 10) {

                GAME.bullets = option;//更新坐标

                context.beginPath();//绘制线条
                context.lineWidth = 1; //线宽
                context.strokeStyle = '#ffffff'; //颜色

                context.moveTo(moveToX, moveToY);
                context.lineTo(lineToX, lineToY);
                context.stroke();

            } else {
                shoot = null;//子弹发射完毕
            };

        }

    },
    /**
     * 碰撞检测
     * @param rect1
     * @param rect2
     * @returns {boolean}
     */
    crash: function (rect1, rect2) {

        // 判断四边是否都没有空隙
        if (!(rect2.begin_x + rect2.size < rect1.begin_x) &&
            !(rect1.begin_x + rect1.size < rect2.begin_x) &&
            !(rect2.begin_y + rect2.size < rect1.begin_y) &&
            !(rect1.begin_y + rect1.size < rect2.begin_y)) {
            // 物体碰撞了

            return true
        }

        return false;
    },
    bindEvent: function () {
        var self = this;
        var playBtn = document.querySelector('.js-play');
        // 开始游戏按钮绑定
        playBtn.onclick = function () {
            self.play();
        };
    },
    /**
     * 更新游戏状态，分别有以下几种状态：
     * start  游戏前
     * playing 游戏中
     * failed 游戏失败
     * success 游戏成功
     * all-success 游戏通过
     * stop 游戏暂停（可选）
     */
    setStatus: function (status) {
        this.status = status;
        container.setAttribute("data-status", status);
    },
    play: function () {
        this.setStatus('playing');

        var monster1 = new GAME.monster();
        var monster2 = new GAME.monster();
        var monster3 = new GAME.monster();
        var monster4 = new GAME.monster();
        var monster5 = new GAME.monster();
        var monster6 = new GAME.monster();
        var monster7 = new GAME.monster();
        var monsters = [monster1, monster2, monster3, monster4, monster5, monster6, monster7];
        var plane = new GAME.plane();

        Promise.all([monster1.init(), monster2.init(), monster3.init(), monster4.init(), monster5.init(), monster6.init(), monster7.init(), plane.init()]).then(function (images) {
            // ...
            var globalID;
            var data = GAME.data; //获取配置参数

            function animation() {
                context.clearRect(0, 0, canvas.width, canvas.height);

                monster1.move(images[0]);
                monster2.move(images[1]);
                monster3.move(images[2]);
                monster4.move(images[3]);
                monster5.move(images[4]);
                monster6.move(images[5]);
                monster7.move(images[6]);

                plane.move(images[7]);
                plane.bullet();//发射子弹


                globalID = requestAnimationFrame(animation);
            };
            globalID = requestAnimationFrame(animation);
        });

    }
};


// 初始化
GAME.init();
