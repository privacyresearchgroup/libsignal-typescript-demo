import { BehaviorSubject } from 'rxjs'
import { NetworkParams } from './types'

export const networkInfoSubject = new BehaviorSubject<NetworkParams | null>(null)
