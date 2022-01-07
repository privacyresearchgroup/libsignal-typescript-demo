import { SignalProtocolStore } from '@app/identity/signal-store'
import { BehaviorSubject } from 'rxjs'
import { SignalDirectory } from './signal-directory'

export const directorySubject = new BehaviorSubject<SignalDirectory | null>(null)
export const signalStore = new SignalProtocolStore()
export const usernameSubject = new BehaviorSubject<string>('')
