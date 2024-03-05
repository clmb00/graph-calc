// Data
let showAxisX = true;
let showAxisY = true;
let showNumbers = true;
let showGrid = true;
let showGridDetails = false;
let showSnapPoints = true;

let axisColor = '#222';
const gridColor = '#ccc';
const fontFamily = 'Arial';
let fontSize = '14px';
const functionColors = [
  'rgb(255, 89, 94)',
  'rgb(25, 130, 196)',
  'rgb(255, 202, 58)',
  'rgb(86, 90, 160)',
  'rgb(138, 201, 38)',
  'rgb(54, 148, 157)',
  'rgb(255, 146, 76)',
  'rgb(66, 103, 172)',
  'rgb(197, 202, 48)',
  'rgb(106, 76, 147)',
]

const relationUnitFont = {
  20: 2,
  10: 5,
  9: 10,
  8: 10,
  7: 10,
  6: 25,
  5: 25,
  4: 25,
  3: 50,
  2: 50,
  1: 50,
}
const snapThreshold = 10;
const virtualPointer = {
  x: null,
  y: null,
  label: null
}
let activeStatus = null;

let geometricObjects = {
  pointsArray: [],
  segmentsArray: [],
  functionsArray: [],
  anglesArray: []
}

let unit = 40;

// Canvas
const plane = document.getElementById('plane');
const ctx = plane.getContext('2d');

window.addEventListener('load', init)
window.addEventListener('resize', init)

function init() {
  plane.width = window.innerWidth * 0.8;
  plane.height = window.innerHeight;
  update();
}

// HANDLE UPDATE PLANE
function update(){

  if(showGridDetails) drawDetailedGrid();
  if(showGrid) drawGrid();
  drawAxis(showAxisX, showAxisY);
  if(showNumbers) drawLabels();
  if(showSnapPoints) snapPoints();

  for (property in geometricObjects) {
    geometricObjects[property].forEach(object => {
      object.draw();
    });
  }

}

// HANDLE ZOOM
plane.addEventListener('wheel', (e) => {
  let scroll = e.deltaY || e.detail || -e.wheelDelta;

  // 1 2 3 4 5 6 7 8 9 10 20 30 | 40 | 50 60 70 80 90 100 110 120 130 140
  if(scroll > 0){
    if(unit > 10){
      unit -= 10;
    } else {
      if(unit > 1) unit -= 1;
    }
  } else {
    if(unit < 10){
      unit += 1;
    } else{
      if(unit < 140) unit += 10;
    }
  }

  if (0 < unit && unit <= 10) {
    fontSize = '10px'
  } else if(10 < unit && unit <= 80){
    fontSize = '14px'
  } else {
    fontSize = '20px'
  }
  ctx.font = fontSize + ' ' + fontFamily;

  ctx.clearRect(0, 0, plane.width, plane.height);
  update();
  
  console.log(unit);
})

let tempA = {x: null, y: null}, tempB = {x: null, y: null}, tempC = {x: null, y: null};

// HANDLE ACTIONS
plane.addEventListener('mousedown', (e) => {

  switch(activeStatus) {
    case 'point':
      addPoint(e);
      break;
    case 'segment':
      addSegment(e);
      break;
    case 'line':
      addLine(e);
      break;
    case 'angle':
      addAngle(e);
      break;
    case 'intersect':
      findIntersection(e);
      break;
    case 'circle':
      addCircle(e);
      break;
    default:
      console.log(geometricObjects.pointsArray);
  };
})

// Functions

const labelObjects = document.getElementById('container_objects');

function updateObjectsList(){

  labelObjects.innerHTML = '';

  for (const property in geometricObjects){
    geometricObjects[property].forEach(obj => {
      let check = obj.hide ? '' : "checked='checked'";
      let newObj = `
          <div class="obj">
            <label class="check_container">
              <input id="` + obj.label + `" type="checkbox"` + check + `>
              <span class="checkmark"></span>
            </label>
            <p class="label">` + obj.coord + `</p>
          </div>
        `
      labelObjects.innerHTML += newObj;
    });
    if(geometricObjects[property].length != 0) labelObjects.innerHTML += `<hr>`;
  }

}

