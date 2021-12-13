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
      this.routeName = this.routeName.toUpperCase();
      if (this.routeName.includes("/")) {
        parts = this.routeName.split("/");
      } else if (this.routeName.includes(" ")) {
        parts = this.routeName.split(" ");
      } else {
        parts.push(this.routeName);
      }

      //get parameters for line name text
      textSize(25);
      fill(150);
      let startHeight;
      let multiplier = 40;
      if (parts.length === 1) {
        startHeight = 110;
      } else if (parts.length === 2) {

        startHeight = 90;
      } else if (parts.length === 3) {

        startHeight = 70;
      } else {
        startHeight = 65;
        multiplier = 30;
        textSize(20);
      }

      //Draw line name
      for (let i = 0; i < parts.length; i++) {
        text(parts[i], width - 100, startHeight + i * multiplier);
      }

    } else {
      textSize(25);
      text("Select a route", width - 100, 110)
    }

    //Draw selected train attributes
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