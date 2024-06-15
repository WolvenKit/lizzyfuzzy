import { EmbedBuilder } from 'discord.js';

export function error(message: any) {
  const errorEmbed = new EmbedBuilder()
    .setTitle('ERROR')
    .setDescription(
      message.rawError.message + '\nError Code: ' + message.rawError.code
    )
    .setColor(0xff0000);
  return errorEmbed;
}
