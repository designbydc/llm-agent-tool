import OpenAI from 'openai'
import { streamingNode } from './tools/audio'
import { translatorTool } from './tools/translator'

export const doTool = async (
    toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
    userMessage: string,
) => {
    const input = {
        userMessage,
        toolArgs: JSON.parse(toolCall.function.arguments),
    }

    switch (toolCall.function.name) {
        case 'audio':
            const audio = await streamingNode(input)
            return 'Some nice audio stream'
        
        case 'translator':
            const translation = await translatorTool(input)
            return translation

        default:
            throw new Error(`Tool ${toolCall.function.name} not found`)
    }
}