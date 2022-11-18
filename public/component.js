class Component extends SObject {
    constructor(w, h, d, x = 0, y = 0, z = 0) {
        super(w, h, d, x, y, z)
        this.lineCubes = [];
        this.counter = 0;
        for (let i = 0; i < 10; i++) {
            let angle = round(map(i, 0, 10, 0, 360));
            let r = 500
            let rX = r * cos(angle);
            let rY = r * sin(angle);
            let lineCube = new LineObjects(x + rX, y + rY, -100, 2, 100);
            lineCube.setRotation(0, 0, angle - 90);
            this.lineCubes.push(lineCube);
        }
    }

    update(spectrum) {
        for (let i = 0; i < this.lineCubes.length; i++) {
            let frequency = Math.round(map(i, 0, this.lineCubes.length, 0, spectrum.length / 10));
            let frequencyAmp = Math.round(map(spectrum[frequency], 0, 255, 0, 5));
            let angle = round(map(i, 0, 10, 0, 360)) + this.counter;
            let r = 400
            let rX = r * cos(angle);
            let rY = r * sin(angle);
            //console.log("Amp: " + frequency + "Max Frequency: " + spectrum.length);
            this.lineCubes[i].setNumber(frequencyAmp);
            this.lineCubes[i].setLocation(this.location.x + rX, this.location.y + rY, -100)
            this.lineCubes[i].setRotation(0, 0, angle + 90)
        }
        this.counter++;
    }

    render() {
        push()
        translate(this.location.x, this.location.y, this.location.z);
        rotateX(this.rotation.x);
        rotateY(this.rotation.y);
        rotateZ(this.rotation.z);
        box(this.width, this.height, this.depth);
        //console.log("lines"+this.lineCubes.length)
        for (let i = 0; i < this.lineCubes.length; i++) {
            this.lineCubes[i].update();
            this.lineCubes[i].render();
        }
        pop()
    }

    render(canvas) {
        //this.update();

        canvas.push()
        canvas.translate(this.location.x, this.location.y, this.location.z);
        canvas.rotateX(this.rotation.x);
        canvas.rotateY(this.rotation.y);
        canvas.rotateZ(this.rotation.z);
        canvas.box(this.width, this.height, this.depth);
        //console.log("lines"+this.lineCubes.length)
        canvas.colorMode(HSB);
        for (let i = 0; i < this.lineCubes.length; i++) {
            canvas.fill(40*i,255,255)
            this.lineCubes[i].update();
            this.lineCubes[i].render(canvas);
        }
        canvas.pop()
    }


}