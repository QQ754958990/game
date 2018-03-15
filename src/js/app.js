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
    /**
     * 游戏配置
     */
    option: {
        begin_x: 310,//开始坐标X
        begin_y: 260,//开始坐标X
        min_x: 10,
        min_y: 10,
        max_x: 640,
        max_y: 540,
        distance: 2, //移动距离
        size: 50 //大小
    },
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
     * 灰机对象
     */
    plane: function () {
        var plan = new Image();//获取飞机图片实例
        plan.src = './src/img/plane.png';//飞机图片

        var option = this.option = GAME.option; //获取配置参数
        option.begin_x = (option.max_x) / 2; //开始X坐标
        option.begin_y = option.max_y;//开始Y坐标
        option.min_y = 540;//向上移动距离
        option.shoot = false; //是否需要发射子弹

        /**
         * 初始化
         * @returns {Promise}
         */
        this.init = function () {

            var myPromise = new Promise(function (resolve) {
                plan.onload = function () {
                    resolve(plan);
                };
            });

            return myPromise;
        };

        /**
         * 移动位置
         * @param plan_img
         */
        this.move = function (plan_img) {
            context.drawImage(plan_img, option.begin_x, option.begin_y, option.size, option.size);
            document.onkeydown = function (e) {
                var distance = option.distance = 5;//移动距离
                // 获取被按下的键值 (兼容写法)
                var key = e.keyCode || e.which || e.charCode;
                switch (key) {
                    case 38:  // 点击上方向键
                        if (option.begin_y >= option.min_y) {
                            option.begin_y -= distance;
                        }
                        break;

                    case 40:  // 点击下方向键
                        if (option.begin_y <= option.max_y) {
                            option.begin_y += distance;
                        }
                        break;

                    case 37: // 点击左方向键
                        if (option.begin_x >= option.min_x) {
                            option.begin_x -= distance;
                        }
                        break;

                    case 39: // 点击右方向键
                        if (option.begin_x <= option.max_x) {
                            option.begin_x += distance;
                        }
                        break;

                    case 32: // 点击空格
                        option.shoot = {
                            moveToX: option.begin_x + (option.size) / 2,
                            moveToY: option.begin_y,
                            size: option.size
                        };
                        break;
                }

                context.drawImage(plan_img, option.begin_x, option.begin_y, option.size, option.size);
            };
        };

        /**
         * 发射子弹
         */
        this.bullet = function () {
            if (!option.shoot) return; //不需要发射子弹

            if (option.shoot.moveToY >= 10) {

                context.beginPath();//绘制线条
                context.lineWidth = 1; //线宽
                context.strokeStyle = '#ffffff'; //颜色

                option.shoot.moveToY = option.shoot.moveToY -= 10;
                context.moveTo(option.shoot.moveToX, option.shoot.moveToY);

                option.shoot.moveToY = option.shoot.moveToY -= 10;
                context.lineTo(option.shoot.moveToX, option.shoot.moveToY);

                context.stroke();

                option.shoot = {
                    moveToX: option.shoot.moveToX,//开始坐标X
                    moveToY: option.shoot.moveToY,//开始坐标X
                    size: option.shoot.size
                };//更新坐标
            } else {
                option.shoot = false;//子弹发射完毕
            }
            ;

        }

        /**
         * 移除键盘事件
         */
        this.removeKeydown = function () {
            document.onkeydown = null;
        }

    },
    /**
     * 怪兽对象
     */
    monster: function () {

        var option = Object.assign({}, GAME.option); //获取配置参数
        option.begin_y = 0;//开始位置
        option.min_y = 540;//结束位置
        option.action = true; //怪兽是否需要行动
        var monster = new Image();//获取图片实例
        monster.src = './src/img/enemy.png';//怪物图片
        this.option = option;

        this.init = function () {

            var myPromise = new Promise(function (resolve) {
                monster.onload = function () {
                    resolve(monster);
                };
            });

            return myPromise;
        };

        this.move = function (monster_img) {
            if (!option.action) return;//是否显示怪兽

            var random_str = Math.random().toString(); //获取随机数
            option.mark = random_str; //标记

            var distance = option.distance; //移动距离
            //获取新坐标
            //0向上，1向下，2向左，3向右
            var num = parseInt(4 * Math.random());
            switch (num) {
                case 0: //向上移动
                    /*if (option.begin_y <= option.max_y) {
                        option.begin_y += distance;
                    }*/
                    break;
                case 1: //向下移动
                    if (option.begin_y <= option.min_y) {
                        option.begin_y += distance;
                    }
                    break;
                case 2: //向左移动
                    if (option.begin_x >= option.min_x) {
                        option.begin_x -= distance;
                    }
                    break;
                case 3: //向右移动
                    if (option.begin_x <= option.max_x) {
                        option.begin_x += distance;
                    }
                    break;
            }

            context.drawImage(monster_img, option.begin_x, option.begin_y, option.size, option.size);


        }
    },
    /**
     * 碰撞检测
     * @param rect1
     * @param rect2
     * @returns {boolean}
     */
    getCrash: function (model, rect1, rect2) {

        if (model === 'bullet') {
            // 判断四边是否都没有空隙
            if (!(rect2.begin_x + rect2.size < rect1.moveToX) &&
                !(rect1.moveToX + 1 < rect2.begin_x) &&
                !(rect2.begin_y + rect2.size < rect1.moveToY) &&
                !(rect1.moveToY + 10 < rect2.begin_y)) {
                // 物体碰撞了
                return true
            }
        } else if (model === 'line') {
            // 判断四边是否都没有空隙
            if (!(rect2.begin_x + rect2.size < 0) &&
                !(0 + 700 < rect2.begin_x) &&
                !(rect2.begin_y + rect2.size < 540) &&
                !(540 + 100 < rect2.begin_y)) {
                // 物体碰撞了
                return true
            }
        } else {
            // 判断四边是否都没有空隙
            if (!(rect2.begin_x + rect2.size < rect1.begin_x) &&
                !(rect1.begin_x + rect1.size < rect2.begin_x) &&
                !(rect2.begin_y + rect2.size < rect1.begin_y) &&
                !(rect1.begin_y + rect1.size < rect2.begin_y)) {
                // 物体碰撞了
                return true
            }
        }
        return false;
    },
    /**
     * 设置分数
     */
    setScore: function () {
        context.font = "18px Arial";
        context.strokeStyle = '#ffffff'; //颜色
        this.set = function (str) {
            context.strokeText("怪物：" + str, 20, 20);
        }
    },
    /**
     * 事件绑定
     */
    bindEvent: function () {
        var self = this;
        var playBtn = document.querySelector('.js-play');
        // 开始游戏按钮绑定
        playBtn.onclick = function () {
            self.play();
        };

        var nextBtn = document.querySelector('.js-next');
        // 继续游戏按钮绑定
        nextBtn.onclick = function () {
            self.play();
        };

        var rePlayBtn = document.querySelector('.js-replay');
        // 重新开始游戏按钮绑定
        rePlayBtn.onclick = function () {
            self.play();
        };
    },
    /**
     * 更新游戏状态，分别有以下几种状态：
     * start  游戏前
     * playing 游戏中
     * failed 游戏失败
     * success 游戏成功
     * success 游戏通过
     * stop 游戏暂停（可选）
     */
    setStatus: function (status) {
        this.status = status;
        container.setAttribute("data-status", status);
    },
    /**
     * 游戏开始
     */
    play: function () {
        var _self = this;
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
        var setScore = new GAME.setScore();

        var fry_img = new Image();//获取爆炸图片实例
        fry_img.src = './src/img/boom.png';//爆炸图片

        Promise.all([monster1.init(), monster2.init(), monster3.init(), monster4.init(), monster5.init(), monster6.init(), monster7.init(), plane.init()]).then(function (images) {

            fry_img.onload = function () {
                // ...
                var close = false;

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

                    for (var i = 0; i < monsters.length; i++) {
                        //判断是否突进飞机防线
                        var mark = GAME.getCrash('line', '可不传参', monsters[i].option); //是否与子弹碰撞
                        if (mark) {
                            close = true;
                            _self.setStatus('failed');
                            plane.removeKeydown();
                        };

                        //判断新坐标是否发生碰撞
                        if (plane.option.shoot) {
                            var mark = GAME.getCrash('bullet', plane.option.shoot, monsters[i].option); //是否与子弹碰撞
                            if (mark) { //射中怪兽
                                //子弹停止绘制
                                plane.option.shoot = false;
                                //飞机停止绘制
                                monsters[i].option.action = false;
                                //爆炸
                                context.clearRect(monsters[i].option.begin_x-10, monsters[i].option.begin_y-10, monsters[i].option.size+20, monsters[i].option.size+20);
                                context.drawImage(fry_img, monsters[i].option.begin_x, monsters[i].option.begin_y, monsters[i].option.size+20, monsters[i].option.size+20);

                                //不需要再循环此怪兽
                                monsters.splice(i, 1);
                            }
                        }

                    }

                    setScore.set(monsters.length);

                    if (!monsters.length) {
                        close = true;
                        _self.setStatus('success');
                        plane.removeKeydown();
                    }

                    if (!close) {
                        requestAnimationFrame(animation);
                    }
                };

                animation();
            }
        });


    }
};


// 初始化
GAME.init();
