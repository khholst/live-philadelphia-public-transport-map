let baseMap;
let liveBusData;
let liveRailData;
let routeNumber = 0; //Selected route
let routeText; //Route destinations
let routeDropdown;

let vehicles = []; //List for vehicle instances
let busStops = []; //List for bus stop instances
let selectedVehicleInfo; //Info shown on right pane
let menu; //Menu instance
let selectedVehicleIndex;
let transportationMode = "bus/trolley";
let digitalFont;

//Images
let blackBus;
let whiteBus;
let blackTrain;
let whiteTrain;
let busStopImg;

//PEIDA ÄRA SEE
const key = "pk.eyJ1Ijoia2hob2xzdDIzIiwiYSI6ImNrMnpjd2x2NjAzdHQzbm8yOGM5M3M2MHAifQ.J7QtJQ4Qpbe052rraK38hg"


function preload() {
  liveBusData = loadJSON("https://www3.septa.org/hackathon/TransitViewAll/", "jsonp");
  liveRailData = loadJSON("http://www3.septa.org/hackathon/TrainView/", "jsonp");
  blackBus = loadImage("/vehicleImgs/bus_black.png");
  whiteBus = loadImage("/vehicleImgs/bus_white.png");
  blackTrain = loadImage("/vehicleImgs/train_black.png");
  whiteTrain = loadImage("/vehicleImgs/train_white.png");
  busStopImg = loadImage("/vehicleImgs/bus_stop.png")
  digitalFont = loadFont("digital-7.ttf")
}



function setup() {
  setInterval(askRoutes, 10000); //Send querys to API in every 10 seconds

  //Map settings
  const mapOptions = {
    lat: 39.95,
    lng: -75.15,
    zoom: 10,
    maxZoom: 16,
    minZoom: 8,
    style: 'mapbox://styles/mapbox/dark-v9'
  }


  //Basemap
  const canvas = createCanvas(800, 700);  
  const mappa = new Mappa('MapboxGL', key);
  baseMap = mappa.tileMap(mapOptions); 
  baseMap.overlay(canvas);

  //Dropdown menu
  createDropdownMenu();
  routeDropdown.option("Choose a live bus/trolley route");
  routeDropdown.position(0, 0)
  addLiveBusRoutes();

  menu = new BusMenu(selectedVehicleInfo);
}


function draw() {
  clear()

  if (baseMap.getZoom() > 15) {
    //Show bus stop name on hover
    //Two loops so that the name is always drawn on top of stop icon
    for (let i = 0; i < busStops.length; i++) {
      busStops[i].show(baseMap);
    }
    for (let i = 0; i < busStops.length; i++) { 
      busStops[i].showName();
    }
  }

  if (vehicles.length != 0) {
    for (let i = 0; i < vehicles.length; i++) {
      vehicles[i].show(baseMap);
    }
  }


  fill(150, 150, 150, 150);
  noStroke();
  rectMode(CORNER);
  rect(width - 200, 0, width, height);
  menu.show();
  drawTime();
  drawModeButtons();
}


function createDropdownMenu() {
  routeDropdown = createSelect();
  routeDropdown.size(width, 35);
  routeDropdown.position(0, 0);
  routeDropdown.changed(routeChanged); //If dropdown value is changed change the routenr variable
}

function addLiveBusRoutes() {
  //Get live routes and add them to the dropdown
  const routesRunning = liveBusData.routes[0];
  const routeKeys = Object.keys(routesRunning);

  for (let i = 0; i < routeKeys.length; i++) {
    routeDropdown.option(routeKeys[i]);
  }
}


function addLiveTrainRoutes() {
  let lines = [];
  for (let i in liveRailData) {
    const line = liveRailData[i].line;
    if (!lines.includes(line)) { 
      lines.push(line)
      routeDropdown.option(line)
    }
  }
}
    

  
function routeChanged() {
  routeNumber = routeDropdown.value()
  vehicles = [];
  busStops = [];
  askRouteStops(routeNumber);
  getRouteStartEnd(liveBusData.routes[0][routeNumber])
  menu = new BusMenu(selectedVehicleInfo, routeNumber, routeText)
  getBusRoutes(liveBusData);
}



