import { z } from 'zod'
import type { ToolFn } from '../../types'

export const translatorToolDefinition = {
    name: 'translator',
    parameters: z.object({
        text: z.string().describe('The text to translate'),
        targetLanguage: z.string().describe('The language to translate into, like "Italian" or "French"'),
    })
}

type Args = z.infer<typeof translatorToolDefinition.parameters>

export const translatorTool: ToolFn<Args, string> = async ({ toolArgs }) => {
    return `Please translate this to ${toolArgs.targetLanguage}:\n\n${toolArgs.text}`
}