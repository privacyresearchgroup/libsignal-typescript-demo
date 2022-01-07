import { useObservable } from '@app/hooks'
import React from 'react'

import ComposeMessage from '@app/messages/ui/compose-message'
import MessageList from '@app/messages/ui/message-list'
import { currentSessionSubject } from '../state'
import { usernameSubject } from '@app/identity/state'

export default function SessionDetails(): JSX.Element {
    const session = useObservable(currentSessionSubject, null)
    const username = useObservable(usernameSubject, '')

    console.log({ session })

    const clearCurrentSession = () => {
        currentSessionSubject.next(null)
    }

    return (
        (session && (
            <div className="container">
                <h1>
                    Chat: {username} - {session.remoteUsername}
                </h1>
                <button onClick={clearCurrentSession} color="inherit" aria-label="add" className="buttonitem">
                    (Back)
                </button>
                <MessageList messages={session.messages} remoteUserName={session.remoteUsername} />
                <div>
                    <ComposeMessage toUser={session.remoteUsername} />
                </div>
            </div>
        )) || (
            <div>
                <h1>No active session</h1>
                <button onClick={clearCurrentSession} color="inherit" aria-label="add" className="buttonitem">
                    (Back)
                </button>
            </div>
        )
    )
}
