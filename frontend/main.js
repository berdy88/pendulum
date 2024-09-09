import './style.css'
import {Pendulum} from './pendulum.js';

const canvas = document.getElementById('pendulum-render');
const canvasContext = canvas.getContext('2d');

const startBtn = document.querySelector('#startBtn');
const stopBtn = document.querySelector('#stopBtn');

const danglePoints = [200, 400, 600, 800, 1000];
const pendulums = [
  new Pendulum(0, canvasContext, danglePoints[0], 100, 400, 15),
];

let simulationRunning = false;
let i = -1;
let isDragging = null;


function draw() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

  for (const p of pendulums) {
    p.draw();
  }

  requestAnimationFrame(draw);
}

async function updatePendulums() {
  const index = ++i % pendulums.length;
  if (simulationRunning) {
    await pendulums[index].getCoordinates();
    requestAnimationFrame(() => setTimeout(updatePendulums, 100));
  }
}

function start() {
  pendulums.forEach(async (p) => {
    await p.configure();
    await p.start();
  });
  simulationRunning = true;
  updatePendulums();
}

function stop() {
  simulationRunning = false;
  pendulums.forEach((p) => p.stop());
}

function getCanvasMousePosition(ev) {
  const {left: offsetX, top: offsetY} = canvas.getBoundingClientRect();
  const mouseX = ev.clientX - offsetX;
  const mouseY = ev.clientY - offsetY;

  return {x: mouseX, y: mouseY};
}

function limit(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

const canvasMouseDown = (ev) => {
  ev.preventDefault();
  ev.stopPropagation();

  const {x, y} = getCanvasMousePosition(ev);

  const pendulum = pendulums.find(p => p.isWithinBob(x, y));
  if (pendulum) {
    if (simulationRunning) {
      stop();
    }
    isDragging = pendulum.index;
  }
};

const canvasMouseMove = (ev) => {
  if (isDragging !== null) {
    const {x, y} = getCanvasMousePosition(ev);
    pendulums[isDragging].x = limit(x, 0, 1800);
    pendulums[isDragging].y = limit(y, 0, 600);
  }
};

const canvasMouseUp = (ev) => {
  if (isDragging !== null) {
    pendulums[isDragging].calculateParamsFromCoordinates();
    isDragging = null;
  }
};

canvas.addEventListener('mousedown', canvasMouseDown);
canvas.addEventListener('mousemove', canvasMouseMove);
canvas.addEventListener('mouseup', canvasMouseUp);
canvas.addEventListener('mouseout', canvasMouseUp);

startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', stop);

requestAnimationFrame(draw);
