import dotenv from 'dotenv-safe'
import { oraPromise } from 'ora'

import { ChatGPTUnofficialProxyAPI } from 'chatgpt'

dotenv.config()


async function main() {

  const api = new ChatGPTUnofficialProxyAPI({

    accessToken: process.env.OPENAI_ACCESS_TOKEN,


    debug: false
  })

  const prompt = 'Write 1,000 words of dialogue for two sitcom characters about absurdly funny things, start with Friend1: '

  let res = await oraPromise(api.sendMessage(prompt), {
    text: prompt
  })

  console.log('\n' + res.text + '\n')

  const prompt2 = 'Finish'

  res = await oraPromise(
    api.sendMessage(prompt2, {
      conversationId: res.conversationId,
      parentMessageId: res.id
    }),
    {
      text: prompt2
    }
  )
  console.log('\n' + res.text + '\n')

  const prompt3 = 'Finish'

  res = await oraPromise(
    api.sendMessage(prompt3, {
      conversationId: res.conversationId,
      parentMessageId: res.id
    }),
    {
      text: prompt3
    }
  )
  console.log('\n' + res.text + '\n')

  const prompt4 = 'Finish'

  res = await oraPromise(
    api.sendMessage(prompt4, {
      conversationId: res.conversationId,
      parentMessageId: res.id
    }),
    {
      text: prompt4
    }
  )
  console.log('\n' + res.text + '\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
