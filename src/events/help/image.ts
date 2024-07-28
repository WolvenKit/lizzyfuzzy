import { event } from "../../utils";
import Tesseract from "tesseract.js";

export default event("messageCreate", async ({ log, client }, Message) => {
  try {
    if (Message.attachments.size > 0) {
      const attachment = Message.attachments.first();
      if (attachment?.contentType?.startsWith("image")) {
        Tesseract.recognize(attachment.url, "eng").then(
          ({ data: { text } }) => {
            console.log(text)
          }
        );
      }
    }
  } catch (error) {
    log(error);
  }
});
