import { clientAI, handleOpenAIError } from './clientAI'

export async function doLLM({
    message
}: {
    message: string
}) {
    try {
        const { choices } = await clientAI.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: .1,
            messages: [
                { 
                    role: 'user', 
                    content: message 
                },
            ],
        });
    
        return choices[0].message.content
    } catch (error) {
        handleOpenAIError(error)
    }
}