import { ProcessedChatMessage } from './messages'

export interface ChatSession {
    remoteUsername: string
    messages: ProcessedChatMessage[]
}
