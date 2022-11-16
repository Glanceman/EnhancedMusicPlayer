class LineObjects extends SObject{
    constructor(x,y,z,numberOfObjects,spawnObjectSize){
        super(0,0,0,x,y,z);
        this.number=numberOfObjects;
        this.myObjects=[];
        this.spawnObjectSize=spawnObjectSize
    }
    setNumber(val){
        this.number=val;
    }

    update(){
        for(let i=0;i<this.number;i++){
            let myobject=new SObject(this.spawnObjectSize,this.spawnObjectSize,this.spawnObjectSize,0,-(this.spawnObjectSize+10)*[i],0)
            this.myObjects.push(myobject);
        }
    }
    
    render(){
        push()
        translate(this.location.x,this.location.y,this.location.z);
        rotateX( this.rotation.x);
        rotateY( this.rotation.y);
        rotateZ( this.rotation.z);
        console.log(this.myObjects.length);
        for(let i=0;i<this.myObjects.length;i++){
            this.myObjects[i].render();
        }
        pop()
        this.myObjects=[];
    }
}