import {
  AuditLogEvent,
  EmbedBuilder,
  GuildAuditLogs,
  GuildAuditLogsEntry,
  GuildMember,
  TextChannel,
  User,
} from 'discord.js';
import { event } from '../../utils';

export default event('guildMemberRemove', async ({ log, client }, Member) => {
  try {
    let userKicked = false;
    let userBanned = false;
    const member = Member as GuildMember;
    let embed = new EmbedBuilder();

    const auditLog = (await client.guilds.cache.get(process.env.GUILD)?.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberKick,
    })) as GuildAuditLogs;

    const entry = auditLog.entries.first() as GuildAuditLogsEntry;
    const executor = entry.executor as User;

    const banLog = (await member.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberKick,
    })) as GuildAuditLogs;

    const banEntry = banLog.entries.first() as GuildAuditLogsEntry;

    const currentTime = new Date().getTime();
    const lastKickedTime = entry.createdAt.getTime();
    const lastBannedTime = banEntry.createdAt.getTime();

    if (entry.targetId === member.id && currentTime - lastKickedTime < 15000) {
      userKicked = true;
    }

    if (entry.targetId === member.id && currentTime - lastBannedTime < 15000) {
      userBanned = true;
    }

    if (userKicked && !userBanned) {
      embed = new EmbedBuilder()
        .setTitle(':red_circle: User kicked')
        .setThumbnail(member.user.displayAvatarURL())
        .setColor(0x2b2d31)
        .addFields(
          {
            name: 'Username',
            value: `${member.user.username}`,
            inline: true
          },
          {
            name: 'User',
            value: `<@${member.user.id}>`,
            inline: true
          },
          {
            name: 'Kicked By',
            value: `${executor.tag}`,
          },
          {
            name: 'Reason',
            value: entry.reason ? `${entry.reason}` : 'No Reason Given',
          }
        )
        .setFooter({ text: `User ID: ${member.user.id}` })
        .setTimestamp();
    } else if (!userKicked && !userBanned) {
      embed = new EmbedBuilder()
        .setTitle(':red_circle: User Left')
        .setThumbnail(member.user.displayAvatarURL())
        .setColor(0x2b2d31)
        .addFields({
          name: 'Username',
          value: `${member.user.username}`,
          inline: true
        })
        .addFields({
          name: 'User',
          value: `<@${member.user.id}>`,
        })
        .setFooter({ text: `User ID: ${member.user.id}` })
        .setTimestamp();
    } else if (userBanned) {
      return;
    }

    const logChannel = client.channels.cache.get(
      process.env.JOINLEAVE_CHANNEL_ID
    ) as TextChannel;
    logChannel.send({ embeds: [embed], allowedMentions: { parse: [] } });
  } catch (error) {
    log('[Event Error]', error);
  }
});
