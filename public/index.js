
let canvasSize = [window.innerWidth, window.innerHeight]
let songs = [];
let currentSongIndex = 0;
let btns = [];
let imgs = {};
let volSlider;
let progressSlider;
let panSlider;
let component;
let lineCube;
let angle = 0;
let changePosition = false;
let fft;
let terrain;
function preload() {

}

function setup() {
    createCanvas(...canvasSize, WEBGL);
    component = new Component(250, 250, 250, 0, 0, -1000);
    lineCube = new LineObjects(1000, 100, -1000, 2, 100);
    terrain = new Terrain(6000,5000,0,1000,-1200-2000,10,10);
    fft = new p5.FFT(0.8, 256);
}


function update() {
    let spectrum = fft.analyze();
    let yaw = atan2((mouseX - width / 2), Math.abs(component.location.z));
    let pitch = atan2(-(mouseY - height / 2), Math.abs(component.location.z));
    component.setRotation(pitch, yaw, 0);
    lineCube.setRotation(0, 0, angle);
    angle += 0.1;

}

function draw() {
    let bgcolor = [0];
    background(...bgcolor);
    update()
    lineCube.update();
    lineCube.render();
    terrain.render();
    component.render();
    //VFX
}

// function mousePressed() {
//     if (songs[0].isPlaying()) {
//         // .isPlaying() returns a boolean
//         songs[0].stop();
//         background(255, 0, 0);
//     } else {
//         songs[0].play();
//         background(0, 255, 0);
//     }
// }

window.onresize = () => {
    canvasSize = [window.innerWidth, window.innerHeight]
    resizeCanvas(canvasSize[0], canvasSize[1])
}