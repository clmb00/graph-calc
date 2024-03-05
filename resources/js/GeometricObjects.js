class Coordinates {

  static xPlaneValue(value){
    return value * unit + plane.width / 2;
  }

  static yPlaneValue(value){
    return -value * unit + plane.height / 2;
  }

  static xRealValue(value){
    return ( value - plane.width / 2 ) / unit;
  }

  static yRealValue(value){
    return (-( value - plane.height / 2 ) / unit);
  }

}

class Point {

  constructor(x, y, label = null) {
    this.x = (( x - plane.width / 2 ) / unit);
    this.y = (-( y - plane.height / 2 ) / unit);
    this.label = label == null ? this.constructor.predefinedLabels[this.constructor.currentLabel++] : label;
    this.hide = false
  }

  static currentLabel = 0

  static predefinedLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

  static distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  }

  get xPlaneValue(){
    return this.x * unit + plane.width / 2;
  }

  get yPlaneValue(){
    return -this.y * unit + plane.height / 2;
  }

  get coord(){
    return this.label + ': ' + '(' + this.x.toFixed(2) + ', ' + this.y.toFixed(2) + ')';
  }

  set hideToggle(bool) {
    this.hide = bool;
  }

  highlight(){
    if(!this.hide){
      ctx.beginPath();
      ctx.arc(this.xPlaneValue, this.yPlaneValue, 4, 0, 2 * Math.PI);
      ctx.fillStyle = 'blue';
      ctx.fill()
    }
  }
  
  draw(){
    if(!this.hide){
      ctx.beginPath();
      ctx.arc(this.xPlaneValue, this.yPlaneValue, 4, 0, 2 * Math.PI);
      ctx.fillStyle = 'black';
      ctx.fill()
    }
  }

};

// take in PLANE VALUES, tranform to real one when needed
class Segment {

  constructor(a, b, label = null) {
    this.a = a;
    this.b = b;
    this.label = label == null ? a.label + b.label : label;
    this.hide = false
  }

  get distance(){
    return Point.distance({x: this.xRealValue(this.a.x), y: this.yRealValue(this.a.y)}, {x: this.xRealValue(this.b.x), y: this.yRealValue(this.b.y)}).toFixed(2);
  }

  xRealValue(value){
    return ( value - plane.width / 2 ) / unit;
  }

  yRealValue(value){
    return (-( value - plane.height / 2 ) / unit);
  }

  get coord(){
    return this.label + ': ' + this.distance;
  }

  draw(){
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.moveTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);
    ctx.stroke()
  }

}

class Function {

  constructor(equation, label = null) {
    this.equation = equation;
    this.label = label == null ? this.constructor.predefinedLabels[this.constructor.currentLabel++] : label;
    this.hide = false
    this.color = this.constructor.color > 9 ? this.constructor.color = 0 : this.constructor.color++;
  }

  static currentLabel = 0

  static predefinedLabels = ['f', 'g', 'h', 'p', 'q', 'r', 's', 't', 'a', 'b', 'd', 'e', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'u', 'v', 'w', 'x', 'y', 'z']

  static color = 0

  set newColor(color){
    this.color = color
  }

  get coord(){
    return this.label + ': ' + 'y = ' + this.equation;
  }

