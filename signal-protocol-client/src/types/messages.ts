import { MessageType } from '@privacyresearch/libsignal-protocol-typescript'

export interface WireChatMessage {
    id: string
    address: string
    from: string
    timestamp: number
    message: MessageType
}

export interface ProcessedChatMessage {
    id: string
    address: string
    from: string
    timestamp: number
    body: string
}

export interface WebSocketMessage {
    action: 'sendMessage' | 'subscribe' | 'recent'
}

export interface SendWebSocketMessage extends WebSocketMessage {
    action: 'sendMessage'
    address: string
    from: string
    message: string
}

export interface SubscribeWebSocketMessage extends WebSocketMessage {
    action: 'subscribe'
    channels: string[]
}

export interface RequestRecentWebsocketMessage extends WebSocketMessage {
    action: 'recent'
    address: string
}

export function isSendWebSocketMessage(wsm: WebSocketMessage): wsm is SendWebSocketMessage {
    return wsm.action === 'sendMessage' && 'message' in wsm
}
