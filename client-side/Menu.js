class Menu {
    constructor(data) {
        if (data != undefined) {
            this.destination = data.destination;
            this.timing = data.timing;
            this.nextStop = data.nextStop;
        }
    }


    drawBackground() {
        fill(0, 0, 0, 150);
        rectMode(CORNER);
        rect(width - 200, 0, 200, 180);
      
        textFont("Arial");
        textStyle("normal");
        textAlign(CENTER, CENTER);
        noStroke();
        fill(255, 255, 255);
    }

    drawAttributes(attributes) {
        textSize(25);
        noStroke();
        textAlign(CENTER, CENTER);
        textStyle("italic");
        textFont("georgia");
        rectMode(CORNER);
      
        for (let i = 0; i < attributes.length; i++) {
          fill(0, 0, 0, 100);
          rect(width - 200, 180 + i * 70, 200, 35);
          fill(255, 255, 255);
          text(attributes[i], width - 100, 200 + i * 70);
        }
    }

    //Handle when next stop is equal to null
    formatStop(nextStop) {
        if (nextStop == null) { return "Unknown"; }
        else { return nextStop; }
    }
  
  //Make seat information more human readable
    formatSeats(seats) {
        if (seats === "MANY_SEATS_AVAILABLE") { return "Many seats available"; }
        else if (seats ===  "NOT_AVAILABLE") { return "No seats available"; }
        else { return "Unknown"; }
    }
  

  //Take timing in minutes and transform it into a string
    timingToString(timing) {
        let outString;
        const timingInt = parseInt(timing);
    
        //Minute for one, minutes for several
        let minute = "minutes";
        if (timingInt === 1 || timingInt === -1) { 
        minute = "minute";
        }
    
        //Handle 999 (unknown) timing
        if (timingInt > 100) { 
            outString = `Unknown`; 
        } else if (timingInt < 0) { //Remove the minus when early
        timing = -timingInt;
        outString = `Early (${timing} ${minute})`; 
        } else if (timingInt > 0) { 
            outString = `Late (${timing} ${minute})`; 
        } else if (timingInt === 0) { 
            outString = `On time`; 
        }
        return outString;
    }
}