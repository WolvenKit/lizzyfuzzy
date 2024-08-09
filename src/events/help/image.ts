import { event, log } from "utils";
import { createWorker } from "tesseract.js";

export default event("messageCreate", async ({ client }, Message) => {
  try {
    if (Message.attachments.size > 0) {
      const worker = await createWorker("eng");

      const attachment = Message.attachments.first();
      if (attachment?.contentType?.startsWith("image")) {
        worker.recognize(attachment.url).then(({ data: { text } }) => {
          log(text);
        });
      }
    }
  } catch (error) {
    log(error);
  }
});
