// Made for 600x600 canvas
class Breakout {
    constructor(brickRows, brickCols){
        this.brickRows = brickRows;
        this.brickCols = brickCols;
        this.backgroundColor = 35;
        this.paddle = new Paddle(250, 550, 100, 10, 235);;
        this.ball = new Ball(300, 250, 25, "yellow");
        this.origPaddle = this.paddle.clone();
        this.origBall = this.ball.clone();
        this.bricks = [];
        this.brickColors = [
            "red",
            "white",
            "green",
            "pink",
            "blue",
            "cyan",
            "violet"
        ];
        this.gameState = "not started";
    }

    init(){
        let brickWidth = width / this.brickCols;
        let brickHeight = 25;
        for (let i = 0; i < this.brickCols; i++) {
            for (let j = 0; j < this.brickRows; j++) {
                let brickColor = this.brickColors[Math.floor(Math.random() * this.brickColors.length)];
                this.bricks.push(new Brick(i * brickWidth, j * brickHeight, brickWidth, brickHeight, brickColor));
            }
        }
    }

    restart() {
        this.ball = this.origBall.clone();
        this.paddle = this.origPaddle.clone();
        this.bricks = [];
        this.init();
    }

    update(){
        background(this.backgroundColor);

        if (this._handleGameState()) {
            if (keyIsPressed && key == "p"){
                this.gameState = "paused";
            }

            if (this.bricks.length == 0) {
                this.win();
            }

            this.paddle.update();
            this.ball.update();
            this.bricks.forEach(brick => {
                brick.update();
            });
            
            this._handleCollisions();
        }
    }

    win(){
        this.gameState = "won";
    }

    gameOver(){
        this.gameState = "lost";
    }

    _handleGameState(){
        if (this.gameState === "not started"){
            this._displayTextAtCenter("Press 'R' to start", 30, "white");

            if (keyIsPressed && key == "r"){
                this.gameState = "running";
            }

            return false;
        }
        else if (this.gameState === "won"){
            this._displayTextAtCenter("YOU WIN! Press 'R' to restart", 30, "white");

            if (keyIsPressed && key == "r"){
                this.gameState = "running";
                this.restart();
            }

            return false;
        }
        else if (this.gameState === "lost"){
            this._displayTextAtCenter("YOU LOSE :( Press 'R' to restart", 30, "white");

            if (keyIsPressed && key == "r"){
                this.gameState = "running";
                this.restart();
            }

            return false;
        }
        else if (this.gameState === "paused"){
            this._displayTextAtCenter("Game paused! Press 'R' to continue", 30, "white");

            if (keyIsPressed && key == "r"){
                this.gameState = "running";
            }
            
            return false;
        }

        return true;
    }

    _displayTextAtCenter(str, size, color){
        textAlign(CENTER);
        textSize(size);
        fill(color);
        stroke(255);
        strokeWeight(0);
        text(str, 10, 250, width, height);
    }

    _handleCollisions(){
        let ballHitbox = this.ball.getHitbox();
        this.bricks.forEach(brick => {
            if (brick.isCollided(ballHitbox.x, ballHitbox.y, ballHitbox.w, ballHitbox.h)) {
                let brickIndex = this.bricks.indexOf(brick);
                this.bricks.splice(brickIndex, 1);
                this.ball.horizontalVelocity *= -1;
                this.ball.verticalVelocity *= -1;
            }
        });

        let paddleMiddle = this.paddle.x + this.paddle.w / 2;
        let paddleQuad = this.paddle.w / 4;
        if (this.paddle.isCollided(ballHitbox.x, ballHitbox.y, ballHitbox.w, ballHitbox.h)){
            this.ball.verticalVelocity *= -1;
            if (ballHitbox.x + ballHitbox.w < paddleMiddle) {
                this.ball.horizontalVelocity = -3;
                if (ballHitbox.x + ballHitbox.w < paddleMiddle - paddleQuad) {
                    this.ball.horizontalVelocity = -5;
                }
            }
            else if(ballHitbox.x > paddleMiddle){
                this.ball.horizontalVelocity = 3;
                if (ballHitbox.x > paddleMiddle + paddleQuad) {
                    this.ball.horizontalVelocity = 5;
                }
            }
            
            if (this.ball.verticalVelocity > 0) {
                this.ball.verticalVelocity += 0.1;
            }
            else {
                this.ball.verticalVelocity -= 0.1;
            }
        }

        if (ballHitbox.x < 0){
            this.ball.x = 0 + ballHitbox.w;
            this.ball.horizontalVelocity *= -1;
        }
        if (ballHitbox.x + ballHitbox.w > width){
            this.ball.x = width - ballHitbox.w;
            this.ball.horizontalVelocity *= -1;
        }
        if (ballHitbox.y < 0){
            this.ball.y = 0 + ballHitbox.h;
            this.ball.verticalVelocity *= -1;
        }
        if (ballHitbox.y > height){
            this.gameOver();
        }
    }
}