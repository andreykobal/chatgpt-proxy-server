const express = require('express');
const dotenv = require('dotenv-safe');
dotenv.config();

const app = express();

app.use(express.json());

app.post('/', async (req, res) => {
  const fetch = await import('node-fetch').then(module => module.default);
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'forbiddenua@gmail.com', password: '99apofID' })
  };
  const authResponse = await fetch('https://open-ai-auth.herokuapp.com/auth', requestOptions);
  const authData = await authResponse.json();

  const { ChatGPTUnofficialProxyAPI } = await import('chatgpt');
  const ora = await import('ora');

  const api = new ChatGPTUnofficialProxyAPI({
    accessToken: authData.access_token,
    debug: false
  });

  const inputPrompt = req.body.inputString;

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

  const response = res1.text + "\n"  + res2.text;

  res.send(response);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
