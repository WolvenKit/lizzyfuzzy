import { Event } from "types";
import ready from "./util/ready";
import interactionCreate from "./util/interactionCreate";

import messageDelete from "./log/messageDelete";
import messageUpdate from "./log/messageUpdate";
import threadCreate from "./log/threadCreate";
import threadDelete from "./log/threadDelete";
import threadUpdate from "./log/threadUpdate";
import userBan from "./log/userBan";
import userJoined from "./log/userJoined";
import userRemove from "./log/userRemove";
import userUnban from "./log/userUnban";

import quote from "./quote/quote";

import guildjoin from "./util/guildJoin";

import suggestion_handle from "./pub/suggestions_handle";

import trivia_handler from "./pub/trivia_handler";

import shitpostNameLog from "./log/shitpostNameLog";

import quickCommands from "./quickcommands/quickCommands";

import mark from "./team/mark";

const productionEvents: Event<any>[] = [
  ready,
  quote,
  guildjoin,
  interactionCreate,
  suggestion_handle,
  shitpostNameLog,
  quickCommands,
];

const developmentEvents: Event<any>[] = [
  ready,
  interactionCreate,
  messageDelete,
  messageUpdate,
  threadCreate,
  threadDelete,
  threadUpdate,
  userBan,
  userJoined,
  userRemove,
  userUnban,
  quote,
  guildjoin,
  suggestion_handle,
  trivia_handler,
  shitpostNameLog,
  quickCommands,
  mark
];

export default process.env.NODE_ENV === "production"
  ? productionEvents
  : developmentEvents;
