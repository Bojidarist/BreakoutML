class Brick {
    constructor(x, y, w, h, color){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
    }

    update(){
        this.draw();
    }

    draw(){
        fill(this.color);
        stroke(69);
        strokeWeight(3);
        
        rect(this.x, this.y, this.w, this.h);

        stroke(255);
        strokeWeight(0);
    }

    isCollided(otherX, otherY, otherW, otherH){
        let isToTheRight = otherX > this.x + this.w;
        let isToTheLeft = otherX + otherW < this.x;
        let isAbove = otherY + otherH < this.y;
        let isBelow = otherY > this.y + this.h;

        return !(isToTheLeft || isToTheRight || isAbove || isBelow);
    }
}