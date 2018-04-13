 interface Option {
    min_x: number,
    min_y: number,
    max_x: number,
    max_y: number,
    distance: number, //移动距离
    size: number //大小
}

 export default class  implements Option{
    min_x: number;
    min_y: number;
    max_x: number;
    max_y: number;
    distance: number; //移动距离
    size: number; //大小
    constructor() {
        this.min_x = 0;   //最小值
        this.min_y = 0;   //最小值
        this.max_x = 650;  //最大值
        this.max_y = 550;  //最大值
        this.distance = 2; //移动距离
        this.size = 50;    //大小
    }
}





