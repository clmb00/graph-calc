// Aside controllers

const asideButtons = {
  'tools': document.getElementById('setTools'),
  'objects': document.getElementById('setObjects'),
  'settings': document.getElementById('setSettings'),
}
const asideContents = {
  'tools': document.getElementById('asideTools'),
  'objects': document.getElementById('asideObjects'),
  'settings': document.getElementById('asideSettings'),
}

let activeAside = 'tools';

asideButtons.tools.addEventListener('click', () => {changeAsideContent('tools')});
asideButtons.objects.addEventListener('click', () => {changeAsideContent('objects')});
asideButtons.settings.addEventListener('click', () => {changeAsideContent('settings')});

function changeAsideContent(content){
  if(activeAside != content){
    asideButtons[activeAside].classList.remove('active');
    asideContents[activeAside].classList.remove('active');
    activeAside = content;
    asideButtons[content].classList.add('active');
    asideContents[content].classList.add('active');
  }
}

// const activeAsideProxy = new Proxy({activeAside: null}, {
//   set(target, key, value) {
//     if(target[key] == value){
//       target[key] = null;
//       asideButtons[value].classList.remove('active');
//       asideContents[value].classList.remove('active');
//     } else {
//       if(target[key] != null){
//         asideButtons[target[key]].classList.remove('active');
//         asideContents[target[key]].classList.remove('active');
//       }
//       target[key] = value;
//       asideButtons[value].classList.add('active');
//       asideContents[value].classList.add('active');
//     }
//   }
// })

// -------------------------------------------

const pointButton = document.getElementById('pointButton');
const segmentButton = document.getElementById('segmentButton');
const lineButton = document.getElementById('lineButton');
const angleButton = document.getElementById('angleButton');
const circleButton = document.getElementById('circleButton');
const intersectButton = document.getElementById('intersectButton');
const clearButton = document.getElementById('clearButton');

const tooltips = {
  point: ['Add a new Point', 'Click anywhere in the plane to add a new point'],
  segment: ['Add a new Segment', 'Select two points to add a segment between those two points'],
  line: ['Add a new Line', 'Select two points to add a new line between those two points'],
  angle: ['Add a new Angle', 'Select three points to add a new line between those points'],
  circle: ['Add a new Circle', 'Select one point (center) and a second point (radius)'],
  intersect: ['Find intersection', 'Select two functions or segment to find the points of intersection']
}

pointButton.addEventListener('click', (e) => {activateButton(e, pointButton, 'point')});
segmentButton.addEventListener('click', (e) => {activateButton(e, segmentButton, 'segment')});
lineButton.addEventListener('click', (e) => {activateButton(e, lineButton, 'line')});
angleButton.addEventListener('click', (e) => {activateButton(e, angleButton, 'angle')});
circleButton.addEventListener('click', (e) => {activateButton(e, circleButton, 'circle')});
intersectButton.addEventListener('click', (e) => {activateButton(e, intersectButton, 'intersect')});

function activateButton(e, button, status) {
  e.stopPropagation();
  deactivateAll(button);
  if([...button.classList].includes('active')){
    activeStatus = null;
    button.classList.remove('active');
    closeConsole()
  } else {
    activeStatus = status;
    button.classList.add('active');
    openConsole(tooltips[status][0], tooltips[status][1]);
  }
}

// Really logic bad need fix (proxy?)
function deactivateAll(exception) {
  if(pointButton != exception) pointButton.classList.remove('active');  
  if(segmentButton != exception) segmentButton.classList.remove('active');  
  if(lineButton != exception) lineButton.classList.remove('active');
  if(angleButton != exception) angleButton.classList.remove('active');
  if(circleButton != exception) circleButton.classList.remove('active');
  if(intersectButton != exception) intersectButton.classList.remove('active');
}

clearButton.addEventListener('click', () => {
  if(confirm('Are you sure to clear all the plane?')){
    geometricObjects.pointsArray = []
    geometricObjects.segmentsArray = []
    geometricObjects.functionsArray = []
    geometricObjects.anglesArray = []
    init();
  }
})

// ------------------------------------------------------------------------------

// Settings Controller

