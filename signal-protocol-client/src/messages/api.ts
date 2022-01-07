import { MessageType } from '@privacyresearch/libsignal-protocol-typescript'
import { Subscription } from 'rxjs'
import { webSocket } from 'rxjs/webSocket'
import { setSignalWebsocket, signalWebsocket } from '@app/network/websocket'

import { processPreKeyMessage, processRegularMessage } from '@app/messages/functions'
import { isSendWebSocketMessage, SendWebSocketMessage, WebSocketMessage } from '@app/network/types'

export function sendSignalProtocolMessage(to: string, from: string, message: MessageType): void {
    const wsm: SendWebSocketMessage = {
        action: 'sendMessage',
        address: to,
        from,
        message: JSON.stringify(message),
    }
    signalWebsocket.next(wsm)
}

export function initializeSignalWebsocket(uri: string): Subscription {
    setSignalWebsocket(webSocket<WebSocketMessage>(uri))

    return signalWebsocket.subscribe({
        next: (msg) => {
            if (isSendWebSocketMessage(msg)) {
                processWebsocketMessage(msg).catch((e) => {
                    console.warn(`error accepting signal message`, { e })
                })
            }
        },
        error: (err) => {
            console.error(err)
        },
        complete: () => {
            console.log(`signal websocket complete`)
        },
    })
}

export async function processWebsocketMessage(wsm: SendWebSocketMessage): Promise<void> {
    const signalMessage = JSON.parse(wsm.message) as MessageType
    if (signalMessage.type === 1) {
        await processRegularMessage(wsm.from, signalMessage)
    } else if (signalMessage.type === 3) {
        await processPreKeyMessage(wsm.from, signalMessage)
    }
}
