import { Event } from 'types'
import ready from './ready'
import interactionCreate from './interactionCreate'
import repeat from './checker'
import buttonReact from './init/buttonReact'
import quotes from './quotes'
import ticketSystem from './ticketSystem'
import experience from './experience'
import speechSystem from './speech'
import moderation from './moderation'
import voicechat from './voicechat'

const productionEvents: Event<any>[] = [ready, interactionCreate, quotes, experience, ...ticketSystem, ...moderation]

const developmentEvents: Event<any>[] = [ready, interactionCreate, experience, ...speechSystem, buttonReact, quotes, ...voicechat]

export default process.env.NODE_ENV === 'production' ? productionEvents : developmentEvents
