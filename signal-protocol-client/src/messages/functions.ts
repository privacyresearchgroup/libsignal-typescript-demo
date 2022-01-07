import { v4 as uuid } from 'uuid'

import { signalStore, usernameSubject } from '@app/identity/state'
import { addMessageToSession } from '@app/sessions/functions'
import { sessionForRemoteUser, sessionListSubject } from '@app/sessions/state'
import { ChatSession } from '@app/sessions/types'
import { ProcessedChatMessage } from '@app/types/messages'
import { MessageType, SessionCipher, SignalProtocolAddress } from '@privacyresearch/libsignal-protocol-typescript'
import { sendSignalProtocolMessage } from './api'

export async function processPreKeyMessage(address: string, message: MessageType): Promise<void> {
    console.log('processPreKeyMessage')
    const cipher = new SessionCipher(signalStore, new SignalProtocolAddress(address, 1))
    await cipher.decryptPreKeyWhisperMessage(message.body!, 'binary')

    if (sessionForRemoteUser(address)) {
        // we already have a session. we do not need this prekey message but can receive it anyway.
        // This happens when both users try to start a session before processing the prekey message from the other.
        // In this application we aren't putting text in the prekey messages, so it doesn't matter, but if we
        // changed that we'd still need to process the message.
        return
    }
    const newSession: ChatSession = {
        remoteUsername: address,
        messages: [],
    }
    const sessionList = [...sessionListSubject.value]
    sessionList.unshift(newSession)
    sessionListSubject.next(sessionList)
}

export async function processRegularMessage(address: string, message: MessageType): Promise<void> {
    console.log('processRegularMessage')
    const cipher = new SessionCipher(signalStore, new SignalProtocolAddress(address, 1))
    const plaintextBytes = await cipher.decryptWhisperMessage(message.body!, 'binary')
    const plaintext = new TextDecoder().decode(new Uint8Array(plaintextBytes))

    const cm: ProcessedChatMessage = JSON.parse(plaintext)
    console.log('Decrypted: ', { cm })
    addMessageToSession(address, cm)
}

export async function encryptAndSendMessage(to: string, message: string): Promise<void> {
    const address = new SignalProtocolAddress(to, 1)
    const cipher = new SessionCipher(signalStore, address)

    const cm: ProcessedChatMessage = {
        id: uuid(),
        address: to,
        from: usernameSubject.value,
        timestamp: Date.now(),
        body: message,
    }
    addMessageToSession(to, cm)
    const signalMessage = await cipher.encrypt(new TextEncoder().encode(JSON.stringify(cm)).buffer)
    sendSignalProtocolMessage(to, usernameSubject.value, signalMessage)
}
