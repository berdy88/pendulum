import './style.css'

const canvas = document.getElementById('pendulum-render');
const ctx = canvas.getContext('2d');

const ORIGIN = {
  x: 400,
  y: 0
}

const pp = {
  mass: 25,
  angle: Math.PI / 4,
  bob: {x: 0, y: 0, mass: 25},
  len: 500,
  origin: {x: 800, y: 0},
  angleV: 0,
  angleA: 0,
  force: 0,
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const force = (Math.sin(pp.angle) * (pp.mass * 0.0110808)) / pp.len;
  pp.angleA = -1 * force;
  pp.angleV += pp.angleA;
  pp.angle += pp.angleV || 0.01;

  // dampen the velocity
  pp.angleV *= 0.999;


  pp.bob.x = pp.len * Math.sin(pp.angle) + pp.origin.x;
  pp.bob.y = pp.len * Math.cos(pp.angle) + pp.origin.y;

  const circle = new Path2D();
  circle.arc(pp.bob.x, pp.bob.y, pp.bob.mass * 2, 0, Math.PI * 2);
  ctx.fill(circle);

  ctx.beginPath();
  ctx.moveTo(pp.origin.x, pp.origin.y);
  ctx.lineTo(pp.bob.x, pp.bob.y);
  ctx.stroke();
  ctx.closePath();

  requestAnimationFrame(draw);
};

requestAnimationFrame(draw);
