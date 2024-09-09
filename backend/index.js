import express from 'express';
import cors from 'cors';
import Pendulum from './pendulum.js';

const port = 3000;
const app = express()
app.use(cors());
app.use(express.json());

const pendulum = new Pendulum();

app.get('/coordinates', (req, res) => {
  res.send({x: pendulum.x, y: pendulum.y});
});

app.post('/configure', (req, res) => {
  pendulum.configure(req.body.mass, req.body.angularOffset, req.body.stringLength, req.body.stringOffset);
  res.send();
});

app.get('/start', (_, res) => {
  pendulum.start();
  res.send();
});

app.get('/stop', (_, res) => {
  pendulum.stop();
  res.send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});