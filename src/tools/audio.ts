import fs from 'fs'
import path from 'path'
import { z } from 'zod'
import type { ToolFn } from '../../types'
import { clientAI } from '../clientAI'

const __filename = new URL(import.meta.url).pathname
const __dirname = path.dirname(__filename)

const file = `speech_${Date.now()}.mp3`
const speechFile = path.resolve(__dirname, file)

export const audioToolDefinition = {
    name: 'audio',
    parameters: z.object({
        text: z.string().describe('The text to convert to speech'),
    })
}

type Args = z.infer<typeof audioToolDefinition.parameters>

export const streamingNode: ToolFn<Args, void> = async ({ toolArgs }) => {
    const response = await clientAI.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: 'coral',
        input: toolArgs.text,
        instructions: 'Please whisper because somebody is sleeping',
    })

    const stream = response.body

    console.log(`Streaming response to ${speechFile}`)
    await streamToFile(stream, speechFile)
    console.log('End streaming')
}

async function streamToFile(stream: NodeJS.ReadableStream, path: fs.PathLike) {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(path).on('error', reject).on('finish', resolve)

        // If you don't see a `stream.pipe` method and you're using Node you might need to add `import 'openai/shims/node'` at the top of your entrypoint file.
        stream.pipe(writeStream).on('error', (error) => {
            writeStream.close()
            reject(error)
        })
    })
}