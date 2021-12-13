class Vehicle {
    constructor(tripID, x, y, timing, destination, nextStop) {
        this.id = tripID;
        this.coords = {x: x, y: y}
        this.newCoords = {x: x, y: y}
        this.timing = timing;
        this.destination = destination;
        this.nextStop = nextStop;
        this.locationInPixels;
    }


    show(baseMap) {
        //Current location
        if (this.coords.x != this.newCoords.x) {
            this.coords.x = parseFloat(lerp(this.coords.x, this.newCoords.x, 0.05));
            this.coords.y = parseFloat(lerp(this.coords.y, this.newCoords.y, 0.05));
        }

        //Fill based on timing
        if (this.timing == 0) { fill(0, 255, 0, 100); }
        else if (this.timing <  0) { fill(255, 255, 0, 100); }
        else { fill(255, 0, 0, 100); }
        noStroke();

        this.locationInPixels = baseMap.latLngToPixel(this.coords.x, this.coords.y);
        ellipse(this.locationInPixels.x, this.locationInPixels.y, 30, 30);
        imageMode(CORNER);
        image(this.img, this.locationInPixels.x - 12, this.locationInPixels.y - 12)
    }

/*     updateInfo() {
        return {
            timing: this.timing,
            direction: this.direction,
            destination: this.destination,
            seats: this.seats,
            nextStop: this.nextStop
        }
    }



    getInfo() {
        if (dist(mouseX, mouseY, this.locationInPixels.x, this.locationInPixels.y) < 10) {
            this.img = whiteBus;
            return this.updateInfo();
            
        } else { this.img = blackBus; }
    }


    deselect() {
        this.img = blackBus;
    }


    update(newX, newY, nextStop, timing, seats) {
        this.newCoords.x = newX;
        this.newCoords.y = newY;
        this.nextStop = nextStop;
        this.timing = timing;
        this.seats = seats;
    }*/
} 