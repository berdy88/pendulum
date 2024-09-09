export default class Pendulum {
  x = 0;
  y = 0;
  mass;
  angularOffset;
  stringLength = 0;

  angle;
  velocity = 0;

  interval;
  simulationRunning = false;

  configure(mass, angularOffset, stringLength) {
    this.mass = mass;

    this.angularOffset = angularOffset;
    this.angle = this.angularOffset;

    this.stringLength = stringLength;
    this.start();
  }

  start() {
    if (this.interval) {
      this.stop();
    }
    this.angle = this.angularOffset;  // reset initially configured angle
    this.updatePosition();
    this.interval = setInterval(() => this.updatePosition(), 10);
    this.simulationRunning = true;
  }

  stop() {
    clearInterval(this.interval);
    this.simulationRunning = false;
  }

  updatePosition() {
    const acceleration = -1 * Math.sin(this.angle) * this.mass * 0.0110808 / this.stringLength;
    this.velocity += acceleration;
    this.angle += this.velocity;

    this.x = (this.stringLength * Math.sin(this.angle));
    this.y = this.stringLength * Math.cos(this.angle);

    // dampen the velocity
    this.velocity *= 0.999;
  }
}