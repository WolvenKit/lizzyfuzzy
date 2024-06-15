import { Interaction, TextChannel, GuildMember } from 'discord.js';
import { event } from '../../utils';

export default event(
  'interactionCreate',
  async ({ log, client }, Interaction) => {
    try {
      const interaction = Interaction as Interaction;
      if (!interaction.isChatInputCommand()) return;
    } catch (error) {
      log('[Event Error]', error);
    }
  }
);
