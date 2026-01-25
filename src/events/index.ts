import { Event } from 'types'
import ready from './ready'
import interactionCreate from './interactionCreate'
import quote from './quote'
import repeat from './checker'
import tag from './tag'
import stats from './minnie/stats'

const productionEvents: Event<any>[] = [
    ready,
    quote,
    interactionCreate,
    repeat,
    stats,
    // tag,
]

const developmentEvents: Event<any>[] = [
    ready,
    interactionCreate,
    quote,
    repeat,
    stats,
    // tag,
]

export default process.env.NODE_ENV === 'production'
    ? productionEvents
    : developmentEvents
