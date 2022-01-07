import React from 'react'

import { ProcessedChatMessage } from '@app/types'
import MessageView from './message-view'

export interface MessageListProps {
    messages: ProcessedChatMessage[]
    remoteUserName: string
}

export default function MessageList(props: MessageListProps): JSX.Element {
    return (
        <div>
            {props.messages.map((m) => (
                <MessageView message={m} incoming={m.from === props.remoteUserName} key={m.id}></MessageView>
            ))}
        </div>
    )
}
