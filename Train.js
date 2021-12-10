class Train extends Vehicle {
    constructor(id, x, y, timing, destination, currentStop, nextStop) {
        super(id, x, y, timing, destination, nextStop);
        this.currentStop = currentStop;
        this.img = blackTrain;
    }


    updateInfo() {
        return {
            timing: this.timing,
            destination: this.destination,
            currentStop: this.currentStop,
            nextStop: this.nextStop
        }
    }



    getInfo() {
        if (dist(mouseX, mouseY, this.locationInPixels.x, this.locationInPixels.y) < 10) {
            this.img = whiteTrain;
            return this.updateInfo();
            
        } else { this.img = blackTrain; }
    }


    select() {
        if (this.locationInPixels != undefined) {
            if (dist(mouseX, mouseY, this.locationInPixels.x, this.locationInPixels.y) < 15) {
                this.img = whiteTrain;
                menu = new TrainMenu(this.updateInfo(), routeNumber, routeText)
                return this.updateInfo();
            }
        }
    }


    deselect() {
        this.img = blackTrain;
    }


    update(newX, newY, currentStop, nextStop, timing) {
        this.newCoords.x = newX;
        this.newCoords.y = newY;
        this.currentStop = currentStop;
        this.nextStop = nextStop;
        this.timing = timing;
    }
}