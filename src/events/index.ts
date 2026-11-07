import { Event } from 'types'
import ready from './ready'
import interactionCreate from './interactionCreate'
import repeat from './checker'
import buttonReact from './init/buttonReact'
import quotes from './quotes'
import { ticketSystem } from './ticketSystem'
import experience from './experience'
import { speechSystem } from './speech'

const productionEvents: Event<any>[] = [ready, interactionCreate, quotes, experience, ...ticketSystem]

const developmentEvents: Event<any>[] = [ready, interactionCreate, ...speechSystem, buttonReact, quotes]

export default process.env.NODE_ENV === 'production' ? productionEvents : developmentEvents
