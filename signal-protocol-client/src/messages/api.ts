import { MessageType } from '@privacyresearch/libsignal-protocol-typescript'
import { BehaviorSubject, Subscription } from 'rxjs'
import { webSocket } from 'rxjs/webSocket'
import { setSignalWebsocket, setWebsocketSubscription, signalWebsocket } from '@app/network/websocket'

import { processPreKeyMessage, processRegularMessage } from '@app/messages/functions'
import { isSendWebSocketMessage, SendWebSocketMessage, WebSocketMessage } from '@app/network/types'

export const wssErrorSubject = new BehaviorSubject<string>('')

export function sendSignalProtocolMessage(to: string, from: string, message: MessageType): void {
    const wsm: SendWebSocketMessage = {
        action: 'sendMessage',
        address: to,
        from,
        message: JSON.stringify(message),
    }
    console.log('sending message to websocket', {wsm})
    signalWebsocket.next(wsm)
}

export function initializeSignalWebsocket(uri: string): Subscription {
    console.log('initializing websocket', {uri})
    setSignalWebsocket(webSocket<WebSocketMessage>(uri))

    const sub = signalWebsocket.subscribe({
        next: (msg) => {
            console.log(`received message on signal wss`)
            if (isSendWebSocketMessage(msg)) {
                processWebsocketMessage(msg).catch((e) => {
                    console.warn(`error accepting signal message`, { e })
                })
            } else {
                console.error('Message on wss is not recognized', {msg})
            }
        },
        error: (err) => {
            console.error(err)
            wssErrorSubject.next(
                `Error connecting to websocket at ${uri}. Check the URI to ensure it is valid. See console output for details.`
            )
        },
        complete: () => {
            console.log(`signal websocket complete`)
        },
    })

    setWebsocketSubscription(sub)
    return sub
}

export async function processWebsocketMessage(wsm: SendWebSocketMessage): Promise<void> {
    const signalMessage = JSON.parse(wsm.message) as MessageType
    console.log(`processing signal message`, {signalMessage})
    if (signalMessage.type === 1) {
        await processRegularMessage(wsm.from, signalMessage)
    } else if (signalMessage.type === 3) {
        await processPreKeyMessage(wsm.from, signalMessage)
    }
}
