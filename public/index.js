
let canvasSize = [window.innerWidth, window.innerHeight]
let videoSize = [1920, 1080]
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
let amplitude;
let pg;
let faceapi;
let video;
let detectionBox;

let classifier;
// Label
let label = 'listening...';
// Teachable Machine model URL:
//let soundModel = 'https://teachablemachine.withgoogle.com/models/mfU5Po_Y_/';
let soundModel = window.location.href+"/models/";

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
    imgs.audio = loadImage("./assets/audio.png");
    imgs.faces = [];
    imgs.faces[0] = loadImage("./assets/face0.png");
    imgs.faces[1] = loadImage("./assets/face1.png");

    classifier = ml5.soundClassifier(soundModel + 'model.json');
}

function setup() {
    createCanvas(...canvasSize);
    console.log(soundModel);
    pg = createGraphics(...canvasSize, WEBGL);
    pg.angleMode(DEGREES);
    detectionBox = [width / 2, height / 2, 0, 0];
    let constraints = {
        video: {
            mandatory: {
                minWidth: 1280,
                minHeight: 720
            },
        },
    };
    video = createCapture(constraints, VIDEO);
    video.size(...videoSize);
    const detection_options = {
        withLandmarks: true,
        withDescriptors: false,
    }
    faceapi = ml5.faceApi(video, detection_options, () => {
        console.log("Model Ready");
        faceapi.detect(gotResults)
    });


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

    classifier.classify((err, res) => {
        if (res[0].label == "Clap") {
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
    });

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
    panSlider.position(width / 2 + 480, height * 9 / 10)
    panSlider.style("width", '100px');
    panSlider.mouseMoved(() => {
        songs[currentSongIndex].musicSequence.pan(panSlider.value())
    })

    progressSlider = createSlider(0, 1, 1, 0.001);
    progressSlider.position(width / 2 - width * 0.8 * 0.5, height * 8 / 10)
    progressSlider.style("width", width * 0.8 + 'px');
    progressSlider.mousePressed(() => {
        changePosition = true;
        console.log("Slider Press")
    })
    progressSlider.mouseMoved(() => {
        if (changePosition == false) return;

    })
    progressSlider.mouseReleased(() => {
        changePosition = false;
        let duration = songs[currentSongIndex].musicSequence.duration();
        songs[currentSongIndex].musicSequence.jump(map(progressSlider.value(), 0, 1, 0, duration));
    })

    component = new Component(250, 250, 250, 0, 0, -1500);
    component.setFaces(imgs.faces);
    //lineCube = new LineObjects(1000, 100, -1000, 2, 100);
    terrain = new Terrain(20000, 10000, 0, 1500, -6000, 30, 50, 350);
    fft = new p5.FFT(0.8, 256);
    amplitude = new p5.Amplitude();
}


function update() {
    let currentPosition = songs[currentSongIndex].musicSequence.currentTime();
    if (changePosition == false) {
        progressSlider.value(map(currentPosition, 0, songs[currentSongIndex].musicSequence.duration(), 0, 1));
    }
    let level = amplitude.getLevel();
    terrain.inputSignal(level);
    let spectrum = fft.analyze();
    let yaw = atan2((detectionBox[0] + detectionBox[2] / 2 - width / 2), Math.abs(component.location.z));
    let pitch = atan2(-(detectionBox[1] + detectionBox[3] / 2 - height / 2), Math.abs(component.location.z));
    // let yaw = atan2(mouseX-width/2,Math.abs(component.location.z));
    // let pitch = atan2(-(mouseY-height/2), Math.abs(component.location.z));
    component.setRotation(pitch, yaw, 0);
    //console.log(spectrum.length);
    component.update(spectrum, level);
    //lineCube.setRotation(0, 0, angle);
    angle += 1;

}

function draw() {
    let bgcolor = [0];
    background(125);
    pg.clear();
    pg.background(...bgcolor);
    update()

    // lineCube.update();
    // lineCube.render(pg);
    terrain.render(pg);
    component.render(pg);
    //VFX
    image(pg, 0, 0);

    // {
    //     push()
    //     translate(videoSize[0], 0);
    //     scale(-1, 1)
    //     image(video, 0, 0, videoSize[0], videoSize[1]);
    //     pop()

    //     push()
    //     noFill()
    //     rectMode(CENTER);
    //     rect(detectionBox[0] + detectionBox[2] / 2, detectionBox[1] + detectionBox[3] / 2, detectionBox[2], detectionBox[3])
    //     pop()
    // }

    push()
    textSize(64);
    textAlign(CENTER)
    fill(157, 234, 240);
    text(songs[currentSongIndex].name, width / 2, height / 10);
    pop()
    btns.forEach((btn) => {
        btn.draw();
    })
    image(imgs.audio, width / 2 + 180, height * 9 / 10 - 25, 50, 50)
    push()
    textSize(64);
    textAlign(CENTER)
    fill(255);
    text("L", width / 2 + 450, height * 9 / 10 + 25);
    text("R", width / 2 + 620, height * 9 / 10 + 25);
    pop()
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

function gotResults(err, result) {
    if (err) {
        console.log(err)
        return
    }
    //console.log(result)
    if (result.length != 0) {
        detectionBox[0] = videoSize[0] - result[0].alignedRect._box._width - result[0].alignedRect._box._x
        detectionBox[1] = result[0].alignedRect._box._y
        detectionBox[2] = result[0].alignedRect._box._width;
        detectionBox[3] = result[0].alignedRect._box._height;
    }
    console.log(detectionBox);
    faceapi.detect(gotResults)
}

window.onresize = () => {
    canvasSize = [window.innerWidth, window.innerHeight]
    resizeCanvas(canvasSize[0], canvasSize[1])
    pg = createGraphics(...canvasSize, WEBGL);
    pg.angleMode(DEGREES);
}