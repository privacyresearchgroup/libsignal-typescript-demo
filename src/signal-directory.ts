import { SignedPublicPreKeyType, DeviceType, PreKeyType } from "@privacyresearch/libsignal-protocol-typescript";


export interface PublicDirectoryEntry {
    identityPubKey: ArrayBuffer
    signedPreKey: SignedPublicPreKeyType
    oneTimePreKey?: ArrayBuffer
}

interface FullDirectoryEntry {
    registrationId: number
    identityPubKey: ArrayBuffer
    signedPreKey: SignedPublicPreKeyType
    oneTimePreKeys: PreKeyType[]
}

export class SignalDirectory{
    private _data: {[address: string]: FullDirectoryEntry} = {}

    storeKeyBundle(address: string, bundle: FullDirectoryEntry) : void {
        this._data[address] = bundle
    }

    addOneTimePreKeys(address: string, keys: PreKeyType[]): void {
        this._data[address].oneTimePreKeys.unshift(...keys) 
    }

    getPreKeyBundle(address: string): DeviceType | undefined {
        const bundle = this._data[address]
        if(!bundle) {
            return undefined
        }
        const oneTimePreKey = bundle.oneTimePreKeys.pop()
        const { identityPubKey, signedPreKey, registrationId } = bundle
        return { identityKey: identityPubKey, signedPreKey, preKey: oneTimePreKey, registrationId }
    }
}