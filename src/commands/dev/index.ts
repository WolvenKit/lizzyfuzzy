import { category } from "utils";
import dev from "./dev";
import servers from "./servers";
import clear from "./clear";
import repeat from "./repeat";
import localdb from "./localdb";
import sync from "./sync";

export default category("Dev", [localdb, clear, sync, repeat, servers]);
