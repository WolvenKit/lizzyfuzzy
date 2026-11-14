import { Message } from 'discord.js'

interface XPCalculation {
    xp: number
    words: number
    attachments: number
}

interface Level {
    level: number
}

export function calculateXP(message: Message, level: Level): XPCalculation {
    // Count words in the message

    const words = message.content.trim().split(/\s+/).filter(Boolean).length

    // Count message attachments
    const attachments = message.attachments.size

    // Calculate XP
    const rawXP = (words * 0.5 + attachments * 25) / (1 + level.level * 0.1)

    // Round XP to a whole number
    const xp = Math.floor(rawXP)

    return {
        xp,
        words,
        attachments,
    }
}
