import { EmbedBuilder, GuildMember, TextChannel } from 'discord.js';
import { event } from '../../utils';

export default event('guildMemberAdd', async ({ log, client }, Member) => {
  try {
    const member = Member as GuildMember;

    const embed = new EmbedBuilder()
      .setTitle(':green_circle: User joined')
      .setThumbnail(member.user.displayAvatarURL())
      .setColor(0x2b2d31)
      .addFields(
        { name: 'User', value: `<@${member.user.id}>` },
        { name: 'Joined At', value: `${member.joinedAt}` }
      )
      .setFooter({ text: `User ID: ${member.user.id}` })
      .setTimestamp();

    if (member.nickname !== null) {
      embed.addFields({ name: 'Nickname', value: `${member.nickname}` });
    }

    const logChannel = client.channels.cache.get(
      process.env.JOINLEAVE_CHANNEL_ID
    ) as TextChannel;
    logChannel.send({ embeds: [embed], allowedMentions: { parse: [] } });
  } catch (error) {
    log('[Event Error]', error);
  }
});
