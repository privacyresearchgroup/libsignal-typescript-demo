import { SubscribeWebSocketMessage, WebSocketMessage } from '@app/network/types'
import { WebSocketSubject } from 'rxjs/webSocket'

export let signalWebsocket: WebSocketSubject<WebSocketMessage>

export function setSignalWebsocket(sws: WebSocketSubject<WebSocketMessage>): void {
    signalWebsocket = sws
}

export function subscribeWebsocket(username: string): void {
    const wsm: SubscribeWebSocketMessage = {
        action: 'subscribe',
        channels: [username],
    }
    signalWebsocket.next(wsm)
}
