import React, { useState } from 'react'
import { currentSessionSubject, sessionForRemoteUser } from '@app/sessions/state'
import { startSession } from '@app/sessions/functions'

export default function AddSession(): JSX.Element {
    const [remoteUsername, setRemoteUsername] = useState('')

    const createSession = () => {
        startSession(remoteUsername)
        currentSessionSubject.next(sessionForRemoteUser(remoteUsername) || null)
    }

    return (
        <div>
            <h2 id="add-session-title">Create a new chat session</h2>
            <p id="add-session-description">Look up a user by username and start and end-to-end-encrypted chat</p>
            <input
                value={remoteUsername}
                onChange={(event) => {
                    setRemoteUsername(event.target.value)
                }}
            ></input>
            <button onClick={createSession}>Start Session</button>
        </div>
    )
}
