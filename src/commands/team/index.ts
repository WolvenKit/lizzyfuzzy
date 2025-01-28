import { category } from "utils";
import who from "./who";
import create from "./create";
import sync from "./sync";
import link from "./link";
import auth from "./auth";
import keys from "./keys";

export default category("Team", [
  who,
  create,
  sync,
  link,
  auth,
  keys,
]);
