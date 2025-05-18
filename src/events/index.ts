import { Event } from "types";
import ready from "./ready";
import interactionCreate from "./interactionCreate";
import messageDelete from "./messageDelete";
import messageUpdate from "./messageUpdate";
import threadCreate from "./threadCreate";
import threadDelete from "./threadDelete";
import threadUpdate from "./threadUpdate";
import userBan from "./userBan";
import userJoined from "./userJoined";
import userRemove from "./userRemove";
import userUnban from "./userUnban";
import quote from "./quote";
import guildjoin from "./guildJoin";
import quickCommands from "./quickCommands";
import mark from "./mark";
import userCheck from "./userCheck";
import kick from "./kick";
import ban from "./ban";
import checker from "./checker";

import join from "./join";

const productionEvents: Event<any>[] = [
  ready,
  quote,
  guildjoin,
  interactionCreate,

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

];

export default process.env.NODE_ENV === "production"
  ? productionEvents
  : developmentEvents;
