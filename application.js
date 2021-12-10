let baseMap;
let liveBusData;
let liveRailData;
let railStations;
let routeNumber = 0; //Selected route
let routeText; //Route destinations
let routeDropdown;

let vehicles = []; //List for vehicle instances
let stops = []; //List for bus stop instances
let selectedVehicleInfo; //Info shown on right pane
let menu; //Menu instance
let selectedVehicleIndex;
let transportationMode = "bus/trolley";
const busMode = "bus/trolley";
const railMode = "rail"
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
  railStations = loadJSON("/data-images/rail-stations.geojson")
  blackBus = loadImage("/data-images/bus-black.png");
  whiteBus = loadImage("/data-images/bus-white.png");
  blackTrain = loadImage("/data-images/train-black.png");
  whiteTrain = loadImage("/data-images/train-white.png");
  busStopImg = loadImage("/data-images/bus-stop.png")
  digitalFont = loadFont("/data-images/digital-7.ttf")
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

  //Draw live vehicles
  if (vehicles.length != 0) {
    for (let i = vehicles.length - 1; i >= 0; i--) {
      vehicles[i].show(baseMap);
    }
  }

  if (baseMap.getZoom() > 15) {
    //Show bus stop name on hover
    //Two loops so that the name is always drawn on top of stop icon
    for (let i = 0; i < stops.length; i++) {
      stops[i].show(baseMap);
    }
    for (let i = 0; i < stops.length; i++) { 
      stops[i].showName();
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
    let line = liveRailData[i].line;
    line = line.replace("/", " ") + " Line";
    if (!lines.includes(line)) { 
      lines.push(line)
      routeDropdown.option(line)
    }
  }
}
    

  
function routeChanged() {
  routeNumber = routeDropdown.value()
  vehicles = [];
  stops = [];
  selectedVehicleIndex = undefined;
  if (transportationMode === busMode) { 
    getRouteStartEnd(liveBusData.routes[0][routeNumber]); 
    menu = new BusMenu(selectedVehicleInfo, routeNumber, routeText);
    getBusRoutes(liveBusData);
    askBusStops(routeNumber);
  } else if (transportationMode == railMode) {
      menu = new TrainMenu(selectedVehicleInfo, routeNumber);
      getRailRoutes();
      getRailStations();
  }
}



function askRoutes(){
  if (transportationMode === "bus/trolley") {
    loadJSON("https://www3.septa.org/hackathon/TransitViewAll/", getBusRoutes, "jsonp");
  } else if (transportationMode === "rail") {
    loadJSON("https://www3.septa.org/hackathon/TrainView/",  getRailRoutes, "jsonp");
  }
}

function askBusStops(routeNumber) {
  loadJSON("https://www3.septa.org/hackathon/Stops/?req1=" + routeNumber, getRouteStops, "jsonp");
}


function getRailRoutes(railData) {
  if (railData != undefined)
    liveRailData = railData; //Update for live rail routes
  if (liveRailData === undefined) return;

  for (let i in liveRailData) {
    if (routeDropdown.value() === liveRailData[i].line.replace("/", " ") + " Line") {
      const train = liveRailData[i];

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
    }
    if (selectedVehicleIndex != undefined) {
      selectedVehicleInfo = vehicles[selectedVehicleIndex].updateInfo(); //Update selected vehicle information text
      menu = new BusMenu(selectedVehicleInfo, routeNumber, routeText);
    }
  }
}


//Add bus stops of the current line to the map
function getRouteStops(busStopData) {
  for (let i = 0; i < busStopData.length; i++) {
    const busStop = new BusStop(busStopData[i].lat, busStopData[i].lng, busStopData[i].stopname.replace("amp;", ""))
    stops.push(busStop);
  }
}


//Add rail stations of the current line to the map
function getRailStations() {
  for (let i = 0; i < railStations.features.length; i++) {
    const station = railStations.features[i];

    if (station.properties.Line_Name == routeDropdown.value()) {
      const coords = station.geometry.coordinates;
      const railStation = new BusStop(coords[1], coords[0], station.properties.Station_Name);
      stops.push(railStation);
    }
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
    for (let i = 0; i < vehicles.length; i++) {
      const info = vehicles[i].select();
      
      //Select only one vehicle
      if (info != undefined) { 
        selectedVehicleInfo = info;
        selectedVehicleIndex = i;
        break; 
      }
    }

    //Deselect vehicles that are farther than 10px from click except the one that's selected
    for (let i = 0; i < vehicles.length; i++) {
      if (i != selectedVehicleIndex) {
        vehicles[i].deselect();
      }
    }
  }

  //Check click on mode buttons and do all neccessary stuff
  if (dist(mouseX, mouseY, width - 130, height - 100) <= 45) { 
    transportationMode = busMode; 
    vehicles = [];
    stops = [];
    selectedVehicleInfo = undefined;
    selectedVehicleIndex = undefined;
    routeNumber = undefined;
    routeText = undefined;
    menu = new BusMenu();
    routeDropdown.remove();
    createDropdownMenu();
    routeDropdown.option("Choose a live bus/trolley route");
    addLiveBusRoutes();
  }
  
  else if (dist(mouseX, mouseY, width - 70, height - 100) <= 45) { 
    transportationMode = railMode;
    vehicles = [];
    stops = [];
    selectedVehicleInfo = undefined;
    selectedVehicleIndex = undefined;
    routeNumber = undefined;
    routeText = undefined;
    menu = new TrainMenu();
    routeDropdown.remove();
    createDropdownMenu();
    routeDropdown.option("Choose a live rail route");
    addLiveTrainRoutes();
  }
}


//Parse time 
function drawTime() {  
  let date = new Date();

  date = ((typeof date === "string" ? new Date(date) : date).toLocaleString("en-GB", {timeZone: "EST"})); 
  time = date.split(", ")[1];
  timePieces = time.split(":");

  let hour = timePieces[0];
  let minute = timePieces[1];
  let second = timePieces[2];

  strokeWeight(1);
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