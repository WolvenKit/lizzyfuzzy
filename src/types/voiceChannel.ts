export interface VoiceChannelControler {
    id: number
    guildid: string
    messageid: string
    categoryid: string
    moderatorrole: string
    minrole: string | null
}

export interface VoiceChannelType {
    id: number
    ownerid: string
    channelid: string
    createdtime: string
    locked: number
}

export interface VoiceChatUserState {
    id: number
    userid: string
    channelid: string
    jointime: string
}
