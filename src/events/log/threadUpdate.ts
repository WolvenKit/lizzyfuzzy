import {
  AuditLogEvent,
  EmbedBuilder,
  GuildAuditLogs,
  GuildAuditLogsEntry,
  TextChannel,
  ThreadChannel,
  User,
} from 'discord.js';
import { event } from '../../utils';

export default event(
  'threadUpdate',
  async ({ log, client }, ThreadOld, ThreadNew) => {
    try {
      if (ThreadNew.parent?.type === 0) {
        const oldThread = ThreadOld as ThreadChannel;
        const newThread = ThreadNew as ThreadChannel;

        const auditLog = (await oldThread.guild.fetchAuditLogs({
          type: AuditLogEvent.ThreadUpdate,
        })) as GuildAuditLogs;

        const entry = auditLog.entries.first() as GuildAuditLogsEntry;
        const executor = entry.executor as User;

        const embed = new EmbedBuilder()
          .setTitle(':yellow_circle: Thread Updated')
          .setColor(0x2b2d31)
          .addFields(
            {
              name: ':thread: Thread name',
              value: `${newThread.name}`,
              inline: true,
            },
            {
              name: ':gear: Updated By',
              value: `<@${executor.id}>`,
              inline: true,
            },
            {
              name: '\u200B',
              value: `[Jump To Thread](${newThread.url})`,
            }
          )
          .setFooter({ text: `Thread ID: ${newThread.id}` })
          .setTimestamp();

        const logChannel = client.channels.cache.get(
          process.env.LOG_CHANNEL
        ) as TextChannel;
        logChannel.send({ embeds: [embed], allowedMentions: { parse: [] } });
      } else if (ThreadNew.parent?.type === 15) {
        const oldThread = ThreadOld as ThreadChannel;
        const newThread = ThreadNew as ThreadChannel;

        const auditLog = (await oldThread.guild.fetchAuditLogs({
          type: AuditLogEvent.ThreadUpdate,
        })) as GuildAuditLogs;

        const entry = auditLog.entries.first() as GuildAuditLogsEntry;
        const executor = entry.executor as User;

        const embed = new EmbedBuilder()
          .setTitle(':yellow_circle: Forum Post Updated')
          .setColor(0x2b2d31)
          .addFields(
            {
              name: ':bookmark_tabs: Post name',
              value: `${newThread.name}`,
              inline: true,
            },
            {
              name: ':tools: Updated By',
              value: `<@${executor.id}>`,
              inline: true,
            },
            {
              name: '\u200B',
              value: `[Jump To Forum Post](${newThread.url})`,
            }
          )
          .setFooter({ text: `Forum Post ID: ${newThread.id}` })
          .setTimestamp();

        const logChannel = client.channels.cache.get(
          process.env.LOG_CHANNEL
        ) as TextChannel;
        logChannel.send({ embeds: [embed], allowedMentions: { parse: [] } });
      }
    } catch (error) {
      log('[Event Error]', error);
    }
  }
);
