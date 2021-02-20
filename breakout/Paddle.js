class Paddle {
    constructor(x, y, w, h, color){
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = 5;
    }

    update(){
        if (keyIsDown(LEFT_ARROW)) {
            this.move("left");
        }
        else if (keyIsDown(RIGHT_ARROW)){
            this.move("right");
        }
        this.draw();
    }

    draw(){
        fill(this.color);
        stroke(255);
        strokeWeight(0);
        rect(this.x, this.y, this.w, this.h);
    }

    move(direction){
        if (this.x < 0) {
            this.x = 0;
        }
        else if(this.x + this.w > width){
            this.x = width - this.w;
        }

        if (direction === "left") {
            this.x -= this.speed;
        }
        else if(direction === "right"){
            this.x += this.speed;
        }
    }

    isCollided(otherX, otherY, otherW, otherH){
        let isToTheRight = otherX > this.x + this.w;
        let isToTheLeft = otherX + otherW < this.x;
        let isAbove = otherY + otherH < this.y;
        let isBelow = otherY > this.y + this.h;

        return !(isToTheLeft || isToTheRight || isAbove || isBelow);
    }

    clone() {
        return Object.create(
            Object.getPrototypeOf(this), 
            Object.getOwnPropertyDescriptors(this)
        );
    }
}