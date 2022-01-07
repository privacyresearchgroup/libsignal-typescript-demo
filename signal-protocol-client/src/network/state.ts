import { NetworkParams } from '@app/types/network'
import { BehaviorSubject } from 'rxjs'

export const networkInfoSubject = new BehaviorSubject<NetworkParams | null>(null)