function snapPoints(){

  document.addEventListener('mousemove', function(event) {
    // Get the current cursor position
    const cursorPosition = { x: event.clientX, y: event.clientY };
  
    // Calculate the distance between the cursor and the snap point
    for (const element of geometricObjects.pointsArray){
      
      let distance = Point.distance({x: cursorPosition.x, y: cursorPosition.y}, {x: element.xPlaneValue, y: element.yPlaneValue});
  
      if(distance < snapThreshold) {
        document.body.style.cursor = 'pointer';
        plane.style.cursor = 'pointer';
        virtualPointer.x = element.xPlaneValue;
        virtualPointer.y = element.yPlaneValue;
        virtualPointer.label = element.label
        element.highlight()
        break;

      } else {
        document.body.style.cursor = 'default';
        plane.style.cursor = 'default';
        element.draw()
        virtualPointer.x = null;
        virtualPointer.y = null;
        virtualPointer.label = null;
      }

    }
  });

}

function drawAxis(boolShowAxisX, boolShowAxisY){

  ctx.beginPath();

  // x-axis
  if(boolShowAxisX){
    ctx.moveTo(0, plane.height / 2)
    ctx.lineTo(plane.width, plane.height / 2)
  }

  // y-axis
  if(boolShowAxisY){
    ctx.moveTo(plane.width / 2, 0)
    ctx.lineTo(plane.width / 2, plane.height)
  }

  ctx.strokeStyle = axisColor;
  ctx.stroke();
}

function drawGrid(){

  ctx.beginPath();

  for (let i = 0; i <= plane.width / 2; i += unit) {
    if(!relationUnitFont[unit] || i / unit % relationUnitFont[unit] == 0){
      // positive y// grid
      ctx.moveTo(i + (plane.width / 2), 0)
      ctx.lineTo(i + (plane.width / 2), plane.height)

      // negative y// grid
      ctx.moveTo(-i + (plane.width / 2), 0)
      ctx.lineTo(-i + (plane.width / 2), plane.height)
    }
  }

  for (let i = 0; i <= plane.height / 2; i += unit){
    if(!relationUnitFont[unit] || i / unit % relationUnitFont[unit] == 0){
      // negative x// grid
      ctx.moveTo(0, i + (plane.height / 2))
      ctx.lineTo(plane.width, i + (plane.height / 2))
    
      // positive x// grid
      ctx.moveTo(0, -i + (plane.height / 2))
      ctx.lineTo(plane.width, -i + (plane.height / 2))
    }
  }

  ctx.strokeStyle = gridColor;
  ctx.stroke();
}

function drawDetailedGrid(){

  ctx.beginPath();

  for (let i = 0; i <= plane.width / 2; i += unit / 5) {
    if(!relationUnitFont[unit] || i / unit % relationUnitFont[unit] == 0){
      // positive y// grid
      ctx.moveTo(i + (plane.width / 2), 0)
      ctx.lineTo(i + (plane.width / 2), plane.height)

      // negative y// grid
      ctx.moveTo(-i + (plane.width / 2), 0)
      ctx.lineTo(-i + (plane.width / 2), plane.height)
    }
  }

  for (let i = 0; i <= plane.height / 2; i += unit / 5){
    if(!relationUnitFont[unit] || i / unit % relationUnitFont[unit] == 0){
      // negative x// grid
      ctx.moveTo(0, i + (plane.height / 2))
      ctx.lineTo(plane.width, i + (plane.height / 2))
    
      // positive x// grid
      ctx.moveTo(0, -i + (plane.height / 2))
      ctx.lineTo(plane.width, -i + (plane.height / 2))
    }
  }

  ctx.strokeStyle = '#eee';
  ctx.stroke();
}

function drawLabels(){

  ctx.beginPath();

  // x-axis labels and tick marks
  if(showAxisX){
    for (let i = unit; i < plane.width / 2; i += unit) {
      if(!relationUnitFont[unit] || i / unit % relationUnitFont[unit] == 0){
        ctx.fillText(i / unit, i + (plane.width / 2) - 4, plane.height / 2 - 8)
        ctx.moveTo(i + (plane.width / 2), plane.height / 2 + 5);
        ctx.lineTo(i + (plane.width / 2), plane.height / 2 - 5);
    
        ctx.fillText(-i / unit, -i + (plane.width / 2) - 8, plane.height / 2 - 8)
        ctx.moveTo(-i + (plane.width / 2), plane.height / 2 + 5);
        ctx.lineTo(-i + (plane.width / 2), plane.height / 2 - 5);
      }
    }
  }

  // y-axis labels and tick marks
  if(showAxisY){
    for (let i = unit; i < plane.height / 2; i += unit) {
      if(!relationUnitFont[unit] || i / unit % relationUnitFont[unit] == 0){
        ctx.fillText(-i / unit, plane.width / 2 + 8, i + (plane.height / 2) + 4);
        ctx.moveTo(plane.width / 2 - 5, i + (plane.height / 2));
        ctx.lineTo(plane.width / 2 + 5, i + (plane.height / 2));
  
        ctx.fillText(i / unit, plane.width / 2 + 8, -i + (plane.height / 2) + 4);
        ctx.moveTo(plane.width / 2 - 5, -i + (plane.height / 2));
        ctx.lineTo(plane.width / 2 + 5, -i + (plane.height / 2));
      }
    }
  }

  ctx.strokeStyle = axisColor;
  ctx.stroke();
}

