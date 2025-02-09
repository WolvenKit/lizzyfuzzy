import { category } from "utils";
import servers from "./servers";

import localdb from "./localdb";
import sync from "./sync";
import dev from "./dev";

export default category("Dev", [localdb, sync, servers, dev]);
