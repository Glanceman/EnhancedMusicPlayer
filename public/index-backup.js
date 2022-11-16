
let canvasSize = [window.innerWidth, window.innerHeight]
let songs = [];
let currentSongIndex = 0;
let btns = [];
let imgs = {};
let volSlider;
let progressSlider;
let panSlider;

let fft;
let amplitude;
let fadingCircles = [];

let scale_L=0;
let scale_R=0;

let changePosition=false;

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
    // btn=new Clickable();
    // btn.locate(width/2, height*9/10);
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
    console.log(progressSlider);

    fft = new p5.FFT(0.8, 256);
    amplitude = new p5.Amplitude();

}

function Update() {
    //update music progress
    let currentPosition = songs[currentSongIndex].musicSequence.currentTime();
    if(changePosition==false){
        progressSlider.value(map(currentPosition, 0, songs[currentSongIndex].musicSequence.duration(), 0, 1));
    }
    angleMode(DEGREES);

    let level = amplitude.getLevel() * 5;
    if (level > 0.135 && frameCount % 60 == 0) {
        let maxSize = height * level;
        if (maxSize > 350) {
            maxSize = 350
        }
        p = new fadingCircle(random(1, width), random(1, height), maxSize);
        fadingCircles.push(p);
    }
    //console.log(forceField);
}

function draw() {
    let bgcolor = [223, 248, 250];
    background(...bgcolor);
    Update();
    //VFX
    for (let i = fadingCircles.length - 1; i >= 0; i--) {
        fadingCircles[i].draw();
        if (fadingCircles[i].isFinish()) {
            fadingCircles.splice(i, 1);
        }
    }
    
    let spectrum = fft.analyze();
    push()
    noFill();
    beginShape();
    strokeWeight(2);
    stroke(69, 179, 224);
    translate(width / 2, height / 2)
    let level_L = amplitude.getLevel(0) * 100;
    scale_L =lerp(scale_L, map(amplitude.getLevel(0),0,0.2,0,1),0.1)
    for (let i = 0; i < spectrum.length; i++) {
        let angle = round(map(i, 0, spectrum.length, 0, 360));
        let r = map(spectrum[i], 0, 255, 1, min(width, height) * 0.5)*scale_L + level_L;
        let x = -r * cos(angle);
        let y = r * sin(angle);
        vertex(x, y);

    }
    endShape(CLOSE);
    pop()
    push()
    noFill()
    beginShape();
    strokeWeight(2);
    stroke(135, 235, 164);
    translate(width / 2, height / 2)
    let level_R = amplitude.getLevel(1) * 100;
    scale_R =lerp(scale_R, map(amplitude.getLevel(1),0,0.2,0,1),0.1)
    for (let i = 0; i < spectrum.length; i++) {
        let angle = round(map(i, 0, spectrum.length, 0, 360));
        let r = map(spectrum[i], 0, 255, 1, min(width, height) * 0.5)*scale_R + level_R;
        let x = r * cos(angle);
        let y = r * sin(angle);
        vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();

    //UI
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
}