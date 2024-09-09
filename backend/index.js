import express from 'express';
import cors from 'cors';
import Pendulum from './pendulum.js';


let instanceNumber = 0;
let port = 3000;
let neighbours = [];

// parse arguments
for (let i = 0; i < process.argv.length; ++i) {
  const arg = process.argv[i];

  if (arg === '-i' || arg === '--instance') {
    instanceNumber = process.argv[++i];
    port = 3000 + Number(instanceNumber);
  }
}

const app = express()
app.use(cors());
app.use(express.json());

const pendulum = new Pendulum();

app.get('/coordinates', (req, res) => {
  res.send({x: pendulum.x, y: pendulum.y});
});

app.post('/configure', (req, res) => {
  console.log(instanceNumber, 'Configuring');
  pendulum.configure(req.body.mass, req.body.angularOffset, req.body.stringLength, req.body.stringOffset);
  res.send();
});

app.get('/start', (_, res) => {
  console.log(instanceNumber, 'Starting');
  pendulum.start();
  res.send();
});

app.get('/stop', (_, res) => {
  console.log(instanceNumber, 'Stopping');
  pendulum.stop();
  res.send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});