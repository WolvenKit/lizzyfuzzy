import { category } from "utils";
import core from "./core";
import social from "./social";
import wiki from "./wiki";
import discord from "./discord";
import remind from "./remind";
import info from "./info";

export default category("Public", [info, core, social, wiki, discord, remind]);

// export default category("Public", [core]);
