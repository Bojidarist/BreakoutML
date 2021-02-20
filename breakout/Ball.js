class Ball {
    constructor(x, y, diameter, color){
        this.x = x;
        this.y = y;
        this.diameter = diameter;
        this.color = color;
        this.horizontalVelocity = 0;
        this.verticalVelocity = 2;
    }

    update(){
        this.x += this.horizontalVelocity;
        this.y += this.verticalVelocity;
        this.draw();
    }

    getHitbox(){
        return {
            x: this.x - (this.diameter / 2),
            y: this.y - (this.diameter / 2),
            w: this.diameter,
            h: this.diameter
        };
    }

    draw(){
        fill(this.color);
        stroke(255);
        strokeWeight(0);
        circle(this.x, this.y, this.diameter);
    }

    clone() {
        return Object.create(
            Object.getPrototypeOf(this), 
            Object.getOwnPropertyDescriptors(this)
        );
    }
}