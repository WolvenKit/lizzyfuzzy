import misc from "./misc";
import context from "./context";
import funny from "./funny";
import pub from "./public";
import team from "./team";
import dev from "./dev";

// export default process.env.NODE_ENV === "production"
//   ? [misc, context, funny, pub, team]
//   : [misc, context, funny, pub, team, dev];

export default [misc, context, funny, pub, team ,dev];
// export default []
