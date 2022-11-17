class Terrain extends SObject {
    constructor(w, d, x = 0, y = 0, z = 0, rows, cols,boxSize) {
        super(w, 0, d, x, y, z)
        this.rows = rows;
        this.cols = cols;
        this.deltaWidth = this.width / this.cols;
        this.deltaHeight = this.depth / this.rows;
        this.boxSize=boxSize;
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
}