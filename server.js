const express = require('express');
const dotenv = require('dotenv-safe');
dotenv.config();

const app = express();

app.use(express.json());


const startChat = async (inputPrompt, accessToken) => {
  const { ChatGPTUnofficialProxyAPI } = await import('chatgpt');
  const ora = await import('ora');
  const api = new ChatGPTUnofficialProxyAPI({
    accessToken,
    debug: false
  });

  let prompt = inputPrompt;

  const res1 = await ora.oraPromise(api.sendMessage(prompt), {
    text: prompt
  });

  const prompt2 = 'Finish';

  const res2 = await ora.oraPromise(
    api.sendMessage(prompt2, {
      conversationId: res1.conversationId,
      parentMessageId: res1.id
    }),
    {
      text: prompt2
    }
  );

  return res1.text + "\n"  + res2.text;
}

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


  // Start the background task
  const responsePromise = startChat(inputPrompt, accessToken);
  // Set a timeout for the background task to complete (in this case, 60 seconds)
  const timeout = 60 * 1000;

  // Set an interval to periodically check if the background task has completed
  const interval = 5 * 1000;
  let elapsed = 0;
  const intervalId = setInterval(async () => {
    elapsed += interval;
    if (elapsed >= timeout) {
      // If the timeout is reached, clear the interval and return a timeout error response
      clearInterval(intervalId);
      res.status(408).send('Request timed out');
    } else {
      // If the timeout is not reached, check if the background task has completed
      const response = await responsePromise;
      if (response) {
        // If the background task has completed, clear the interval and send the response
        clearInterval(intervalId);
        res.send(response);
      }
    }
  }, interval);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
