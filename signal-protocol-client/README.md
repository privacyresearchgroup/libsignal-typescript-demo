# Signal Protocol TypeScript SDK Demo Web Chat App

This is a simple web chat app that uses the Signal Protocol for end-to-end encryption. It acts as a client
to a simple back end system that provides a key registry and message passing service. Instead of phone numbers,
this app allows users to select any username string they like, as long as it is not taken. There is no group chat.

_This is not a demonstration of how to write a chat app! It is a demonstration of how to use the [TypeScript Signal Protocol SDK]()._
The chat components are kept a simple as possible so they do not get in the way.

To use the app, you will need to provide your own backend service, but with an AWS account this can be done in a few minutes using
[this backend demo project](https://github.com/privacyresearchgroup/signal-demo-backend).

For a simpler project that demonstrates SDK usage without the complexities of backend access and state management,
please see the [simple]() demo in this repository.

Since the purpose of this project is to demonstrate use of the Signal Protocol SDK, we will look at the code
organizationbefore giving instructions for deployment and usage.

## Code Organization

The code in this project is organized around the three main tasks we need to complete to use the Signal Protocol:

- `src/identity`: Creating, registering, and accessing keys
- `src/sessions`: Key exchange, starting a new session
- `src/messages`: sending and receiving encrypted messages

In addition there are two important directories without UI components:

- `src/signal`: Key registry API access and in-memory key storage for the Signal Protocol
- `src/network`: Network configuration information and websocket message handling

Each of these areas are described in more detail below.

This is a simple React application that uses [rxjs](https://rxjs.dev/) for state management. In each relevant directory there is a `ui/`
subdirectory where UI components can be found.

### `src/signal`

The directory `src/signal` contains the functions, API calls, and UI components needed to create an identity with a username and keys,
register this identity with the backend service, and access public information about other registered users:

- [`src/signal/signal-directory.ts`](): This provides access to the backend REST API that stores and serves user key bundles.
- [`src/signal/signal-store.ts`](): An in-memory key-value store that implements the `StorageType` interface expected by the
  Signal Protocol TypeScript and JavaScript SDKs.

### `src/identity`

This directory contains the UI components, state management, and functions needed to create an identity for the application. To understand
how to use the Signal Protocol SDK, look at:

- [`src/identity/functions.ts`](): Brings the directory and the `SignalStore` together in the function `createIdentity`, which generates
  keys, stores the private keys in the `SignalStore`, and registers the username and public keys with the server.

### `sessions`

A session encapsulates all of the information about a conversation between two parties. The cryptographic information about
a session is managed in the `SignalStore`, so most of the code in this directory is devoted to state management and UI. The
only Signal Protocol logic in this directory is found here:

- [src/sessions/functions.ts](): The function `startSession` calls the directory API to fetch a pre-key bundle for a remote user,
  processes it with a Signal SDK `SessionBuilder` object, then creates a `PreKeyWhisperMessage` which it sends to the remote user
  to start the session.

### `src/messages`

This directory contains the core logic for sending and receiving encrypted messages. The key functions are here:

- [src/messages/functions.ts](): Functions to decrypt and process incoming pre-key messages and regular messages. Functions to
  encrypt and send outgoing messages

Also of note in this directory is the file [`src/messages/api.ts`]() which sets up the websocket subscrption and sends messages over
the websocket.

## Getting Started

### Running locally with PNPM

> **Note**<br>
Make sure you have [`pnpm`](https://pnpm.io/installation) installed on your machine.

1. Fork/Clone the repo:

  ```sh
  git clone git@github.com:privacyresearchgroup/libsignal-typescript-demo.git
  ```

2. Open the newly created directory:

  ```sh
  cd libsignal-typescript-demo/signal-protocol-client
  pnpm install
  ```

3. Now, you can run the client:

  ```sh
  pnpm run dev
  ```

4. Navigate to [http://localhost:3000](http://localhost:3000) to explore the landing page.

### Deploying a Backend

This application works with the interface exposed by [this demo serverless backend](https://github.com/privacyresearchgroup/signal-demo-backend).
With an AWS account, AWS CLI tools, [yarn](https://yarnpkg.com/), and [Serverless](https://www.serverless.com/) installed, you can deploy your own backend in minutes. Simply:

```
git clone git@github.com:privacyresearchgroup/signal-demo-backend.git
cd signal-demo-backend
yarn
sls deploy --stage mystagename --aws-profile myawsprofile
```

The output of the last command will include the REST API URL, the websocket URI, and the API key needed to configure the client. This information will all be
available in the AWS console, too.

See the [github repository](https://github.com/privacyresearchgroup/signal-demo-backend) for the backend service for more information.

### Using the Deployed Version

This app is deployed at [https://signal-backend-demo.privacyresearch.io](https://signal-backend-demo.privacyresearch.io/). When you're testing you can send messages
from here to your local app as long as you configure them to use the same API URL and websocket URL.

### App Usage

To use the app:

1. When first visiting you will see a form asking you to enter a user name and some network information (API URL, Websocket URI, and API Key).
   The network information is available from the backend deployment described above. Enter this information and presss the "Create Identity" button.
   _This creates a new key set and registers it with the directory service. It also initializes the websocket to decrypt incoming messages._
2. You now see the _Chat Sessions_ screen. If you know the name of another active user, you can type that name into the text box at the bottom of
   the screen and press the "Start Session" button. If you do not know the username of another active user, you can open a new window, go back to Step 1,
   and create a new user with a new username.
   _This downloads the remote user's key bundle from the directory, generates a `PreKeyWhisperMessage` for the remote user, and sends it._
3. Once you start a session with a user, the session will show up in the Chat Sessions list. Click the "(view)" button to view the chat. USe the text
   input at the bottom of the screen to send messages. _This will encrypt and send the emssage to the remote user._

## Miscellany

This application uses [vite](https://vitejs.dev/guide/) for two reasons:

1. To support TypeScript path mappings
2. To ignore unused references to `fs` and `path` inserted by emscripten in the [`curve25519-typescript`](https://github.com/privacyresearchgroup/curve25519-typescript) package.

## License

This project is licensed under [GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html).

Copyright 2023 - Privacy Research, LLC