function askRoutes(){
  if (transportationMode === "bus/trolley") {
    loadJSON("https://www3.septa.org/hackathon/TransitViewAll/", getBusRoutes, "jsonp");
  } else if (transportationMode === "rail") {
    loadJSON("http://www3.septa.org/hackathon/TrainView/",  getRailRoutes, "jsonp");
  }
}


function getRailRoutes(railData) {
  if (railData === undefined) return;
  liveRailData = railData; //Update for live rail routes

  for (let i in liveRailData) {
    if (routeDropdown.value() === railData[i].line) {
      const train = railData[i];

      const trainNr = Number(train.trainno);
      const trainLat = Number(train.lat);
      const trainLng = Number(train.lon);
      const timing = train.late;
      const destination = train.dest;
      const currentStop = train.currentStop;
      const nextStop = train.nextstop;
    

      let vehicleExists = false;

      for (let i = 0; i < vehicles.length; i++) {
        const vehicle = vehicles[i];

        if (vehicle.id === trainNr) { //Update vehicle attributes
          vehicle.update(trainLat, trainLng, currentStop, nextStop, timing);
          vehicleExists = true;
        }
      }

      if (!vehicleExists) { //If current bus is not yet an instance
        vehicles.push(new Train(trainNr, trainLat, trainLng, timing, destination, currentStop, nextStop))
      }
  
      if (selectedVehicleIndex != undefined) {
        selectedVehicleInfo = vehicles[selectedVehicleIndex].updateInfo(); //Update selected vehicle information text
      }
    }
  }
}


function getBusRoutes(busData) {
  liveBusData = busData; //Update for live bus/trolley routes

  if (busData === undefined) return;
  
  const allRoutes = busData.routes[0];
  const route = allRoutes[routeNumber];

  if (route != undefined) {
    getRouteStartEnd(route);

    for (let i = 0; i < route.length; i++) {
      const vehicleData = route[i];
      const tripID = Number(vehicleData.trip);
      const vehicleX = Number(vehicleData.lat);
      const vehicleY = Number(vehicleData.lng);
      const timing = vehicleData.late;
      const destination = vehicleData.destination;
      const direction = vehicleData.Direction;
      const seats = vehicleData.estimated_seat_availability;
      const nextStop = vehicleData.next_stop_name;


      let vehicleExists = false;

      for (let i = 0; i < vehicles.length; i++) {
        const vehicle = vehicles[i];

        if (vehicle.id === tripID) { //Update vehicle attributes
          vehicle.update(vehicleX, vehicleY, nextStop, timing, seats);
          vehicleExists = true;
        }
      }

      if (!vehicleExists) { //If current bus is not yet an instance
        vehicles.push(new Bus(tripID, vehicleX, vehicleY, timing, destination, nextStop, direction, seats))
      }
      
      if (selectedVehicleIndex != undefined) {
        selectedVehicleInfo = vehicles[selectedVehicleIndex].updateInfo(); //Update selected vehicle information text
      }
    }
  }
}


function askRouteStops(routeNumber) {
  loadJSON("https://www3.septa.org/hackathon/Stops/?req1=" + routeNumber, getRouteStops, "jsonp");
}


function getRouteStops(busStopData) {
  for (let i = 0; i < busStopData.length; i++) {
    const busStop = new BusStop(busStopData[i].lat, busStopData[i].lng, busStopData[i].stopname.replace("amp;", ""))
    busStops.push(busStop);
  }
}



function getRouteStartEnd(route) {
  routeText = route[0].destination + ";";

  for (let i = 1; i < route.length; i++) {
    if (!routeText.includes(route[i].destination)) {
      routeText += route[i].destination;
    }
  }
}





