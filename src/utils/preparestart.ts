import { Database } from "bun:sqlite";
import { errorLog, log } from "./logging";

export async function prepareStart() {
  const db = new Database("settings.sqlite", { create: true });
  db.run(`CREATE TABLE IF NOT EXISTS "commands" ( "id" INTEGER PRIMARY KEY , "initiator" VARCHAR(255) NOT NULL, "textorjson" BOOLEAN NOT NULL, "command" TEXT NOT NULL)`);
  db.run(`CREATE TABLE IF NOT EXISTS "settings" ( "id" INTEGER PRIMARY KEY , "key" VARCHAR(255) NOT NULL, "value" TEXT NOT NULL )`);
  db.run(`CREATE TABLE IF NOT EXISTS "markedMembers" ( "id" INTEGER PRIMARY KEY , "user" VARCHAR(255) NOT NULL, "message" TEXT, "channel" VARCHAR(255) NOT NULL, "messageid" VARCHAR(255) NOT NULL )`);
  // Check if the Tables already have data.
  const CheckCommands = db.query(`SELECT * FROM "commands"`).get();

  if (!CheckCommands && process.env.GET_COMMANDS === "true") {
    // Get the current commands from the API Global Storage.
    try {
      const data = await fetch("http://localhost:3000/commands", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const CommandsData = await data.json();

      // Insert the commands into the Database.
      db.run(
        `INSERT INTO commands (initiator, textorjson, command) VALUES (?, ?, ?)`,
        [CommandsData.initiator, CommandsData.type, CommandsData.command]
      );
    } catch (error) {
      errorLog("[PrepareStart Error] [ FIRST INSERT ]" + error);
    }
  }

  if (process.env.GET_COMMANDS === "false") {
    // If the GET_COMMANDS is set to false, we will not get the commands from the API.
    // Instead we will use the following env variables to populate the settings database.


    const moderationCategory = process.env.moderationCategory as string;
    const markedMembersChannel = process.env.markedMembersChannel as string;
    const moderationLogChannel = process.env.moderationLogChannel as string;


    // before we insert the data, we need to check if the data already exists.
    const check = db.query(`SELECT key FROM settings`).get();

    if (check) {
      // If the data already exists, we will not insert it again.
      return db;
    }

    // Insert the commands into the Database.
    db.run(
      `INSERT INTO settings (key, value) VALUES (?, ?)`,
      ["moderationCategory", moderationCategory]
    );

    db.run(
      `INSERT INTO settings (key, value) VALUES (?, ?)`,
      ["markedMembersChannel", markedMembersChannel]
    );

    db.run(
      `INSERT INTO settings (key, value) VALUES (?, ?)`,
      ["moderationLogChannel", moderationLogChannel]
    );


  }

  return db;
}
