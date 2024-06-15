import {
  AuditLogEvent,
  EmbedBuilder,
  GuildAuditLogs,
  GuildAuditLogsEntry,
  Message,
  TextChannel,
  User,
} from 'discord.js';
import { event } from '../../utils';

export default event('messageDelete', async ({ log, client }, Message) => {
  try {
    const message = Message as Message;
    if (message.author.bot) return;

    const auditLog = (await message.guild?.fetchAuditLogs({
      type: AuditLogEvent.MessageDelete,
    })) as GuildAuditLogs;

    const entry = auditLog.entries.first() as GuildAuditLogsEntry;

    if (!entry) return;

    const executor = entry.executor as User;

    const embed = new EmbedBuilder()
      .setTitle('Message Deleted')
      .setColor(0x2b2d31)
      .setDescription(`${message.content || 'No Content'}`)
      .addFields(
        { name: 'Author', value: `<@${message.author.id || "No ID"}>`, inline: true },
        { name: 'Channel', value: `${message.channel || "No channel"}`, inline: true },
        { name: 'Deleted By', value: `<@${executor.id || "No id"}>`, inline: true }
      )
      .setFooter({ text: `Message ID: ${message.id}` })
      .setTimestamp();

    const logChannel = client.channels.cache.get(
      process.env.LOG_CHANNEL
    ) as TextChannel;
    logChannel.send({ embeds: [embed], allowedMentions: { parse: [] } });
  } catch (error) {
    log('[Event Error]', error);
  }
});
