export class Pendulum {
  index;
  apiUrl;
  canvasContext;
  stringOffset;

  x;
  y;

  mass = 10;
  angularOffset = 0;
  stringLength = 0;

  constructor(index, canvasContext, stringOffset, color, x, y, mass) {
    this.index = index;
    this.apiUrl = `http://localhost:${3000+index}`;
    this.canvasContext = canvasContext;
    this.stringOffset = stringOffset;
    this.color = color;
    this.x = x;
    this.y = y;
    this.mass = mass;
    this.calculateParamsFromCoordinates();
  }

  calculateParamsFromCoordinates() {
    const x = this.x - this.stringOffset;
    const h = Math.sqrt(Math.pow(x, 2) + Math.pow(this.y, 2));
    this.angularOffset = Math.asin(x / h);
    this.stringLength = h;
  }

  async configure() {
    await fetch(`${this.apiUrl}/configure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mass: this.mass,
        angularOffset: this.angularOffset,
        stringLength: this.stringLength,
        stringOffset: this.stringOffset,
      })
    });
  }

  async start() {
    return fetch(`${this.apiUrl}/start`);
  }

  async stop() {
    return fetch(`${this.apiUrl}/stop`);
  }

  async getCoordinates() {
    const response = await fetch(`${this.apiUrl}/coordinates`);
    const {x, y} = await response.json();
    this.x = x;
    this.y = y;
  }

  draw() {
    const circle = new Path2D();
    circle.arc(this.x, this.y, this.mass * 2, 0, Math.PI * 2);
    this.canvasContext.fillStyle = this.color;
    this.canvasContext.fill(circle);

    this.canvasContext.beginPath();
    this.canvasContext.moveTo(this.stringOffset, 0);
    this.canvasContext.lineTo(this.x, this.y);
    this.canvasContext.lineWidth = 2;
    this.canvasContext.strokeStyle = this.color;
    this.canvasContext.stroke();
    this.canvasContext.closePath();
  }

  isWithinBob(x, y) {
    const distance = Math.sqrt(Math.pow((this.x) - x, 2) + Math.pow(this.y - y, 2));
    return distance < this.mass * 2;
  }
}