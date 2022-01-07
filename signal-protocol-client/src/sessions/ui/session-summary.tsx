import React from 'react'
import ReactTimeAgo from 'react-time-ago'

import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import { currentSessionSubject, sessionForRemoteUser } from '../state'
import { ChatSession } from '../types'

console.log('add locale', { en })
TimeAgo.addLocale(en)

export interface SessionSummaryProps {
    session: ChatSession
}

export default function SessionSummary(props: SessionSummaryProps): JSX.Element {
    const { session } = props
    const { messages, remoteUsername } = session
    const lastActivity = (messages.length && Math.max(...messages.map((m) => m.timestamp))) || Date.now()

    console.log({ lastActivity })

    const viewChatSession = (username: string) => {
        currentSessionSubject.next(sessionForRemoteUser(username || '') || null)
    }

    return (
        <li>
            {' '}
            {remoteUsername} <ReactTimeAgo date={lastActivity} locale="en"></ReactTimeAgo>{' '}
            <button onClick={() => viewChatSession(remoteUsername)}>(view)</button>
        </li>
    )
}