  draw(){

    const halfWidthPlane = plane.width / 2;
    const halfHeightPlane = plane.height / 2;
    // let increment = 1/unit; // 0.025
    const increment = 0.01;

    let direction, y1, y2, GraphX, GraphY, NextGraphX, NextGraphY;

    for(let x = Math.round(-halfWidthPlane / unit-1); x < halfWidthPlane / unit; x += increment){

      y1 = math.evaluate(this.equation, {x: x});
      GraphX = x + halfWidthPlane + x * (unit-1);
      GraphY = -y1 + halfHeightPlane - y1 * (unit-1);
      
      y2 = math.evaluate(this.equation, {x:x+increment})
      NextGraphX = (x + increment) + halfWidthPlane + (x + increment) * (unit-1);
      NextGraphY = -y2 + halfHeightPlane - y2 * (unit-1);

      if(direction != null){
        if(direction == 'incr' && NextGraphY < GraphY){
          direction = 'decr';
          GraphY = NaN;
        } else if (direction == 'decr' && NextGraphY > GraphY){
          direction = 'incr';
          GraphY = NaN;
        }
      } else {
        direction = NextGraphY > GraphY ? 'incr' : 'decr';
      }

      ctx.beginPath();
      ctx.moveTo(GraphX, GraphY)
      ctx.lineWidth = 2;
      ctx.lineTo(NextGraphX, NextGraphY);
      ctx.strokeStyle = functionColors[this.color];
      ctx.stroke();
      ctx.lineWidth = 1;
      
      // draw graph by points, useless ??
        // ctx.beginPath();
        // ctx.arc(GraphX, GraphY, 1, 0, 2*Math.PI);
        // ctx.fillStyle = 'black';
        // ctx.fill()
        // ctx.closePath();
    }
  }
}

// take in PLANE VALUES, tranform to real one when needed
class Angle {
  constructor(a, b, c, label = null) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.label = label == null ? this.constructor.predefinedLabels[this.constructor.currentLabel++] : label;
    this.hide = false
  }

  static currentLabel = 0

  static predefinedLabels = ['&alpha;', '&beta;', '&gamma;', '&delta;', '&epsilon;', '&omega;', '&zeta;', '&eta;', '&theta;', '&thetasym;', '&iota;', '&kappa;', '&lambda;', '&mu;', '&nu;', '&xi;', '&omicron;', '&pi;', '&piv;', '&rho;', '&sigmaf;', '&sigma;', '&tau;', '&upsilon;', '&phi;', '&chi;', '&psi;'];

  xRealValue(value){
    return ( value - plane.width / 2 ) / unit;
  }

  yRealValue(value){
    return (-( value - plane.height / 2 ) / unit);
  }

  get angleValue(){
    let vectorAB = {x: this.xRealValue(this.b.x) - this.xRealValue(this.a.x), y: this.yRealValue(this.b.y) - this.yRealValue(this.a.y)}
    let vectorBC = {x: this.xRealValue(this.c.x) - this.xRealValue(this.b.x), y: this.yRealValue(this.c.y) - this.yRealValue(this.b.y)}
    let angle = Math.atan2(vectorAB.x * vectorBC.y - vectorAB.y * vectorBC.x, vectorAB.x * vectorBC.x + vectorAB.y * vectorBC.y)
    return 180 - (angle * 180 / Math.PI)
  }

  get angleValueRad(){
    let vectorAB = {x: this.xRealValue(this.b.x) - this.xRealValue(this.a.x), y: this.yRealValue(this.b.y) - this.yRealValue(this.a.y)}
    let vectorBC = {x: this.xRealValue(this.c.x) - this.xRealValue(this.b.x), y: this.yRealValue(this.c.y) - this.yRealValue(this.b.y)}
    let angle = Math.atan2(vectorAB.x * vectorBC.y - vectorAB.y * vectorBC.x, vectorAB.x * vectorBC.x + vectorAB.y * vectorBC.y)
    return Math.PI - angle
  }

  get coord(){
    return this.label + ': ' + this.angleValue.toFixed(2) + '°';
  }

  draw(){
    if(!this.hide){
      ctx.save();

      ctx.translate(this.b.x, this.b.y);
      let angleWithAxisX = new Angle(this.c, this.b, {x: this.b.x + 10, y: this.b.y})
      ctx.rotate(-angleWithAxisX.angleValueRad);

      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, -this.angleValueRad, true);
      ctx.lineWidth = 12
      ctx.strokeStyle = '#a1111180';
      ctx.stroke()
      ctx.closePath();

      ctx.restore();
    }
  }

}