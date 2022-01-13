import React from 'react'
import { ProcessedChatMessage } from '../types'


export interface MessageViewProps {
    message: ProcessedChatMessage
    incoming: boolean
}

export default function MessageView(props: MessageViewProps): JSX.Element {
    const timeString = new Date(props.message.timestamp).toLocaleString()

    return (
        <p>
            {timeString}&nbsp;
            <b>{props.message.from}:</b> {props.incoming ? props.message.body : <i>{props.message.body}</i>}
        </p>
    )
}
