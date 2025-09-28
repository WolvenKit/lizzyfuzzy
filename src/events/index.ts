import { Event } from 'types'
import ready from './ready'
import interactionCreate from './interactionCreate'
import quote from './quote'
import repeat from './checker'

const productionEvents: Event<any>[] = [ready, quote, interactionCreate, repeat]

const developmentEvents: Event<any>[] = [
    ready,
    interactionCreate,
    quote,
    repeat,
]

export default process.env.NODE_ENV === 'production'
    ? productionEvents
    : developmentEvents
