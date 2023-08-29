import { directorySubject, signalStore, usernameSubject } from '@app/identity/state'
import { sendSignalProtocolMessage } from '@app/messages/api'
import { ProcessedChatMessage } from '@app/messages/types'
import { SessionBuilder, SessionCipher, SignalProtocolAddress } from '@privacyresearch/libsignal-protocol-typescript'
import { currentSessionSubject, sessionForRemoteUser, sessionListSubject } from './state'
import { ChatSession } from '@app/sessions/types'

export async function startSession(recipient: string): Promise<void> {
    const directory = directorySubject.value!
    const keyBundle = await directory.getPreKeyBundle(recipient)

    const recipientAddress = new SignalProtocolAddress(recipient, 1)

    // Instantiate a SessionBuilder for a remote recipientId + deviceId tuple.
    const sessionBuilder = new SessionBuilder(signalStore, recipientAddress)

    // Process a prekey fetched from the server. Returns a promise that resolves
    // once a session is created and saved in the store, or rejects if the
    // identityKey differs from a previously seen identity for this address.
    const session = await sessionBuilder.processPreKey(keyBundle!)
    console.log({ session, keyBundle })

    // Now we can send an encrypted message
    const sessionCipher = new SessionCipher(signalStore, recipientAddress)
    const ciphertext = await sessionCipher.encrypt(Uint8Array.from([0, 0, 0, 0]).buffer)

    sendSignalProtocolMessage(recipient, usernameSubject.value, ciphertext)

    const newSession: ChatSession = {
        remoteUsername: recipient,
        messages: [],
    }
    console.log(`Starting session with ${recipient}`, { ciphertext })
    const sessionList = [...sessionListSubject.value]
    sessionList.unshift(newSession)
    sessionListSubject.next(sessionList)
}

export function addMessageToSession(address: string, cm: ProcessedChatMessage): void {
    const userSession = { ...sessionForRemoteUser(address)! }

    userSession.messages.push(cm)
    const sessionList = sessionListSubject.value.filter((session) => session.remoteUsername !== address)
    console.log('Filtered session list', { sessionList })
    sessionList.unshift(userSession)
    sessionListSubject.next(sessionList)
    if (currentSessionSubject.value?.remoteUsername === address) {
        currentSessionSubject.next(userSession)
    }
}
