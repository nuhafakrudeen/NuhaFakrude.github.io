// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_size;
  void main(){
    gl_Position = a_Position;
    gl_PointSize = u_size;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main(){
    gl_FragColor = u_FragColor;
  }`;

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_size;

function setupWebGL() {
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_size
  u_size = gl.getUniformLocation(gl.program, 'u_size');
  if (!u_size) {
    console.log('Failed to get the storage location of u_size');
    return;
  }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const BUTTERFLY = 3; //for my drawing
const HEART = 4;

// Global variables for UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectSize = 5;
let g_selectedType = POINT;
let g_selectedSegments = 10;

// Background color state
let bgColor = [0.0, 0.0, 0.0, 1.0];

function addActionsForHtmlUI() {
  document.getElementById('clearButton').onclick = function () {
    g_shapesList = [];
    renderAllShapes();
  };

  document.getElementById('undoButton').onclick = function () {
    if (g_shapesList.length > 0) {
      g_shapesList.pop(); // Remove the last shape
      renderAllShapes();  // Re-render the canvas
    }
  };

  document.getElementById('pointButton').onclick = function () {
    g_selectedType = POINT;
  };

  document.getElementById('triButton').onclick = function () {
    g_selectedType = TRIANGLE;
  };

  document.getElementById('circleButton').onclick = function () {
    g_selectedType = CIRCLE;
  };

  document.getElementById('heartButton').onclick = function () {
    g_selectedType = HEART;
  };

  document.getElementById('redSlide').addEventListener('input', function () {
    g_selectedColor[0] = this.value / 100;
  });

  document.getElementById('greenSlide').addEventListener('input', function () {
    g_selectedColor[1] = this.value / 100;
  });

  document.getElementById('blueSlide').addEventListener('input', function () {
    g_selectedColor[2] = this.value / 100;
  });

  document.getElementById('sizeSlide').addEventListener('input', function () {
    g_selectSize = this.value;
  });

  document.getElementById('segmentsSlide').addEventListener('input', function () {
    g_selectedSegments = this.value;
  });

  document.getElementById('displayPaintingButton').onclick = function () {
    bgColor = [135 / 255, 206 / 255, 235 / 255, 1.0]; //sky blue background for my painting
    drawButterflyShape();
  };

  // Background color sliders
  document.getElementById('bgRed').addEventListener('input', updateBackgroundColor);
  document.getElementById('bgGreen').addEventListener('input', updateBackgroundColor);
  document.getElementById('bgBlue').addEventListener('input', updateBackgroundColor);
}

function updateBackgroundColor() {
  bgColor[0] = document.getElementById('bgRed').value / 255;
  bgColor[1] = document.getElementById('bgGreen').value / 255;
  bgColor[2] = document.getElementById('bgBlue').value / 255;

  renderAllShapes(); // Re-render the canvas with the new background color
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;

  canvas.onmousemove = function (ev) {
    if (ev.buttons == 1) {
      click(ev);
    }
  };

  // Specify the color for clearing <canvas>
  gl.clearColor(bgColor[0], bgColor[1], bgColor[2], bgColor[3]);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];

function click(ev) {
  let [x, y] = convertCoordinatesEventsToGL(ev);

  let shape;
  if (g_selectedType == POINT) {
    shape = new Point();
  } else if (g_selectedType == TRIANGLE) {
    shape = new Triangle();
  } else if (g_selectedType == CIRCLE) {
    shape = new Circle();
    shape.segments = g_selectedSegments;
  } else if (g_selectedType == HEART) {
    shape = new Heart();
  } else if (g_selectedType == BUTTERFLY) {
    return; 
  }

  shape.position = [x, y];
  shape.color = g_selectedColor.slice();
  shape.size = g_selectSize;
  g_shapesList.push(shape);

  renderAllShapes();
}

function drawButterflyShape() {
  let butterfly = new Butterfly();
  butterfly.position = [0.0, 0.0]; // Center of canvas
  butterfly.color = g_selectedColor.slice();
  butterfly.size = 0.6;
  g_shapesList.push(butterfly);
  renderAllShapes();
}

function convertCoordinatesEventsToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  return [x, y];
}

function renderAllShapes() {
  // Clear the canvas with the current background color
  gl.clearColor(bgColor[0], bgColor[1], bgColor[2], bgColor[3]);
  gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas

  g_shapesList.forEach((shape) => shape.render()); // Render all shapes
}