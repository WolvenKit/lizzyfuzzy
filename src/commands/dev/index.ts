import { category } from "utils";
import dev from "./dev";
import init from "./init";
import servers from "./servers";
import trivia_create from "./trivia_create";
import clear from "./clear";

export default category("Dev", [dev, init, servers, trivia_create, clear]);
