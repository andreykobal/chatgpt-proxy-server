const { parentPort } = require('worker_threads');
const { ChatGPTUnofficialProxyAPI } = require('chatgpt');
const ora = require('ora');

parentPort.on('message', async ({ inputPrompt, accessToken }) => {
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

  parentPort.postMessage(res1.text + "\n" + res2.text);
});