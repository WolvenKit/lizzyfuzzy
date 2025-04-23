import {
  InteractionReplyOptions,
  InteractionEditReplyOptions,
} from 'discord.js';

export const Colors = {
  error: 0xf54242,
};

export const Reply = {
  error(message: string): InteractionReplyOptions {
    return {
      flags: 64,
      embeds: [
        {
          color: Colors.error,
          description: message,
        },
      ],
    };
  },
};

export const EditReply = {
  error(message: string): InteractionEditReplyOptions {
    return {
      embeds: [
        {
          color: Colors.error,
          description: message,
        },
      ],
    };
  },
};
