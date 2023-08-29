## Starting a session and sending a first message

The first thing we do is look up Brünhild in the directory and get a prekey bundle.

```typescript
// get Brünhild's key bundle
const brunhildeBundle = directory.getPreKeyBundle('brünhild')
```

Then we build a Signal session for this recipient in our local store.

```typescript
const recipientAddress = new SignalProtocolAddress('brünhild', 1)

// Instantiate a SessionBuilder for a remote recipientId + deviceId tuple.
const sessionBuilder = new SessionBuilder(adalheidStore, recipientAddress)
```

Now we can use this session to process the prekey bundle for this session.

```typescript
// Process a prekey fetched from the server. Returns a promise that resolves
// once a session is created and saved in the store, or rejects if the
// identityKey differs from a previously seen identity for this address.
await sessionBuilder.processPreKey(brunhildeBundle!)
```

With the session built, we are ready to create a `SessionCipher` and encrypt a message. We'll just
send a fixed first message, `starterMessage`, here but it could be any message you like.
Since it is the first message in the session, it will be a `PreKeyWhisperMessage`.

```typescript
const starterMessageBytes = Uint8Array.from([
  0xce, 0x93, 0xce, 0xb5, 0xce, 0xb9, 0xce, 0xac, 0x20, 0xcf, 0x83, 0xce, 0xbf, 0xcf, 0x85,
])

// Now we can send an encrypted message
const adalheidSessionCipher = new SessionCipher(adalheidStore, recipientAddress)
const ciphertext = await adalheidSessionCipher.encrypt(starterMessageBytes.buffer)
```

Finaly we send it over whatever channel we like.

```typescript
sendMessage('brünhild', 'adalheid', ciphertext)
```
