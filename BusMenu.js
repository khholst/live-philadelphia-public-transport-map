class BusMenu {
    constructor(data, routeNumber, routeText) {
        if (data != undefined) {
            this.destination = data.destination;
            this.direction = data.direction;
            this.nextStop = data.nextStop;
            this.timing = data.timing;
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
        fill(0, 0, 0, 150);
        rectMode(CORNER);
        rect(width - 200, 0, 200, 180);
      
        textFont("Arial");
        textStyle("normal");
        textAlign(CENTER, CENTER);
        noStroke();
        fill(255, 255, 255);
      
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
        textSize(25);
        noStroke();
        textAlign(CENTER, CENTER);
        textStyle("italic");
        textFont("georgia");
        rectMode(CORNER);
      
        for (let i = 0; i < busAttributes.length; i++) {
          fill(0, 0, 0, 100);
          rect(width - 200, 180 + i * 70, 200, 35);
          fill(255, 255, 255);
          text(busAttributes[i], width - 100, 200 + i * 70);
        }

        if (this.destination != undefined) {
            textSize(13);
            text(this.direction, width - 100, 233);
            text(this.destination, width - 100, 303);
            text(formatNextStop(this.nextStop), width - 100, 373);
            text(timingToString(this.timing), width - 100, 443);
            text(formatSeats(this.seats), width - 100, 513);
        }

    }
}