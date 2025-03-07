import 'dotenv/config'
import 'openai/shims/node'
import { doLLM } from './src/llm'

const userMessage = process.argv[2]

if (!userMessage) {
    console.error('Please provide a message')
    process.exit(1)
}

const message = await doLLM({
    message: userMessage,
})

console.log(message)

