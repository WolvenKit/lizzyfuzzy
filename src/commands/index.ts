import misc from "./misc";
import context from "./context";
import funny from "./funny";
import pub from "./public";
import team from "./team";
import dev from "./dev";

export default process.env.NODE_ENV === "development"
  ? [misc, context, funny, pub, team, dev]
  : [misc, context, funny, pub, team];
