class BusStop {
    constructor(x, y, name) {
        this.coords = {x: x, y: y};
        this.name = name;
        this.locationInPixels;
    }

    show(baseMap) {
        imageMode(CENTER);
        this.locationInPixels = baseMap.latLngToPixel(this.coords.x, this.coords.y);
        image(busStopImg, this.locationInPixels.x, this.locationInPixels.y)
    }

    showName() {
        if (dist(mouseX, mouseY, this.locationInPixels.x, this.locationInPixels.y) < 6) {
            textFont("georgia")
            textSize(15);
            fill(50, 50, 50, 225);
            stroke(0);
            rectMode(CENTER);
            rect(this.locationInPixels.x, this.locationInPixels.y - 25, textWidth(this.name) + 10, 20, 3)
            fill(255);
            noStroke();
            text(this.name, this.locationInPixels.x, this.locationInPixels.y - 25);
        }
    }
}