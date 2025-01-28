import { category } from "utils";
import dds from "./dds";
import avatar from "./avatar";
import emoji from "./emoji";

export default process.env.NODE_ENV === "production"
  ? category("context", [dds, avatar, emoji])
  : category("context", [avatar, emoji]);
