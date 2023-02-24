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

  const result = res1.text + "\n" + res2.text;
  global.result = result;
  //console.log('result:' + result);
  console.log('global result:' + global.result);
};

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

  startChat(inputPrompt, accessToken);

  res.send('Request accepted');
});

app.get('/result', (req, res) => {
  if (global.result) {
    res.send(global.result);
  } else {
    res.status(404).send('Result not ready');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
