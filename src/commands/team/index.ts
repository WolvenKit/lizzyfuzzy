import { category } from "utils";
import who from "./who";
import link from "./link";
import create from "./create";
import sync from "./sync";
import linkv2 from "./linkv2";
import auth from "./auth";
import keys from "./keys";

export default category("Team", [
  who,
  link,
  create,
  sync,
  linkv2,
  auth,
  keys,
]);
