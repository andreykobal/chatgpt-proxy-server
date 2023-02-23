const express = require('express');
const dotenv = require('dotenv-safe');
dotenv.config();

const app = express();

app.use(express.json());

app.post('/', async (req, res) => {
  const { ChatGPTUnofficialProxyAPI } = await import('chatgpt');
  const ora = await import('ora');

  const api = new ChatGPTUnofficialProxyAPI({
    accessToken: process.env.OPENAI_ACCESS_TOKEN,
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

  const response = "Response 1: " + res1.text + "\n Response 2: "  + res2.text;

  res.send(response);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
