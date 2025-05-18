import { errorLog, event, log } from "utils";

export default event("messageCreate", async ({ client }, Message) => {
  try {
    if (Message.author.bot) return;
    if (!Message.content.startsWith("!")) return;
    if (Message.content === "!") return;

    switch (Message.content) {
      case "!test":
        Message.reply("");
        break;
      default:
        break;
    }
  } catch (error) {
    errorLog("[Event Error]", error);
  }
});
