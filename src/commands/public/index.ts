import { category } from "utils";
import core from "./core";
import social from "./social";
import wiki from "./wiki";
import discord from "./discord";
import remind from "./remind";

export default category("Public", [core, social, wiki, discord, remind]);
