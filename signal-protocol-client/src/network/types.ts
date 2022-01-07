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
