class SButton extends Clickable {
    constructor(centerX, centerY, width, height,initImg,finalImg,text) {
        super()
        //memorize variable
        this.rectMode = CENTER;
        this.originWidth = width;
        this.originHeight = height;
        this.initImg=initImg;
        this.finalImg=finalImg;
        this.hovering=false;
        this.counter=0;
        //assign to the object
        if(this.initImg){
            this.fitImage = true
            this.image=this.initImg;
            this.imageScale=0.8;
        }
        this.text=text;
        this.x=centerX;
        this.y=centerY;
        this.width = width;
        this.height = height;
        this.strokeWeight = 0;

        this.onHover = () => {
            //console.log("Hover")
            if(this.hovering==false){
                this.hovering=true;
                this.counter=0;
            }
            if(this.counter/10>=1){return;}
            this.width = lerp(this.originWidth,this.originWidth * 1.1,this.counter/10);
            this.height = lerp(this.originHeight,this.originHeight * 1.1,this.counter/10);
            this.counter+=1;
        }
        this.onOutside = () => {
            //console.log("Release");
            if(this.hovering==true){
                this.hovering=false;
                this.counter=0;
            }
            if(this.counter/10>=1){return;}
            this.width = lerp(this.originWidth*1.1,this.originWidth,this.counter/10);
            this.height = lerp(this.originHeight*1.1,this.originHeight,this.counter/10);
            this.counter+=1;
        }
    }

    setLocation(x, y) {
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
    }
    reset(){
        this.hovering=false;
        this.counter=0;
        this.image=this.initImg;
    }

}