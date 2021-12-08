class BusMenu extends Menu {
    constructor(data, routeNumber, routeText) {
        super(data);
        if (data != undefined) {
            this.direction = data.direction;
            this.seats = data.seats;
        }

        if (routeNumber != undefined && routeText != undefined) {
            this.routeNumber = routeNumber;
            this.routeText = routeText;
        }
    }

    format() {
        if (destination.length > 30) {
            const destinationWords = this.destination.split(" ");
            destination = destinationWords[0] + " " + destinationWords[1];
          }
    }

    show() {
        this.drawBackground();
      
        if (this.routeNumber != 0 && this.routeText != undefined) {
          if (this.routeNumber.length <= 3) { textSize(55); }
          else { textSize(40); }
          text(this.routeNumber, width - 100, 75)
      
          const routeTextParts = this.routeText.replace("Transportation Center", "TC").split(";");
          textSize(18)
          fill(150)
          text(routeTextParts[0].split("via")[0], width - 100, 113);
          text(routeTextParts[1].split("via")[0], width - 100, 165);
          textSize(20);
          text("TO", width - 100, 140)
        } else {
          textSize(25);
          text("Select a route", width - 100, 110)
        }


        const busAttributes = ["DIRECTION", "DESTINATION", "NEXT STOP", "TIMING", "SEATS"]
        this.drawAttributes(busAttributes);


        if (this.destination != undefined) {
            textSize(13);
            text(this.direction, width - 100, 233);
            text(this.destination, width - 100, 303);
            text(this.formatStop(this.nextStop), width - 100, 373);
            text(this.timingToString(this.timing), width - 100, 443);
            text(this.formatSeats(this.seats), width - 100, 513);
        }
    }
}