import React, { useState } from 'react'

import { Modal } from '@material-ui/core'

import useStyles from '@app/styles'
import { useObservable } from '@app/state'
import SessionSummary from './session-summary'
import AddSession from './add-session'
import { sessionListSubject } from '../state'
import { usernameSubject } from '@app/identity/state'

export default function SessionList(): JSX.Element {
    const [showAddSession, setShowAddSession] = useState(false)
    const sessionList = useObservable(sessionListSubject, [])
    const username = useObservable(usernameSubject, '')
    const classes = useStyles()

    const toggleShowAddSession = () => {
        setShowAddSession(!showAddSession)
    }

    return (
        <div className={classes.container}>
            <h1>Chat Sessions ({username})</h1>

            <button className={classes.buttonitem} color="inherit" aria-label="add" onClick={toggleShowAddSession}>
                (Add Session)
            </button>

            <ul>
                {sessionList.map((session) => (
                    <SessionSummary key={session.remoteUsername} session={session}></SessionSummary>
                ))}
            </ul>
            <Modal
                open={showAddSession}
                onClose={toggleShowAddSession}
                aria-labelledby="add-session-title"
                aria-describedby="add-session-description"
            >
                <AddSession />
            </Modal>
        </div>
    )
}
