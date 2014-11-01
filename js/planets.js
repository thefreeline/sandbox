var rootLayer = d3.select('#rootLayer');
    var planets = d3.selectAll('circle');
    var system = createPlanetSystem(rootLayer.node(), 
      document.querySelectorAll('circle'));
    system.cx = document.documentElement.clientWidth/2;
    system.cy = document.documentElement.clientHeight/2;
 
    // animateMotion will move elements relative to their starting position.
    // So, if you move them somewhere other than 0, 0 like this, they will 
    // follow the mpath at an offset equal to wherever you move them.
    // d3.selectAll('circle').attr({
    //   cx: system.cx,
    //   cy: system.cy
    // });
 
    system.start();

// Rotates SVG elements around orbits using animateMotion paths.
 
// theRoot: Should be an SVG element to which the planets 
// will be added.
// thePlanets: Should be all of the SVG elements 
// to be given orbits in the system.
 
function createPlanetSystem(theRoot, thePlanets) {  
  var planetSystem = {
    cx: 200,
    cy: 200,
    r: 100, // TODO: Make this vary per planet.
    orbitDuration: '10s',
    clockwise: true
  };
 
  // Private ivars.
  var root = theRoot;
  var planets = thePlanets;
 
  planetSystem.start = function start() {
    var system = this;
    for (var i = 0; i < planets.length; ++i) {
      var planet = planets[i];
      var path = system.createPathForPlanetD3(i, planet);
      system.animatePlanetD3(planet, path.getAttribute('id'));
    }
  };
 
  // I tried to do this without d3 but just could not create the elements 
  // in the right namespaces.
  planetSystem.animatePlanetD3 = function animatePlanetD3(planet, motionPathId) {
    var animateMotion = d3.select(planet).append('animateMotion').attr({
      dur: this.orbitDuration,
      repeatCount: 'indefinite'
    });
 
    animateMotion.append('mpath').attr('xlink:href', '#' + motionPathId);
 
    return animateMotion.node();
  };
 
  planetSystem.createPathForPlanetD3 = 
  function createPathForPlanetD3(planetIndex, planet) {
    var path = d3.select(root).append('path').attr({
      id: planet.id + '-orbit',
      fill: 'none',
      stroke: 'black',
      strokeWidth: 2,
      'stroke-opacity': 0.2,
      d: this.makePathDataForOrbit(planetIndex, planet.dataset.orbitR)
    });
    return path.node();
  };
 
  planetSystem.makePathDataForOrbit = function makePathDataForOrbit(orbitIndex,
    orbitR) {
    var startAngle = 2 * Math.PI / planets.length * orbitIndex;
    var startPoint = this.positionOnCircle(startAngle, orbitR);
    
    // var debugColor = ['red', 'orange', 'yellow', 'green', 'blue'][orbitIndex];
    // this.addDebugCircleD3(startPoint, debugColor);
 
    var rx = orbitR;
    var ry = orbitR;
    var xAxisRotation = 0;
    var largeArcFlag = 1;
    var sweepFlag = this.clockwise ? 1 : 0;
 
    var vectorToOpposite = {
      x: -2 * (startPoint.x - this.cx),
      y: -2 * (startPoint.y - this.cy),
    };
 
    // this.addDebugCircleD3({
    //   x: startPoint.x + vectorToOpposite.x,
    //   y: startPoint.y + vectorToOpposite.y
    // },
    // debugColor);
 
    // Example data path:
    // <path d="M0,400 
    //          a200,200 0 1 0 400,0
    //          a200,200 0 1 0 -400,0"
    //       fill="green" stroke="blue" stroke-width="5" id="redOrbit" />
 
    var path = 
      // Move command
      'M' + startPoint.x + ',' + startPoint.y + ' ' + 
      // First arc command
      'a' + rx + ',' + ry + ' ' + 
      xAxisRotation + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + 
      vectorToOpposite.x + ',' + vectorToOpposite.y + ' ' + 
      // Second arc command
      'a' + rx + ',' + ry + ' ' + 
      xAxisRotation + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' +
      (-vectorToOpposite.x) + ',' + (-vectorToOpposite.y);
 
    return path;
  };
 
  planetSystem.positionOnCircle = function positionOnCircle(angle, radius) {
    var y = radius * Math.sin(angle);
    var x = radius * Math.cos(angle);
    return {x: this.cx + x, y: this.cy + y};
  };
 
  planetSystem.addDebugCircleD3 = function addDebugCircleD3(point, color) {
    d3.select(root).append('circle').attr({
      'fill': color,
      'r': 5,
      'cx': point.x,
      'cy': point.y
    });
  };
 
  return planetSystem;
}