class Bus extends Vehicle {
    constructor(id, x, y, timing, destination, nextStop, direction, seats) {
        super(id, x, y, timing, destination, nextStop);
        this.direction = direction;
        this.seats = seats;
        this.img = blackBus;
    }

    
    updateInfo() {
        return {
            timing: this.timing,
            direction: this.direction,
            destination: this.destination,
            seats: this.seats,
            nextStop: this.nextStop
        }
    }



    select() {
        if (this.locationInPixels != undefined) {
            if (dist(mouseX, mouseY, this.locationInPixels.x, this.locationInPixels.y) < 10) {
                this.img = whiteBus;
                menu = new BusMenu(this.updateInfo(), routeNumber, routeText)
                return this.updateInfo();
            }// else { this.img = blackBus; }
        }
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
}