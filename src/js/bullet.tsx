import Canvas from '../model/canvas'

type bullet_coord = { x: number, y: number };

export class Bullet extends Canvas {
    name: string;
    coord: bullet_coord;
    direction: string;

    constructor(begin_x: number, begin_y: number,direction:string) {
        super();
        this.name = 'bullet';
        this.coord = {
            x: begin_x,
            y: begin_y,
        };
        this.direction = direction;
    }

    shoot() {
        this.context.beginPath();//绘制线条
        this.context.lineWidth = 1; //线宽
        this.context.strokeStyle = '#ffffff'; //颜色

        this.context.moveTo(this.coord.x, this.coord.y);


        switch (this.direction) {
            case 'up':
                this.coord.y = this.coord.y -= 10;
                this.context.lineTo(this.coord.x, this.coord.y);

                break;
            case 'down':
                this.coord.y = this.coord.y += 10;
                this.context.lineTo(this.coord.x, this.coord.y);

                break;
            case 'left':
                this.coord.x = this.coord.x -= 10;
                this.context.lineTo(this.coord.x, this.coord.y);

                break;
            case 'right':
                this.coord.x = this.coord.x += 10;
                this.context.lineTo(this.coord.x, this.coord.y);

                break;
        }


        this.context.stroke();

        return this.coord;
    }


}