const darkMode = document.getElementById('darkMode');
const accentColor = document.getElementById('accentColor');
const xAxisToggle = document.getElementById('xAxis');
const yAxisToggle = document.getElementById('yAxis');
const numbersToggle = document.getElementById('numbers');
const gridToggle = document.getElementById('grid');
const detailGridToggle = document.getElementById('detailGrid');
const mouseCoordToggle = document.getElementById('mouseCoord');
const biggerFontToggle = document.getElementById('biggerFont');
const snapPointsToggle = document.getElementById('snapPoints');

console.log(numbersToggle);

xAxisToggle.addEventListener('change', (e) => {
  e.target.checked ? showAxisX = true : showAxisX = false;
  init();
});

yAxisToggle.addEventListener('change', (e) => {
  e.target.checked ? showAxisY = true : showAxisY = false;
  init();
});

numbersToggle.addEventListener('change', (e) => {
  e.target.checked ? showNumbers = true : showNumbers = false;
  init();
});

snapPointsToggle.addEventListener('change', (e) => {
  e.target.checked ? showSnapPoints = true : showSnapPoints = false;
  init();
});

gridToggle.addEventListener('change', (e) => {
  e.target.checked ? showGrid = true : showGrid = false;
  init();
});

detailGridToggle.addEventListener('change', (e) => {
  e.target.checked ? showGridDetails = true : showGridDetails = false;
  init();
});

// ------------------------------------------------------------------------------

// Console controller

const tooltip = document.getElementById('footerBar');
const msgTitle = document.getElementById('msgTitle');
const msgContent = document.getElementById('msgContent');

function openConsole(title, content){
  tooltip.classList.remove('hideTooltip');
  msgTitle.innerText = title + ': ';
  msgContent.innerText = content;
}

function closeConsole() {
  tooltip.classList.add('hideTooltip');
}

// -------------------------------------------------------------------------

const selectWritingMode = document.getElementById('writingMode');
const functionIcon = document.getElementById('functionIcon');
const pointIcon = document.getElementById('pointIcon');
const circleIcon = document.getElementById('circleIcon');
const addFunctionBtn = document.getElementById('addFunction');
const addPointBtn = document.getElementById('addPoint');
const addCircleBtn = document.getElementById('addCircle');
const inputFunction = document.getElementById('inputFunction');
const inputPoint = document.getElementById('inputPoint');
const inputCircle = document.getElementById('inputCircle');
const addBtn = document.getElementById('addBtn');

let activeMode = 'function'

selectWritingMode.addEventListener('change', (e) => {
  removeAllActive();
  switch (e.target.value) {
    case 'function':
      functionIcon.classList.add('active')
      addFunctionBtn.classList.add('active')
      activeMode = 'function'
    break;
    case 'point':
      pointIcon.classList.add('active')
      addPointBtn.classList.add('active')
      activeMode = 'point'
    break;
    case 'circle':
      circleIcon.classList.add('active')
      addCircleBtn.classList.add('active')
      activeMode = 'circle'
    break;
    default:
      break;
  }
})

function removeAllActive(){
  functionIcon.classList.remove('active')
  pointIcon.classList.remove('active')
  circleIcon.classList.remove('active')
  addFunctionBtn.classList.remove('active')
  addPointBtn.classList.remove('active')
  addCircleBtn.classList.remove('active')
}



// AddGraph
inputFunction.addEventListener('keyup', (e) => {
  if(e.key == 'Enter' && inputFunction.value != '') addFunction(inputFunction.value);
});

inputPoint.addEventListener('keyup', (e) => {
  if(e.key == 'Enter' && inputPoint.value != '') addPointfromInput(inputPoint.value);
});

inputCircle.addEventListener('keyup', (e) => {
  if(e.key == 'Enter' && inputCircle.value != '') addCirclefromInput(inputCircle.value);
});

addBtn.addEventListener('click', (e) => {
  switch (activeMode) {
    case 'function':
      if(inputFunction.value != '') addFunction(inputFunction.value);
      break;
    case 'point':
      if(inputPoint.value != '') addPointfromInput(inputPoint.value);
      break;
    case 'circle':
      if(inputCircle.value != '') addCirclefromInput(inputCircle.value);
      break;
    default:
      break;
  }
});

// -------------------------------------------------------------------------