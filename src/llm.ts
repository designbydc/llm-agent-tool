import type { z } from 'zod'
import { zodFunction } from 'openai/helpers/zod'
import { clientAI, handleOpenAIError } from './clientAI'
import { systemPromt } from './systemPrompt'
import type { AIMessage } from '../types'

export async function doLLM({
    messages,
    tools
}: {
    messages: AIMessage[]
    tools?: {
        name: string
        parameters: z.AnyZodObject
    }[]
}) {
    try {
        const formattedTools = tools?.map(tool => zodFunction(tool))
        const { choices } = await clientAI.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: .1,
            messages: [
                { 
                    role: 'system', 
                    content: systemPromt 
                },
                ...messages
            ],
            tools: formattedTools,
            tool_choice: 'auto',
            parallel_tool_calls: false
        });
    
        return choices[0].message
    } catch (error) {
        handleOpenAIError(error)
    }
}