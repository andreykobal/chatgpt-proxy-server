const express = require('express');
const dotenv = require('dotenv-safe');
dotenv.config();

const app = express();

app.use(express.json());

const { Worker } = require('worker_threads');

app.post('/', async (req, res) => {
  const fetch = await import('node-fetch').then(module => module.default);
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'forbiddenua@gmail.com', password: '99apofID' })
  };
  const authResponse = await fetch('https://open-ai-auth.herokuapp.com/auth', requestOptions);
  const authData = await authResponse.json();

  const accessToken = authData.access_token;
  const inputPrompt = req.body.inputString;

  const path = require('path');
  const workerPath = path.join(__dirname, 'worker.js');
  const worker = new Worker(workerPath);

  worker.on('message', (message) => {
    console.log('Worker finished executing');
  });
  worker.on('error', (error) => {
    console.error(error);
  });
  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(new Error(`Worker stopped with exit code ${code}`));
    }
  });

  worker.postMessage({ inputPrompt, accessToken });

  res.send('Request accepted');

});

app.get('/result', (req, res) => {
  //if (global.result.length > 0) {
    console.log(global.result);
    res.send(global.result);
  // } else {
  //   res.status(404).send('Result not ready');
  // }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));