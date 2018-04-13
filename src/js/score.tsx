
import Canvas from '../model/canvas';

export  class Score extends Canvas{

    mark:number;

    constructor(){
        super();
        this.mark = 0;
        this.context.font = "18px Arial";
        this.context.strokeStyle = '#ffffff'; //颜色
    }

    add(num:number){
        this.mark = this.mark+ num;
    }

    show(){
        this.context.strokeText( '分数:'+this.mark, 20, 20);
    }
    showLevel(leve:number){
        this.context.strokeText( '第'+leve+'关', 150, 20);
    }
}