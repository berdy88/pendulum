export class PendulumControls {
  _angularOffset = 0;
  angularOffsetControl;
  _mass = 25;
  massControl;
  _stringLength = 0;
  stringLengthControl;

  _onChange;

  constructor(pendulumIndex, onChange) {
    const controls = document.querySelector(`#pendulum-${pendulumIndex}-controls`);
    if (controls) {
      this.angularOffsetControl = controls.querySelector('[name=angularOffset]');
      this.angularOffsetControl.addEventListener('change', (ev) => this.angularOffset = Number(ev.target.value));
      this.massControl = controls.querySelector('[name=mass]');
      this.massControl.addEventListener('change', (ev) => this.mass = Number(ev.target.value));
      this.stringLengthControl = controls.querySelector('[name=stringLength]');
      this.stringLengthControl.addEventListener('change', (ev) => this.stringLength = Number(ev.target.value));
    }

    if (typeof onChange === 'function') {
      this._onChange = onChange;
    }
  }

  get angularOffset() {
    return this._angularOffset;
  }
  set angularOffset(angle) {
    this._angularOffset = angle;
    this.angularOffsetControl.value = angle;
    this._onChange && this._onChange({angularOffset: angle});
  }

  get mass() {
    return this._angularOffset;
  }
  set mass(mass) {
    this._mass = mass;
    this.massControl.value = mass;
    this._onChange && this._onChange({mass: mass});
  }

  get stringLength() {
    return this._stringLength;
  }
  set stringLength(length) {
    this._stringLength = length;
    this.stringLengthControl.value = length;
    this._onChange && this._onChange({stringLength: length});
  }

  get params() {
    return {
      angularOffset: this._angularOffset,
      mass: this._mass,
      stringLength: this._stringLength
    }
  }

  set params(params) {
    this.angularOffset = params.angularOffset;
    this.mass = params.mass;
    this.stringLength = params.stringLength;
  }
}