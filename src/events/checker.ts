import { errorLog, event } from 'utils'
import crypto from 'node:crypto'

interface message {
    memberId: string
    lastMessage: string
    timestampLastMessage: number
    newMessage: string | null
    timestampNewMessage: number
}

const messageMap = new Map()

export default event('messageCreate', async ({ client }, Message) => {
    try {
        if (Message.author.bot) return

        const Hash = crypto.createHash('sha512', {
            encoding: 'utf8',
            outputLength: 64,
        })

        const findMessage = messageMap.get(Message.member?.id) as message

        if (!findMessage) {
            const message = Hash.update(Message.content.toLocaleLowerCase().trim().replace(/\s/g, '')).digest('hex')

            return messageMap.set(Message.member?.id, {
                memberId: Message.member?.id,
                lastMessage: message,
                timestampLastMessage: Message.createdTimestamp,
                newMessage: message,
                timestampNewMessage: Message.createdTimestamp,
            })
        }

        messageMap.set(Message.member?.id, {
            memberId: Message.member?.id,
            lastMessage: findMessage.newMessage,
            timestampLastMesage: findMessage.timestampLastMessage,
            newMessage: Hash.update(Message.content.toLocaleLowerCase().trim().replace(/\s/g, '')).digest('hex'),
            timestampNewMessage: Message.createdTimestamp,
        })

        const newMessage = messageMap.get(Message.member?.id) as message

        const TimeRangeInMinutes = 5
        const isSameMessage = newMessage.lastMessage === newMessage.newMessage

        const isTimeRange =
            Math.abs(new Date(newMessage.timestampNewMessage ?? 0).getTime() - new Date(newMessage.timestampLastMessage ?? 0).getTime()) >
            TimeRangeInMinutes * 60 * 1000

        if (isSameMessage && isTimeRange) {
            Message.delete()
        } else {
            return
        }
    } catch (error) {
        errorLog('[Event Error]', error)
    }
})
