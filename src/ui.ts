import ora from 'ora'
import type { AIMessage } from '../types'

export const logLoader = (text: string = '🤔💭') => {
    const spinner = ora({
        text,
        color: 'cyan',
    }).start()

    return {
        stop: () => spinner.stop(),
        update: (text: string) => (spinner.text = text),
        succeed: (text: string) => spinner.succeed(text),
        fail: (text: string) => spinner.fail(text)
    }
}

export const logMessage = (message: AIMessage) => {
    const roleColors = {
        user: '\x1b[1;36m',
        assistant: '\x1b[1;32m',
    }

    const reset = '\x1b[0m'
    const role = message?.role
    const color = roleColors[role as keyof typeof roleColors] || '\x1b[1;37m'

    // Hide tool messages
    if (role === 'tool') {
        return
    }

    if (role === 'user') {
        console.log(`${color}[USER]${reset}`)
        console.log(`${message?.content}\n`)
        return
    }

    if (role === 'assistant') {
        if (message?.tool_calls) {
            message.tool_calls.forEach((toolCall) => {
                console.log(`\n${color}[ASSISTENT]${reset}`)
                console.log(`${toolCall.function.name}: ${toolCall.function.arguments}\n`)
            })
        }

        if (message?.content) {
            console.log(`${color}[ASSISTENT]${reset}`)
            console.log(message.content)
        }
    }

}