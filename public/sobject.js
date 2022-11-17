class SObject{
    constructor(w,h,d,x=0,y=0,z=0){
  
        this.width=w;
        this.height=h;
        this.depth=d;
        this.location=createVector(x,y,z);
        this.rotation=createVector(0,0,0);
    }
    setRotation(pitch,yaw,roll){
        this.rotation.x=pitch
        this.rotation.y=yaw;
        this.rotation.z=roll;
    }

    setLocation(x,y,z){
        this.location.x=x;
        this.location.y=y;
        this.location.z=z;
    }

    render(){
        push()
        translate(this.location.x,this.location.y,this.location.z);
        rotateX( this.rotation.x);
        rotateY( this.rotation.y);
        rotateZ( this.rotation.z);
        box(this.width,this.height,this.depth);
        pop()
    }

    render(canvas){
        canvas.push()
        canvas.translate(this.location.x,this.location.y,this.location.z);
        canvas.rotateX( this.rotation.x);
        canvas.rotateY( this.rotation.y);
        canvas.rotateZ( this.rotation.z);
        canvas.box(this.width,this.height,this.depth);
        canvas.pop()
    }

}