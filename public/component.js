class Component extends SObject{
    constructor(w,h,d,x=0,y=0,z=0){
        super(w,h,d,x,y,z)
        this.lineCubes=[];
        this.counter=0;
        for (let i = 0; i < 10; i++) {
            let angle = round(map(i, 0, 10, 0, 360));
            let r = 500
            let rX = r * cos(angle);
            let rY = r * sin(angle);
            let lineCube=new LineObjects(x+rX,y+rY,-100,2,100);
            lineCube.setRotation(0,0,angle-90);
            this.lineCubes.push(lineCube);
        }
    }

    update(spectrum){
        for (let i = 0; i < this.lineCubes.length; i++) {
            //let frequency= map(i,0,this.lineCubes.length,0,spectrum.length);
            //let frequencyAmp=map(spectrum[frequency],0,255,0,10);
            let angle = round(map(i, 0, 10, 0, 360))+this.counter;
            let r = 500
            let rX = r * cos(angle);
            let rY = r * sin(angle);
            this.lineCubes[i].setLocation(this.location.x+rX,this.location.y+rY,-100)
            this.lineCubes[i].setRotation(0,0,angle-90)
        }
        this.counter++;
    }

    render(){
        this.update();
        push()
        translate(this.location.x,this.location.y,this.location.z);
        rotateX( this.rotation.x);
        rotateY( this.rotation.y);
        rotateZ( this.rotation.z);
        box(this.width,this.height,this.depth);
        //console.log("lines"+this.lineCubes.length)
        for(let i=0; i<this.lineCubes.length;i++){
            this.lineCubes[i].update();
            this.lineCubes[i].render();
        }
        pop()
    }
   

}