let faceapi;
let neuralNetwork;

let video;
let detections;
let slope = 0;

let breakout;

// relative path to your models from window.location.pathname
const faceApiDetectionOptions = {
	withLandmarks: true,
	withDescriptors: false,
	Mobilenetv1Model: "models/face_api",
	FaceLandmarkModel: "models/face_api",
	FaceRecognitionModel: "models/face_api",
	FaceExpressionModel: "models/face_api"
};

const neuralNetworkOptions = {
	inputs: 1,
	outputs: 3,
	task: "classification",
	debug: false
}

function setup() {
	createCanvas(600, 600);

	breakout = new Breakout(8, 7);
    breakout.init();

	// load up your video
	video = createCapture(VIDEO);
	video.size(360, 270);
	video.hide();

	// flip the camera
	translate(video.width, 0);
	scale(-1, 1);
	
	neuralNetwork = ml5.neuralNetwork(neuralNetworkOptions);
	neuralNetwork.load("models/direction_model/direction_model.json", directionModelReady);
	textAlign(RIGHT);
}

function draw() {
	breakout.update();
}

function faceApiModelReady() {
	console.log("FaceAPI Ready!");
	faceapi.detect(faceApiGotResults);
}

function directionModelReady() {
	console.log("DirectionModel Ready!");
	faceapi = ml5.faceApi(video, faceApiDetectionOptions, faceApiModelReady);
}

function faceApiGotResults(err, result) {
	if (err) {
		console.log(err);
		return;
	}
	detections = result;

	if (detections) {
		updateSlope(detections);
	}

	neuralNetwork.classify({slope: slope}, directionModelGotResults);
	faceapi.detect(faceApiGotResults);
}

function directionModelGotResults(err, result) {
	if(err){
		console.error(err);
		return;
	}
	
	let dir = result[0].label;
	breakout.paddle.move(dir);
}

function updateSlope(detections) {
	if(detections.length > 0) {
		const leftEye = detections[0].parts.leftEye;
		const rightEye = detections[0].parts.rightEye;
		
		if (leftEye && rightEye) {
			const deltaX = leftEye[0]._x - rightEye[0]._x;
			const deltaY = leftEye[0]._y - rightEye[0]._y;
			slope = deltaY / deltaX;
		}
	}
}