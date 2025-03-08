import { JSONFilePreset } from 'lowdb/node'
import { v4 as uuidv4 } from 'uuid'
import type { AIMessage } from '../types'

export type MessageWithMetadata = AIMessage & {
    id: string
    created_at: string
}

type MessageData = {
    messages: MessageWithMetadata[]
}

export const addMetadata = (message: AIMessage): MessageWithMetadata => ({
    ...message,
    id: uuidv4(),
    created_at: new Date().toISOString(),
})

export const removeMetadata = (message: MessageWithMetadata): AIMessage => {
    const { id, created_at, ...restMessage } = message
    return restMessage
}

const defaultMessageData: MessageData = {
    messages: []
}

export const getDB = async () => {
    const db = await JSONFilePreset('./db.json', defaultMessageData)
    return db
}

export const addMessages = async (messages: AIMessage[]) => {
    const db = await getDB()
    const newMessages = messages.map(addMetadata)
    db.data.messages.push(...newMessages)
    await db.write()
}

export const getMessages = async () => {
    const db = await getDB()
    return db.data.messages.map(removeMetadata)
}

export const saveToolResponse = async (
    toolCallID: string,
    toolResponse: string
) => {
    return await addMessages([
        {
            role: 'tool',
            content: toolResponse,
            tool_call_id: toolCallID,
        },
    ])
}

export const clearMessages = async (keepLast?: number) => {
    const db = await getDB()
    db.data.messages = db.data.messages.slice(-(keepLast || 0))
    await db.write()
}
