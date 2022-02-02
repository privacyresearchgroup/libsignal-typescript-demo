import { BehaviorSubject } from 'rxjs'
import { ChatSession } from './types'

export const sessionListSubject = new BehaviorSubject<ChatSession[]>([])
export const currentSessionSubject = new BehaviorSubject<ChatSession | null>(null)

export function sessionForRemoteUser(username: string): ChatSession | undefined {
    return sessionListSubject.value.find((session) => session.remoteUsername === username)
}
