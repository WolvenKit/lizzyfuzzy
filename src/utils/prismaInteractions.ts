import { prisma } from "./prismaClient";
import type { Interaction } from "discord.js";

const upserUser = async (interaction: Interaction, info: any) => {
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

const findSuggestions = async (userID: string) => {
  const suggestions = await prisma.suggestions.findMany({
    where: {
      userid: userID,
    },
  });

  return suggestions;
};

const createSuggestion = async (
  interaction: Interaction,
  suggestion: string
) => {
  const newSuggestion = await prisma.suggestions.create({
    data: {
      userid: interaction.user.id,
      user: interaction.user.username,
      suggestion: suggestion,
    },
  });

  return newSuggestion;
};

const deleteSuggestion = async (suggestionID: number, userID: string) => {
  const deletedSuggestion = await prisma.suggestions.delete({
    where: {
      id: suggestionID.toString(),
      userid: userID,
    },
  });

  return deletedSuggestion;
};

const updateSuggestion = async (suggestionID: number, suggestion: string) => {
  const updatedSuggestion = await prisma.suggestions.update({
    where: {
      id: suggestionID.toString(),
    },
    data: {
      suggestion: suggestion,
    },
  });

  return updatedSuggestion;
};

const getRandomTrivia = async () => {
  const trivia = await prisma.trivia.findMany();

  return trivia[Math.floor(Math.random() * trivia.length)];
};

const createTrivia = async (question: string, answer: string) => {
  const newTrivia = await prisma.trivia.create({
    data: {
      question: question,
      answer: answer,
    },
  });

  return newTrivia;
};

export {
  upserUser,
  findSuggestions,
  createSuggestion,
  deleteSuggestion,
  updateSuggestion,
  getRandomTrivia,
  createTrivia,
};
