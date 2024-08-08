import { category } from "utils";
import dds from "./dds";
import avatar from "./avatar";
import emoji from "./emoji";
import itt from "./itt";

export default process.env.NODE_ENV === 'production' 
  ? category("context", [dds, avatar, emoji, itt]) 
  : category("context", [avatar, emoji]);
