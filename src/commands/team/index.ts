import { category } from "utils";
import who from "./who";
import link from "./link";
import mark from "./mark";
import mute from "./mute";
import clear from "./clear";
import repeat from "./repeat";
import info from "./info";
import clean from "./clean";
import warn from "./warn";

export default category("Team", [warn, info, repeat, clear, who, link, mark, mute, clean]);