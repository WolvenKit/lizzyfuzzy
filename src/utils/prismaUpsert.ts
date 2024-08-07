import prisma from "./prismaClient";
import type { Interaction } from "discord.js";

export const upserUser = async (interaction: Interaction, info: any) => {
  const user = await prisma.user.upsert({
    where: {
      userid: interaction.user.id,
    },
    update: {
      userid: interaction.user.id,
      user: interaction.user.username,
      nexusmods: info.NexusMods,
      github: info.GitHub,
      theme: info.Theme,
      description: info.Description,
    },
    create: {
      userid: interaction.user.id,
      user: interaction.user.username,
      nexusmods: info.NexusMods,
      github: info.GitHub,
      theme: info.Theme,
      description: info.Description,
    },
  });

  return user;
};