function addPoint(e){
  console.log(e);
  geometricObjects.pointsArray.push(new Point(e.clientX, e.clientY));
  geometricObjects.pointsArray[geometricObjects.pointsArray.length - 1].draw();
  updateObjectsList();
}

function addPointfromInput(input){
  if(/^\(\d,\d\)$/.test(input)){
    let firstNumber = input.slice(input.search(/\(/) + 1, input.search(/,/)).trim()
    let secondNumber = input.slice(input.search(/,/) + 1, input.search(/\)/)).trim()
    let e = {};
    e.x = Coordinates.xPlaneValue(firstNumber);
    e.y = Coordinates.yPlaneValue(secondNumber);
    geometricObjects.pointsArray.push(new Point(e.x, e.y));
    geometricObjects.pointsArray[geometricObjects.pointsArray.length - 1].draw();
    updateObjectsList();
  } else {
    console.log('error');
  }
}

function addSegment(e){

  if(tempA.x == null && tempA.y == null){
    if(virtualPointer.x != null && virtualPointer.y != null){
      tempA.x = virtualPointer.x;
      tempA.y = virtualPointer.y;
      tempA.label = virtualPointer.label;
    } else {
      tempA.x = e.clientX;
      tempA.y = e.clientY;
      // add point later turn in function
      geometricObjects.pointsArray.push(new Point(e.clientX, e.clientY));
      geometricObjects.pointsArray[geometricObjects.pointsArray.length - 1].draw();
      tempA.label = geometricObjects.pointsArray[geometricObjects.pointsArray.length - 1].label;
      updateObjectsList();
    }
  } else if (tempB.x == null && tempB.y == null){

    if(virtualPointer.x != null && virtualPointer.y != null){
      tempB.x = virtualPointer.x;
      tempB.y = virtualPointer.y;
      tempB.label = virtualPointer.label
    } else {
      tempB.x = e.clientX;
      tempB.y = e.clientY;
      // add point later turn in function
      geometricObjects.pointsArray.push(new Point(e.clientX, e.clientY));
      geometricObjects.pointsArray[geometricObjects.pointsArray.length - 1].draw();
      tempB.label = geometricObjects.pointsArray[geometricObjects.pointsArray.length - 1].label;
      updateObjectsList();
    }

    // draw
    geometricObjects.segmentsArray.push(new Segment(tempA, tempB));
    geometricObjects.segmentsArray[geometricObjects.segmentsArray.length - 1].draw();
    updateObjectsList();

    tempA = {x: null, y: null}
    tempB = {x: null, y: null};
  }
}

function addLine(e){
  if(tempA.x == null && tempA.y == null){
    if(virtualPointer.x != null && virtualPointer.y != null){
      tempA.x = virtualPointer.x;
      tempA.y = virtualPointer.y;
    } else {
      tempA.x = e.clientX;
      tempA.y = e.clientY;
      // add point later turn in function
      geometricObjects.pointsArray.push(new Point(e.clientX, e.clientY));
      geometricObjects.pointsArray[geometricObjects.pointsArray.length - 1].draw();
      updateObjectsList();
    }
  } else if (tempB.x == null && tempB.y == null){

    if(virtualPointer.x != null && virtualPointer.y != null){
      tempB.x = virtualPointer.x;
      tempB.y = virtualPointer.y;
    } else {
      tempB.x = e.clientX;
      tempB.y = e.clientY;
      // add point later turn in function
      geometricObjects.pointsArray.push(new Point(e.clientX, e.clientY));
      geometricObjects.pointsArray[geometricObjects.pointsArray.length - 1].draw();
      updateObjectsList();
    }

    // draw
    // y = mx+q
    const steigung = -(tempB.y - tempA.y) / (tempB.x - tempA.x) // m
    const y_achsenabschnittA = (-( tempA.y - plane.height / 2 ) / unit) - steigung * (( tempA.x - plane.width / 2 ) / unit)

    const equation = steigung.toFixed(2) + ' * x + ' + y_achsenabschnittA.toFixed(2);

    addFunction(equation);

    tempA = {x: null, y: null}
    tempB = {x: null, y: null};
  }
}

