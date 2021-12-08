class TrainMenu extends Menu {
  constructor(data, routeName) {
      super(data)
      if (data != undefined) {
          this.currentStop = data.currentStop;
      }
      if (routeName != undefined) {
        this.routeName = routeName;
      }
  }

  show() {
    this.drawBackground();

    if (this.routeName != undefined) {
      //break up the route name
      let parts = [];
      if (this.routeName.includes("/")) {
        parts = this.routeName.split("/");
      } else if (this.routeName.includes(" ")) {
        parts = this.routeName.split(" ");
      } else {
        parts.push(this.routeName);
      }

      //draw the route name based on length
      textSize(30);
      if (parts.length === 1) {
        text(parts[0], width - 100, 110);
      } else if (parts.length === 2) {
        text(parts[0], width - 100, 90);
        text(parts[1], width - 100, 130);
      }




    } else {
      textSize(25);
      text("Select a route", width - 100, 110)
    }


    const trainAttributes = ["DESTINATION", "CURRENT STOP", "NEXT STOP", "TIMING"];
    this.drawAttributes(trainAttributes);


    if (this.destination != undefined) {
        textSize(13);
        text(this.destination, width - 100, 233);
        text(this.formatStop(this.currentStop), width - 100, 303);
        text(this.formatStop(this.nextStop), width - 100, 373); //move these functions here
        text(this.timingToString(this.timing), width - 100, 443);
    }
  }
}