import { ProcessedChatMessage } from '@app/messages/types'

export interface ChatSession {
    remoteUsername: string
    messages: ProcessedChatMessage[]
}
