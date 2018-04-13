

export default class  {

    // 元素
    container: HTMLDivElement;

    //获取去画布元素
    canvas: HTMLCanvasElement;

    //获取2D绘制对象
    context: CanvasRenderingContext2D;

    constructor() {
        this.container = document.getElementById('game') as HTMLDivElement;
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    }

    drawImg(img:HTMLImageElement,sx:number,sy:number,swidth:number,sheight:number){
        this.context.drawImage(img, sx, sy, swidth, sheight);
    }

    drawLine(){

    }
}