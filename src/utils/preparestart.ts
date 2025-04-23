import { Database } from "bun:sqlite";
import { errorLog, log } from "./logging";

export async function prepareStart() {
  try {
    const db = new Database("settings.sqlite", { create: true });
    const run = db.run(
      `CREATE TABLE IF NOT EXISTS "commands" (
        "id" INTEGER PRIMARY KEY,
        "initiator" VARCHAR(255) NOT NULL,
        "textorjson" BOOLEAN NOT NULL,
        "command" TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS "settings" (
        "id" INTEGER PRIMARY KEY,
        "key" VARCHAR(255) NOT NULL,
        "value" TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS "markedMembers" (
        "id" INTEGER PRIMARY KEY,
        "user" VARCHAR(255) NOT NULL UNIQUE,
        "message" TEXT, "channel" VARCHAR(255) NOT NULL,
        "messageid" VARCHAR(255) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS "coremods" (
        "id" INTEGER PRIMARY KEY,
        "tagName" TEXT,
        "version" TEXT,
        "updatedat" TEXT,
        "url" TEXT
      )`
    );

    if (run) {
      log("[PrepareStart] Tables Created");
    }
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

      // before we insert the data, we need to check if the data already exists.
      const check = db.query(`SELECT key FROM settings`).get();

      if (check) {
        db.close();
        return;
      }

      const prepare = db.prepare(
        `INSERT INTO settings (key, value) VALUES (?, ?)`
      );
      const insertMany = db.transaction((settings) => {
        for (const setting of settings) prepare.run(setting);
      });

      insertMany([
        ["setting_moderationCategory", process.env.moderationCategory],
        ["setting_markedMembersChannel", process.env.markedMembersChannel],
        ["setting_LogChannel", process.env.moderationLogChannel],
        ["setting_markedMemberRole", process.env.settingMarkedMemberRole],
      ]);

      db.query(`SELECT * FROM settings`)
        .all()
        .forEach((row: any) => {
          log(`[Settings] ${row.key} = ${row.value}`);
        });
    }

    db.close();
    return;
  } catch (error) {
    errorLog("[PrepareStart Error] [ MAIN ]" + error);
  }
}
