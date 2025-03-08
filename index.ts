import 'dotenv/config'
import 'openai/shims/node'
import { tools } from './src/tools/'
import { doAgent } from './src/agent'

const userMessage = process.argv[2]

if (!userMessage) {
    console.error('Please provide a message')
    process.exit(1)
}

const message = doAgent({
    userMessage,
    tools
})
