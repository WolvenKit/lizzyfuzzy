import { category } from "utils";
import servers from "./servers";

import localdb from "./localdb";
import sync from "./sync";
import dev from "./dev";
import components from "./component";

export default category("Dev", [localdb, sync, servers, dev, components]);
