import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import type { MessageContextMenuCommandInteraction } from "discord.js";
import { command, log } from "utils";
import Tesseract from "tesseract.js";
import client from "prom-client";

const gauge = new client.Counter({
  name: "context_itt_usage",
  help: "Usage of the itt context command",
});

const meta = new ContextMenuCommandBuilder()
  .setName("Text to Image")
  .setType(ApplicationCommandType.Message);

export default command(meta, async ({ interaction }) => {
  if (!interaction.isMessageContextMenuCommand) return;
  gauge.inc(1);

  const Interaction =
    interaction as unknown as MessageContextMenuCommandInteraction;

  const attachement = Interaction.targetMessage?.attachments;

  if (attachement?.size > 0) {
    const attachment = attachement.first();
    if (attachment?.contentType?.startsWith("image")) {
      Tesseract.recognize(attachment.url, "eng").then(({ data: { text } }) => {
        log(text);
      });
    }
  }
});
