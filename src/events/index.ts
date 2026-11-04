import { Event } from 'types'
import ready from './ready'
import interactionCreate from './interactionCreate'
import repeat from './checker'
import buttonReact from './init/buttonReact'
import quotes from './quotes'
import { ticketSystem } from './ticketSystem'
import experience from './experience'

const productionEvents: Event<any>[] = [ready, interactionCreate, repeat, quotes, experience]

const developmentEvents: Event<any>[] = [ready, interactionCreate, repeat, ...ticketSystem, buttonReact, experience, quotes]

export default process.env.NODE_ENV === 'production' ? productionEvents : developmentEvents