function mouseClicked() {
  if (vehicles.length != 0) {
    // selectedVehicleInfo = undefined;
    // selectedVehicleIndex = undefined;
    // menu = new BusMenu(selectedVehicleInfo, routeNumber, routeText)


    //Get vehicle info on mouse click
    let isSelected = false;
    for (let i = 0; i < vehicles.length; i++) {
      const info = vehicles[i].select();
      
      //Select only one vehicle
      if (info != undefined) { 
        selectedVehicleInfo = info;
        selectedVehicleIndex = i;
        isSelected = true;
        break; 
      }
    }

    // if (isSelected) {
    //   print("lol")
    //   selectedVehicleInfo = undefined;
    //   selectedVehicleIndex = undefined;
    //   menu = new BusMenu(selectedVehicleInfo, routeNumber, routeText)

    // }

    //Deselect vehicles that are farther than 10px from click except the one that's selected
    for (let i = 0; i < vehicles.length; i++) {
      if (i != selectedVehicleIndex) {
        vehicles[i].deselect();
      }
    }
  }

  //Change transportation mode
  if (dist(mouseX, mouseY, width - 130, height - 100) <= 45) { 
    transportationMode = "bus/trolley"; 
    vehicles = [];
    selectedVehicleInfo = undefined;
    selectedVehicleIndex = undefined;
    routeNumber = undefined;
    routeText = undefined;
    routeDropdown.remove();
    createDropdownMenu();
    routeDropdown.option("Choose a live bus/train route");
    addLiveBusRoutes();
  }
  
  else if (dist(mouseX, mouseY, width - 70, height - 100) <= 45) { 
    transportationMode = "rail";
    vehicles = [];
    selectedVehicleInfo = undefined;
    selectedVehicleIndex = undefined;
    routeNumber = undefined;
    routeText = undefined;
    routeDropdown.remove();
    createDropdownMenu();
    routeDropdown.option("Choose a live rail route");
    addLiveTrainRoutes();
  }
}



function formatNextStop(nextStop) {
  if (nextStop == null) { return "Unknown"; }
  else { return nextStop; }
}

function formatSeats(seats) {
  if (seats === "MANY_SEATS_AVAILABLE") { return "Many seats available"; }
  else if (seats ===  "NOT_AVAILABLE") { return "No seats available"; }
  else { return "Unknown"; }
}

//Take timing in minutes and transform it into a string
function timingToString(timing) {
  let outString;
  const timingInt = parseInt(timing);

  //Minute for one, minutes for several
  let minute = "minutes";
  if (timingInt === 1 || timingInt === -1) { 
    minute = "minute";
  }

  //Handle 999 (unknown) timing
  if (timingInt > 100) { outString = `Unknown`; }

  //Remove the minus when early
  else if (timingInt < 0) { 
    timing = -timingInt;
    outString = `Early (${timing} ${minute})`; 
  }
  else if (timingInt > 0) { outString = `Late (${timing} ${minute})`; }
  else if (timingInt === 0) { outString = `On time`; }

  return outString;
}


//Parse time 
function drawTime() {  
  const date = new Date();

  let hour = (date.getUTCHours() - 5).toString();
  let minute = date.getMinutes().toString();
  let second = date.getSeconds().toString();

  if (hour.length < 2) { hour = "0" + hour; }
  if (minute.length < 2) { minute = "0" + minute; }
  if (second.length < 2) { second = "0" + second; }

  strokeWeight(1)  
  stroke(255, 255, 255)
  fill(0, 0, 0, 150);
  textFont(digitalFont)
  textSize(50);

  text(hour  + ":" + minute + ":" + second, width - 100, height - 45);
}

function drawModeButtons() {
  imageMode(CENTER);
  fill(50, 50, 50, 200);

  if (transportationMode === "bus/trolley") {
    strokeWeight(2);
    ellipse(width - 130, height - 100, 45, 45);
    strokeWeight(0);
    ellipse(width - 70, height - 100, 45, 45);
    image(whiteBus, width - 130, height - 100, 32, 32);
    image(blackTrain, width - 70, height - 100, 32, 32);
  } else if (transportationMode === "rail") {
    strokeWeight(0);
    ellipse(width - 130, height - 100, 45, 45);
    strokeWeight(2);
    ellipse(width - 70, height - 100, 45, 45);
    image(blackBus, width - 130, height - 100, 32, 32);
    image(whiteTrain, width - 70, height - 100, 32, 32);
  }
}




