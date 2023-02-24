const { parentPort } = require('worker_threads');

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
};

if (parentPort) {
  parentPort.on('message', async ({ inputPrompt, accessToken }) => {
    const response = await startChat(inputPrompt, accessToken);
    parentPort.postMessage(response);
  });
}