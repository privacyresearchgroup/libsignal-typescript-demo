import React from 'react'

import { useObservable } from '@app/hooks'
import SessionSummary from './session-summary'
import AddSession from './add-session'
import { sessionListSubject } from '../state'
import { usernameSubject } from '@app/identity/state'

export default function SessionList(): JSX.Element {
    const sessionList = useObservable(sessionListSubject, [])
    const username = useObservable(usernameSubject, '')

    return (
        <div className="container">
            <h2>Chat Sessions ({username})</h2>

            <ul>
                {sessionList.map((session) => (
                    <SessionSummary key={session.remoteUsername} session={session}></SessionSummary>
                ))}
            </ul>
            <AddSession />
        </div>
    )
}
