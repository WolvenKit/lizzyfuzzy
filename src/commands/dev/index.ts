import { category } from "utils";
import dev from "./dev";
import init from "./init";
import servers from "./servers";
import clear from "./clear";
import repeat from "./repeat";
import authv2 from "./authv2";

export default category("Dev", [dev, init, servers, clear, repeat, authv2]);
