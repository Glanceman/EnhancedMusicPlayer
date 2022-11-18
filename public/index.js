
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

    let playbtn = new SButton(width / 2, height * 9 / 10, 100, 100, imgs.playbtn, imgs.pasuebtn);
    playbtn.onPress = () => {
        console.log("Press play")
        if (songs[currentSongIndex].musicSequence.isPlaying()) {
            songs[currentSongIndex].musicSequence.pause();
            playbtn.image = playbtn.initImg;
        } else {
            songs[currentSongIndex].musicSequence.setVolume(volSlider.value())
            songs[currentSongIndex].musicSequence.pan(panSlider.value())
            songs[currentSongIndex].musicSequence.play();
            playbtn.image = playbtn.finalImg;
        }
    }
    btns.push(playbtn);

    let stopbtn = new SButton(width / 2 + 120, height * 9 / 10, 80, 80, imgs.stopbtn);
    stopbtn.onPress = () => {
        console.log("Press stop")
        if (songs[currentSongIndex].musicSequence.isPlaying()) {
            songs[currentSongIndex].musicSequence.stop();
            playbtn.reset();
        }
    }
    btns.push(stopbtn);

    let previousbtn = new SButton(width / 2 - 240, height * 9 / 10, 80, 80, imgs.previousbtn);
    previousbtn.onPress = () => {
        console.log("Press previous")
        if (songs[currentSongIndex].musicSequence.isPlaying()) {
            songs[currentSongIndex].musicSequence.stop();
            playbtn.reset();
        }
        currentSongIndex = (currentSongIndex - 1) < 0 ? 0 : (currentSongIndex - 1);
    }
    btns.push(previousbtn);

    let nextbtn = new SButton(width / 2 - 120, height * 9 / 10, 80, 80, imgs.nextbtn);
    nextbtn.onPress = () => {
        console.log("Press previous")
        if (songs[currentSongIndex].musicSequence.isPlaying()) {
            songs[currentSongIndex].musicSequence.stop();
            playbtn.reset();
        }
        currentSongIndex = (currentSongIndex + 1) >= songs.length ? songs.length - 1 : (currentSongIndex + 1);
    }
    btns.push(nextbtn);
    volSlider = createSlider(0, 1, 1, 0.1);
    volSlider.position(width / 2 + 240, height * 9 / 10)
    volSlider.style("width", '100px');

    volSlider.mouseMoved(() => {
        songs[currentSongIndex].musicSequence.setVolume(volSlider.value())
    })

    panSlider = createSlider(-1, 1, 0, 0.1);
    panSlider.position(width / 2 + 360, height * 9 / 10)
    panSlider.style("width", '100px');
    panSlider.mouseMoved(() => {
        songs[currentSongIndex].musicSequence.pan(panSlider.value())
    })

    progressSlider = createSlider(0, 1, 1, 0.001);
    progressSlider.position(width / 2 - width * 0.8 * 0.5, height * 8 / 10)
    progressSlider.style("width", width * 0.8 + 'px');
    progressSlider.mousePressed(()=>{
        changePosition=true;
        console.log("Slider Press")
    })
    progressSlider.mouseMoved(()=>{
        if(changePosition==false) return;
       
    })
    progressSlider.mouseReleased(()=>{
        changePosition=false;
        let duration = songs[currentSongIndex].musicSequence.duration();
        songs[currentSongIndex].musicSequence.jump(map(progressSlider.value(),0,1,0,duration));
    })

    component = new Component(250, 250, 250, 0, 0, -1000);
    lineCube = new LineObjects(1000, 100, -1000, 2, 100);
    terrain = new Terrain(10000, 10000, 0, 1000, -1200 - 2000, 20, 20, 450);
    fft = new p5.FFT(0.8, 256);
}


function update() {
    let currentPosition = songs[currentSongIndex].musicSequence.currentTime();
    if(changePosition==false){
        progressSlider.value(map(currentPosition, 0, songs[currentSongIndex].musicSequence.duration(), 0, 1));
    }

    let spectrum = fft.analyze();
    let yaw = atan2((mouseX - width / 2), Math.abs(component.location.z));
    let pitch = atan2(-(mouseY - height / 2), Math.abs(component.location.z));
    component.setRotation(pitch, yaw, 0);
    console.log(spectrum.length);
    component.update(spectrum);
    lineCube.setRotation(0, 0, angle);
    angle += 1;

}

function draw() {
    let bgcolor = [0];
    background(125);
    pg.clear();
    pg.background(...bgcolor);
    update()

    lineCube.update();
    lineCube.render(pg);
    terrain.render(pg);
    component.render(pg);
    //VFX
    image(pg, 0, 0);

    push()
    textSize(64);
    textAlign(CENTER)
    fill(157, 234, 240);
    text(songs[currentSongIndex].name, width / 2, height / 10);
    pop()
    btns.forEach((btn) => {
        btn.draw();
    })
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