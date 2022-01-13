## You just sent a message. Here's what happened.

First, we create a new `SessionCipher` for the recipient using our local `store`.

```ts

  const cipher = SessionCipher(store, recipientAddress);
  };
```

Then we can encrypt the message, this time producing a `WhisperMessage`.

```ts
const ciphertext = await cipher.encrypt(
  new TextEncoder().encode(message).buffer
);
```

And now we can send the message over any channel we like, Here `to` and `from` are
addresses strings.

```ts
    sendMessage(to, from, ciphertext);
  };
```
