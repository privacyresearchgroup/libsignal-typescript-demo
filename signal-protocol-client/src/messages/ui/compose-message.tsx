import React, { useState } from 'react'

import { encryptAndSendMessage } from '../functions'

export interface ComposeMessageProps {
    toUser: string
}

export default function ComposeMessage(props: ComposeMessageProps): JSX.Element {
    const [message, setMessage] = useState('')

    const sendMessage = async (to: string, message: string) => {
        encryptAndSendMessage(to, message)
        setMessage('')
    }

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={(event) => {
                    setMessage(event.target.value)
                }}
            />
            <button onClick={() => sendMessage(props.toUser, message)}>Send Message</button>
        </div>
    )
}
