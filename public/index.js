
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
let sobject;
let pg;

function preload() {
    let song = loadSound('./assets/bensound-sadday.mp3');
    let song1 = loadSound('./assets/bensound-enigmatic.mp3');
    let song2 = loadSound('./assets/eye-water.mp3');
    songs.push(
        {
            id: 0,
            name: "Sadday",
            musicSequence: song,
        },
        {
            id: 1,
            name: "Enigmatic",
            musicSequence: song1,
        },
        {
            id: 2,
            name: "eye-water",
            musicSequence: song2,
        },
    );
    imgs.playbtn = loadImage('./assets/play-button.png');
    imgs.pasuebtn = loadImage('./assets/pause-button.png');
    imgs.stopbtn = loadImage("./assets/stop-button.png");
    imgs.nextbtn = loadImage("./assets/next.png")
    imgs.previousbtn = loadImage("./assets/previous.png")
}

function setup() {
    createCanvas(...canvasSize);
    pg = createGraphics(...canvasSize, WEBGL);
    pg.angleMode(DEGREES);
    sobject = new SObject(100,100,100,0,0,0);
    component = new Component(250, 250, 250, 0, 0, -1000);
    lineCube = new LineObjects(1000, 100, -1000, 2, 100);
    terrain = new Terrain(10000,10000,0,1000,-1200-2000,20,20,450);
    fft = new p5.FFT(0.8, 256);
}


function update() {
    let spectrum = fft.analyze();
   let yaw = atan2((mouseX - width / 2), Math.abs(component.location.z));
    let pitch = atan2(-(mouseY - height / 2), Math.abs(component.location.z));
    component.setRotation(pitch, yaw, 0);
    //sobject.setRotation(0,0,angle);
    lineCube.setRotation(0, 0, angle);
    angle += 1;

}

function draw() {
    let bgcolor = [0];
    background(125);
    pg.clear();
    pg.background(...bgcolor);
    update()
    //sobject.render(pg);
    lineCube.update();
    lineCube.render(pg);
    terrain.render(pg);
    component.render(pg);
    //VFX
    image(pg, 0, 0);


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
    pg = createGraphics(...canvasSize, WEBGL);
    pg.angleMode(DEGREES);
}