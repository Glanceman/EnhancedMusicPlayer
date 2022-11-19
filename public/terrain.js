class Terrain extends SObject {
    constructor(w, d, x = 0, y = 0, z = 0, rows, cols,boxSize) {
        super(w, 0, d, x, y, z)
        this.rows = rows;
        this.cols = cols;
        this.deltaWidth = this.width / this.cols;
        this.deltaHeight = this.depth / this.rows;
        this.boxSize=boxSize;
        this.signal=new Array(rows).fill(0);
       
    }

    inputSignal(signal){
        if(frameCount%3!=0){return }
        for(let i=this.signal.length-1; i>0;i--){
            this.signal[i]=lerp(this.signal[i],this.signal[i-1],0.9);
        }
        this.signal[0]=lerp(this.signal[0],signal,0.9);
        //console.log(this.signal);
    }

    render() {
        push()
        translate(this.location.x, this.location.y, this.location.z)
        rotateX(90);
        translate(-this.width / 2, -this.depth / 2, 0);
        for (let col = 0; col < this.cols; col++) {
            for (let row = 0; row < this.rows; row++) {
                push()
                translate(this.deltaWidth * col + this.deltaWidth / 2, this.deltaHeight * row + this.deltaHeight / 2, 0)
                box(this.boxSize);
                pop()
            }
        }
        pop()
    }

    render(canvas) {
        
        canvas.push()
        canvas.translate(this.location.x, this.location.y, this.location.z)
        canvas.rotateX(90);
        canvas.translate(-this.width / 2, -this.depth / 2, 0);
        for (let col = 0; col < this.cols; col++) {
            for (let row = 0; row < this.rows; row++) {
                canvas.push()
                let depth= map(this.signal[this.signal.length-1-row],0.05,0.8,-500,500)
                canvas.colorMode(HSB)
                canvas.fill(180,map(depth,-500,500,20,255),map(depth,-500,500,20,255));
                canvas.translate(this.deltaWidth * col + this.deltaWidth / 2, this.deltaHeight * row + this.deltaHeight / 2, depth)
                canvas.box(this.boxSize);
                canvas.pop()
            }
        }
        canvas.pop()
    }
}