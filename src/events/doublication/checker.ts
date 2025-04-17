import { errorLog, event } from "utils";

export default event("messageCreate", async ({ client }, Message) => {
  try {
    if (Message.author.bot) return;

    const Context = {
      Timestamp: Message.createdTimestamp.toString(),
      Content: Message.content,
      UserId: Message.author.id,
    };

    const data = await fetch(process.env.API_ENDPOINT + "/moderation/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer TOKEN`,
      },
      body: JSON.stringify(Context),
    })
      .then((response) => response)
      .then((data) => data.text())
      .catch((error) => console.error(error));

    console.log(data)

    if (data && data === "true") {
      Message.delete();
    }
  } catch (error) {
    errorLog("[Event Error]", error);
  }
});
