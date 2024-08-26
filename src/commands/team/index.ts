import { category } from "utils";
import who from "./who";
import link from "./link";
import create from "./create";
import update from "./update";
import pass from "./pass";
import sync from "./sync";

export default category("Team", [who, link, create, update, pass, sync]);
