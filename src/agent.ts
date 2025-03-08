import type { z } from 'zod'
import { doLLM } from './llm'
import { addMessages, getMessages, saveToolResponse } from './store'
import { doTool } from './toolHandler'
import { logLoader, logMessage } from './ui'

export const doAgent = async ({
    userMessage,
    tools
}: {
    userMessage: string
    tools?: {
        name: string
        parameters: z.AnyZodObject
    }[]
}) => {
    await addMessages([
        { 
            role: 'user',
            content: userMessage
        },
    ])

    const loader = logLoader()

    while(true) {
        const history = await getMessages()
        const response = await doLLM({
            messages: history,
            tools,
        })
        
        loader.stop()

        if (!response) {
            return
        }

        await addMessages([response])

        logMessage(response)
        
        if (response.content) {
            loader.stop()
            return getMessages()
        }

        if (response.tool_calls) {
            const toolCall = response.tool_calls[0]
            loader.update(`Executing ${toolCall.function.name}...`)
            
            const toolResponse = await doTool(toolCall, userMessage)
            await saveToolResponse(toolCall.id, toolResponse)

            loader.update(`Tool ${toolCall.function.name} executed successfully`)
        }
    }
}