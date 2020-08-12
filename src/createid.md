Here's what happens.

First, we use `KeyHelper` to generate a registration ID and store it

```typescript
const registrationId = KeyHelper.generateRegistrationId();
// Store registrationId somewhere durable and safe... Or do this.
storeSomewhereSafe(store)(`registrationID`, registrationId);
```

Then when use `KeyHelper` to generate an identity key pair. In a real appliocation,
the private key in this pair must be stored safely.

```typescript
const identityKeyPair = await KeyHelper.generateIdentityKeyPair();
// Store identityKeyPair somewhere durable and safe... Or do this.
storeSomewhereSafe(store)("identityKey", identityKeyPair);
```

Now we generate a one-time use prekey and a signed pre-key, storing both locally

```typescript
const baseKeyId = Math.floor(10000 * Math.random());
const preKey = await KeyHelper.generatePreKey(baseKeyId);
store.storePreKey(`${baseKeyId}`, preKey.keyPair);

const signedPreKeyId = Math.floor(10000 * Math.random());
const signedPreKey = await KeyHelper.generateSignedPreKey(
  identityKeyPair,
  signedPreKeyId
);
store.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair);
```

Finally we store the associated public keys and signatures in a directory so other users can find them.

```typescript
const publicSignedPreKey: SignedPublicPreKeyType = {
  keyId: signedPreKeyId,
  publicKey: signedPreKey.keyPair.pubKey,
  signature: signedPreKey.signature,
};

// Now we register this with the server so all users can see them
const publicPreKey: PreKeyType = {
  keyId: preKey.keyId,
  publicKey: preKey.keyPair.pubKey,
};
directory.storeKeyBundle(name, {
  registrationId,
  identityPubKey: identityKeyPair.pubKey,
  signedPreKey: publicSignedPreKey,
  oneTimePreKeys: [publicPreKey],
});
```
