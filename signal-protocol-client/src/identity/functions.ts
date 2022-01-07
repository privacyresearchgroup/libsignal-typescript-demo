import { initializeSignalWebsocket } from '@app/messages/api'
import { networkInfoSubject } from '@app/network/state'
import { subscribeWebsocket } from '@app/network/websocket'
import { KeyHelper, PreKeyType, SignedPublicPreKeyType } from '@privacyresearch/libsignal-protocol-typescript'
import { SignalDirectory } from './signal-directory'
import { directorySubject, signalStore, usernameSubject } from './state'

export async function createIdentity(username: string, url: string, wss: string, apiKey: string): Promise<void> {
    const directory = new SignalDirectory(url, apiKey)
    directorySubject.next(directory)
    usernameSubject.next(username)
    networkInfoSubject.next({ apiURL: url, apiKey, wssURI: wss })

    initializeSignalWebsocket(wss)
    subscribeWebsocket(username)

    const registrationId = KeyHelper.generateRegistrationId()
    // Store registrationId somewhere durable and safe... Or do this.
    signalStore.put(`registrationID`, registrationId)

    const identityKeyPair = await KeyHelper.generateIdentityKeyPair()
    // Store identityKeyPair somewhere durable and safe... Or do this.
    signalStore.put('identityKey', identityKeyPair)
    console.log('Generated identity key', { identityKeyPair })

    const baseKeyId = Math.floor(10000 * Math.random())
    const preKey = await KeyHelper.generatePreKey(baseKeyId)
    signalStore.storePreKey(`${baseKeyId}`, preKey.keyPair)
    console.log('Generated pre key', { preKey })

    const signedPreKeyId = Math.floor(10000 * Math.random())
    const signedPreKey = await KeyHelper.generateSignedPreKey(identityKeyPair, signedPreKeyId)
    signalStore.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair)
    const publicSignedPreKey: SignedPublicPreKeyType = {
        keyId: signedPreKeyId,
        publicKey: signedPreKey.keyPair.pubKey,
        signature: signedPreKey.signature,
    }

    // Now we register this with the server so all users can see them
    const publicPreKey: PreKeyType = {
        keyId: preKey.keyId,
        publicKey: preKey.keyPair.pubKey,
    }
    directory.storeKeyBundle(username, {
        registrationId,
        identityKey: identityKeyPair.pubKey,
        signedPreKey: publicSignedPreKey,
        oneTimePreKeys: [publicPreKey],
    })
}
