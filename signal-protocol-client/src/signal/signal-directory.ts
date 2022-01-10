import { SignedPublicPreKeyType, DeviceType, PreKeyType } from '@privacyresearch/libsignal-protocol-typescript'
import * as base64 from 'base64-js'

export interface PublicDirectoryEntry {
    identityKey: ArrayBuffer
    signedPreKey: SignedPublicPreKeyType
    oneTimePreKey?: ArrayBuffer
}

interface FullDirectoryEntry {
    registrationId: number
    identityKey: ArrayBuffer
    signedPreKey: SignedPublicPreKeyType
    oneTimePreKeys: PreKeyType[]
}

export interface PublicPreKey {
    keyId: number
    publicKey: string
}

export interface SignedPublicKey {
    keyId: number
    publicKey: string
    signature: string
}

export interface PublicPreKeyBundle {
    identityKey: string
    signedPreKey: SignedPublicKey
    preKey?: PublicPreKey
    registrationId: number
}

interface SerializedFullDirectoryEntry {
    registrationId: number
    identityKey: string
    signedPreKey: SignedPublicKey
    oneTimePreKeys: PublicPreKey[]
}

export class SignalDirectory {
    constructor(private _url: string, private _apiKey: string) {}

    async storeKeyBundle(address: string, bundle: FullDirectoryEntry): Promise<void> {
        const res = await fetch(`${this._url}/keys/${address}`, {
            method: 'PUT',
            headers: { 'x-api-key': this._apiKey },
            body: JSON.stringify(serializeKeyRegistrationBundle(bundle)),
        })
        await res.json()
    }

    async getPreKeyBundle(address: string): Promise<DeviceType | undefined> {
        const res = await fetch(`${this._url}/keys/${address}`, { headers: { 'x-api-key': this._apiKey } })
        const bundle = await res.json()
        if (!bundle) {
            return undefined
        }
        const { identityKey, signedPreKey, registrationId, preKey } = bundle
        return deserializeKeyBundle({ identityKey, signedPreKey, preKey, registrationId })
    }

    get url(): string {
        return this._url
    }

    get apiKey(): string {
        return this._apiKey
    }
}

export function serializeKeyRegistrationBundle(dv: FullDirectoryEntry): SerializedFullDirectoryEntry {
    const identityKey = base64.fromByteArray(new Uint8Array(dv.identityKey))
    const signedPreKey: SignedPublicKey = {
        keyId: dv.signedPreKey.keyId,
        publicKey: base64.fromByteArray(new Uint8Array(dv.signedPreKey.publicKey)),
        signature: base64.fromByteArray(new Uint8Array(dv.signedPreKey.signature)),
    }

    const oneTimePreKeys: PublicPreKey[] = dv.oneTimePreKeys.map((pk) => ({
        keyId: pk.keyId,
        publicKey: base64.fromByteArray(new Uint8Array(pk.publicKey)),
    }))

    return {
        identityKey,
        signedPreKey,
        oneTimePreKeys,
        registrationId: dv.registrationId!,
    }
}

export function serializeKeyBundle(dv: DeviceType): PublicPreKeyBundle {
    const identityKey = base64.fromByteArray(new Uint8Array(dv.identityKey))
    const signedPreKey: SignedPublicKey = {
        keyId: dv.signedPreKey.keyId,
        publicKey: base64.fromByteArray(new Uint8Array(dv.signedPreKey.publicKey)),
        signature: base64.fromByteArray(new Uint8Array(dv.signedPreKey.signature)),
    }

    const preKey: PublicPreKey = {
        keyId: dv.preKey!.keyId,
        publicKey: base64.fromByteArray(new Uint8Array(dv.preKey!.publicKey)),
    }

    return {
        identityKey,
        signedPreKey,
        preKey,
        registrationId: dv.registrationId!,
    }
}

export function deserializeKeyBundle(kb: PublicPreKeyBundle): DeviceType {
    const identityKey = base64.toByteArray(kb.identityKey).buffer
    const signedPreKey: SignedPublicPreKeyType = {
        keyId: kb.signedPreKey.keyId,
        publicKey: base64.toByteArray(kb.signedPreKey.publicKey),
        signature: base64.toByteArray(kb.signedPreKey.signature),
    }
    const preKey: PreKeyType | undefined = kb.preKey && {
        keyId: kb.preKey.keyId,
        publicKey: base64.toByteArray(kb.preKey.publicKey),
    }

    return {
        identityKey,
        signedPreKey,
        preKey,
        registrationId: kb.registrationId,
    }
}
