import { Database } from "bun:sqlite";

export async function prepareStart() {
  const db = new Database("settings.sqlite", { create: true });

  try {
    db.run(
      `CREATE TABLE
        IF NOT EXISTS "commands" (
            "id" INT AUTO_INCREMENT PRIMARY KEY,
            "initiator" VARCHAR(255) NOT NULL,
            "textorjson" BOOLEAN NOT NULL,
            "command" TEXT NOT NULL,
    )`
    );

    db.run(
      `CREATE TABLE
        IF NOT EXISTS "settings" (
            "id" INT AUTO_INCREMENT PRIMARY KEY,
            "key" VARCHAR(255) NOT NULL,
            "value" TEXT NOT NULL
    )`
    );
  } catch (error) {
    return new Error("[PrepareStart Error] [ CREATE TABLES ] " + error);
  }

  // Check if the Tables already have data.
  const CheckCommands = db.query(`SELECT * FROM commands`).get();

  if (!CheckCommands) {
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
      return new Error("[PrepareStart Error] [ FIRST INSERT ]" + error);
    }
  }
}
