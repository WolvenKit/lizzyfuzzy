import { Event } from 'types'
import ready from './ready'
import interactionCreate from './interactionCreate'
import quote from './quote'
import repeat from './checker'
import tag from './tag'

const productionEvents: Event<any>[] = [
    ready,
    quote,
    interactionCreate,
    repeat,
    // tag,
]

const developmentEvents: Event<any>[] = [
    ready,
    interactionCreate,
    quote,
    repeat,
    // tag,
]

export default process.env.NODE_ENV === 'production'
    ? productionEvents
    : developmentEvents
