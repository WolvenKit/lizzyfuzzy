export interface Channel {
    id: number
    discordid: string
    channelid: string
    active: number
    initialmessageUser: string
    initialmessageChannel: string
    ticketmessage: string
    userimage: string | null
}

export interface Querry {
    'COUNT(*)': number
}

export interface Experience {
    id: number
    discordid: string
    level: number
    experience: number
    messagecount: number
}
