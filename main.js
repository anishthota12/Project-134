alertSound = "";
status = "";
objects = [];

function preload() {
    alertSound = loadSound("alert.mp3");
}

function setup() {
    canvas = createCanvas(575, 435);
    canvas.center();
    video = createCapture(VIDEO);
    video.size(575, 435);
    video.hide();

    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status: Detecting Objects...";
}

function modelLoaded() {
    console.log("Model Loaded!");
    status = true;
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
    } else {
        console.log(results);
        objects = results;
    }
}

function draw() {
    image(video, 0, 0, 575, 435);
    if (status != "") {
        r = random(255);
        g = random(255);
        b = random(255);
        objectDetector.detect(video, gotResult);
        for (i = 0; i < objects.length; i++) {
            document.getElementById("status").innerHTML = "Status: Object Detected";

            fill(r, g, b);
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 15);
            noFill();
            stroke(r, g, b);
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);

            if (objects[i].label == "person") {
                document.getElementById("status").innerHTML = "Baby Found!";
                console.log("Baby is Located");
                alertSound.stop();
            } else {
                document.getElementById("status").innerHTML = "Baby NOT Found!";
                console.log("Baby is not found!");
                alertSound.play();
            }
        }
        if (objects.length == 0) {
            document.getElementById("status").innerHTML = "Baby NOT Found!";
            console.log("Baby is not found!");
            alertSound.play();
        }
    }
}