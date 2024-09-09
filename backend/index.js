import express from 'express';
import cors from 'cors';
import Pendulum from './pendulum.js';
import mqtt from 'mqtt';


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

  if (arg === '-n' || arg === '--neighbours') {
    neighbours = process.argv[++i].split(',').map(i => 3000+Number(i));
  }
}

const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');

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

app.get('/resume', (_, res) => {
  console.log(instanceNumber, 'Resuming');
  pendulum.resume();
  res.send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)

  let restartCount = 0;
  let pendingRestart = null;

  mqttClient.subscribe('perso/topic/pendulum');

  mqttClient.on('message', (topic, message) => {

    if (message.toString() === 'STOP') {
      console.log(instanceNumber, 'STOP RECEIVED!');
      pendulum.stop();
      if (pendingRestart === null) {
        pendingRestart = setTimeout(() => {
          mqttClient.publish('perso/topic/pendulum', 'RESTART');
          pendingRestart = null;
        }, 5000);
      }
    }

    if(message.toString() === 'RESTART') {
      console.log(instanceNumber, 'RESTART RECEIVED!');
      restartCount++;
      if (restartCount === 5) {
        restartCount = 0;
        pendulum.start();
      }
    }
  });

  for (const neighbour of neighbours) {
    setInterval(async () => {
      if (pendulum.simulationRunning) {
        const response = await fetch(`http://localhost:${neighbour}/coordinates`);
        const {x, y} = await response.json();

        // Check if closer than 100 (squared to save from using the `Math.sqrt` function)
        if (pendulum.getDistance(x, y) <= 10000) {
          console.log(instanceNumber, 'TOO CLOSE! SENDING STOP SIGNAL!');
          mqttClient.publish('perso/topic/pendulum', 'STOP');
          pendulum.stop();
        }
      }
    }, 20);
  }
});