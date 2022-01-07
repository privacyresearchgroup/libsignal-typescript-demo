import React from 'react'
import './App.css'
import CreateIdentity from './identity/ui/create-identity'
import SessionList from './sessions/ui/session-list'
import SessionDetails from './sessions/ui/session-details'
import { useObservable } from './hooks'
import { usernameSubject } from './identity/state'
import { currentSessionSubject } from './sessions/state'

function App() {
    const username = useObservable(usernameSubject, '')
    const currSession = useObservable(currentSessionSubject, null)
    return (
        <div className="App">{username ? currSession ? <SessionDetails /> : <SessionList /> : <CreateIdentity />}</div>
    )
}

export default App