function addFunction(equation){
  geometricObjects.functionsArray.push(new Function(equation));
  geometricObjects.functionsArray[geometricObjects.functionsArray.length - 1].draw();
  updateObjectsList();
}

function addAngle(e){
  
  if(tempA.x == null && tempA.y == null){
    
    if(virtualPointer.x != null && virtualPointer.y != null){
      tempA.x = virtualPointer.x;
      tempA.y = virtualPointer.y;
      tempA.label = virtualPointer.label;
    } else {
      tempA.x = e.clientX;
      tempA.y = e.clientY;
      // add point later turn in function
      geometricObjects.pointsArray.push(new Point(e.clientX, e.clientY));
      geometricObjects.pointsArray[geometricObjects.pointsArray.length - 1].draw();
      tempA.label = geometricObjects.pointsArray[geometricObjects.pointsArray.length - 1].label;
      updateObjectsList();
    }
    
  } else if (tempB.x == null && tempB.y == null){
    
    if(virtualPointer.x != null && virtualPointer.y != null){
      tempB.x = virtualPointer.x;
      tempB.y = virtualPointer.y;
      tempB.label = virtualPointer.label
    } else {
      tempB.x = e.clientX;
      tempB.y = e.clientY;
      // add point later turn in function
      geometricObjects.pointsArray.push(new Point(e.clientX, e.clientY));
      geometricObjects.pointsArray[geometricObjects.pointsArray.length - 1].draw();
      tempB.label = geometricObjects.pointsArray[geometricObjects.pointsArray.length - 1].label;
      updateObjectsList();
    }
    
  } else if (tempC.x == null && tempC.y == null){
    
    if(virtualPointer.x != null && virtualPointer.y != null){
      tempC.x = virtualPointer.x;
      tempC.y = virtualPointer.y;
      tempC.label = virtualPointer.label
    } else {
      tempC.x = e.clientX;
      tempC.y = e.clientY;
      // add point later turn in function
      geometricObjects.pointsArray.push(new Point(e.clientX, e.clientY));
      geometricObjects.pointsArray[geometricObjects.pointsArray.length - 1].draw();
      tempC.label = geometricObjects.pointsArray[geometricObjects.pointsArray.length - 1].label;
      updateObjectsList();
    }
    
    // draw
    geometricObjects.anglesArray.push(new Angle(tempA, tempB, tempC));
    geometricObjects.anglesArray[geometricObjects.anglesArray.length - 1].draw();
    updateObjectsList();
  
    tempA = {x: null, y: null};
    tempB = {x: null, y: null};
    tempC = {x: null, y: null};
  }
}

function addCircle(e){
  
  if(tempA.x == null && tempA.y == null){
    if(virtualPointer.x != null && virtualPointer.y != null){
      tempA.x = virtualPointer.x;
      tempA.y = virtualPointer.y;
      tempA.label = virtualPointer.label;
    } else {
      tempA.x = e.clientX;
      tempA.y = e.clientY;
      // add point later turn in function
      geometricObjects.pointsArray.push(new Point(e.clientX, e.clientY));
      geometricObjects.pointsArray[geometricObjects.pointsArray.length - 1].draw();
      tempA.label = geometricObjects.pointsArray[geometricObjects.pointsArray.length - 1].label;
      updateObjectsList();
    }
  } else if (tempB.x == null && tempB.y == null){
    
    if(virtualPointer.x != null && virtualPointer.y != null){
      tempB.x = virtualPointer.x;
      tempB.y = virtualPointer.y;
      tempB.label = virtualPointer.label
    } else {
      tempB.x = e.clientX;
      tempB.y = e.clientY;
      
    }

    // draw
    // geometricObjects.segmentsArray.push(new Segment(tempA, tempB));
    // geometricObjects.segmentsArray[geometricObjects.segmentsArray.length - 1].draw();
    // updateObjectsList();
    
    console.log('nope');
    
    tempA = {x: null, y: null}
    tempB = {x: null, y: null};
  }
  
}

function addCirclefromInput(equation){
  geometricObjects.functionsArray.push(new Function(equation));
  geometricObjects.functionsArray[geometricObjects.functionsArray.length - 1].draw();
  geometricObjects.functionsArray.push(new Function('-' + equation));
  geometricObjects.functionsArray[geometricObjects.functionsArray.length - 1].draw();
  updateObjectsList();
}

function findIntersection(e){
  console.log('nope');
}
