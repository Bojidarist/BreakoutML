let faceapi;
let neuralNetwork;

let video;
let detections;
let slope = 0;
let leftTrainButton;
let noneTrainButton;
let rightTrainButton;
let startTrainButton;
let slopeText;
let trainData = [];
let isFinished = false;

const faceApiDetectionOptions = {
    withLandmarks: true,
    withDescriptors: false
};

const neuralNetworkOptions = {
    inputs: 1,
    outputs: 3,
    task: "classification",
    debug: false
}

function setup() {
    initHTMLElements();

    createCanvas(360, 270);

    // load up your video
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    // flip the camera
    translate(video.width, 0);
    scale(-1, 1);
    
    faceapi = ml5.faceApi(video, faceApiDetectionOptions, faceApiModelReady);
    neuralNetwork = ml5.neuralNetwork(neuralNetworkOptions);
    textAlign(RIGHT);
}

function initHTMLElements() {
    leftTrainButton = document.getElementById("leftTrainButton");
    noneTrainButton = document.getElementById("noneTrainButton");
    rightTrainButton = document.getElementById("rightTrainButton");
    startTrainButton = document.getElementById("startTrainButton");
    slopeText = document.getElementById("slopeText");

    leftTrainButton.onclick = addLeftExample;
    noneTrainButton.onclick = addNoneExample;
    rightTrainButton.onclick = addRightExample;
    startTrainButton.onclick = trainModel;
}

function addLeftExample() {
    trainData.push({
        slope: slope,
        direction: "left"
    });
}

function addNoneExample() {
    trainData.push({
        slope: slope,
        direction: "none"
    });
}

function addRightExample() {
    trainData.push({
        slope: slope,
        direction: "right"
    });
}

function trainModel() {
    trainData.forEach(item => {
        const input = { 
            slope: item.slope 
        };

        const output = { 
            direction: item.direction 
        };

        neuralNetwork.addData(input, output);
    });

    neuralNetwork.normalizeData();

    const trainingOptions = {
        epochs: 64,
        batchSize: 12
    }

    neuralNetwork.train(trainingOptions, finishedTraining);
}

function finishedTraining() {
    console.log("Finished training!");
    console.log(trainData);
    isFinished = true;

    neuralNetwork.save("direction_model");
}

function faceApiModelReady() {
    console.log("FaceAPI Ready!");
    console.log(faceapi);
    faceapi.detect(faceApiGotResults);
}

function faceApiGotResults(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    detections = result;

    background(255);
    image(video, 0, 0, width, height);
    if (detections) {
        if (detections.length > 0) {
            drawEyeLine(detections);
        }
    }

    if (isFinished) {
        neuralNetwork.classify({slope: slope}, (error, res) => {
            if(error){
                console.error(error);
                return;
            }
            console.log(res[0].label);
        });
    }
    faceapi.detect(faceApiGotResults);
}

function drawEyeLine(detections) {
    noFill();
    stroke(161, 95, 251);
    strokeWeight(5);

    if(detections.length > 0) {
        const leftEye = detections[0].parts.leftEye;
        const rightEye = detections[0].parts.rightEye;
        const deltaX = leftEye[0]._x - rightEye[0]._x;
        const deltaY = leftEye[0]._y - rightEye[0]._y;
        slope = deltaY / deltaX;
        slopeText.innerHTML = "Slope: " + slope;
        
        line(20, leftEye[0]._y, 60, rightEye[0]._y);
    }
}