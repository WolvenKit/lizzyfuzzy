import { Event } from 'types'
import ready from './ready'
import interactionCreate from './interactionCreate'
import repeat from './checker'

const productionEvents: Event<any>[] = [
    ready,
    interactionCreate,
    repeat
]

const developmentEvents: Event<any>[] = [
    ready,
    interactionCreate,
    repeat
]

export default process.env.NODE_ENV === 'production'
    ? productionEvents
    : developmentEvents
