import { errorLog, event } from "utils";
import crypto from "crypto";

export default event("messageCreate", async ({ client }, Message) => {
  try {
    if (Message.author.bot) return;

    const Hash = crypto.createHash("sha512", {
        encoding: "utf8",
        outputLength: 64,
    });

    const Context = {
      Timestamp: Message.createdTimestamp.toString(),
      Content: Hash.update(Message.content.toLocaleLowerCase().trim().replace(/\s/g, "")).digest("hex"),
      UserId: Message.author.id,
    };

    const data = await fetch(process.env.API_ENDPOINT + "/moderation/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify(Context),
    })
      .then((response) => response)
      .then((data) => data.text())
      .catch((error) => console.error(error));

    if (data && data === "true") {
      Message.delete();
    }
  } catch (error) {
    errorLog("[Event Error]", error);
  }
});
