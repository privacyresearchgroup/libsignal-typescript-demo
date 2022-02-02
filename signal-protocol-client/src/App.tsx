import React from 'react'
import './App.css'
import CreateIdentity from './identity/ui/create-identity'
import SessionList from './sessions/ui/session-list'
import SessionDetails from './sessions/ui/session-details'
import { useObservable } from './hooks'
import { usernameSubject } from './identity/state'
import { currentSessionSubject } from './sessions/state'
import { wssErrorSubject } from './messages/api'
import { restAPIErrorSubject } from './signal/signal-directory'

function App() {
    const username = useObservable(usernameSubject, '')
    const currSession = useObservable(currentSessionSubject, null)
    const wssErr = useObservable(wssErrorSubject, '')
    const apiErr = useObservable(restAPIErrorSubject, '')
    const err = wssErr || apiErr
    return (
        <div className="App">
            <h1>Signal Protocol Chat</h1>
            <p>
                <em>
                    A demonstration of the{' '}
                    <a href="https://github.com/privacyresearchgroup/libsignal-protocol-typescript">
                        Signal Protocol Typescript SDK
                    </a>
                    . Source code available{' '}
                    <a href="https://github.com/privacyresearchgroup/libsignal-typescript-demo">here</a>.
                </em>
            </p>
            <hr />
            {!err && username ? currSession ? <SessionDetails /> : <SessionList /> : <CreateIdentity />}
        </div>
    )
}

export default App
