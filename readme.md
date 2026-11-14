![Banner](https://files.moonded.com/share/github_banner_2.png)

# LizzyFuzzy

LizzyFuzzy is the custom Discord bot for the [REDmodding](https://redmodding.org) community [disocrd](https://discord.app/redmodding).
It is designed around the features and requirements the discord needs.
Made using [Typescript](https://www.typescriptlang.org/) and [Bun](https://bun.com/).

## Features

LizzyFuzzy containes the following features:

**Type Event**

| Name                      | Description                                                                                | Type              |
| ------------------------- | ------------------------------------------------------------------------------------------ | ----------------- |
| Ticket System             | A ticket system to recieve and send messages to users through the bot's DM functionalliy.  | Support           |
| Moderation                | Moderative logging.                                                                        | Moderation        |
| Voice Channel Creation    | Custom, per user, Voice channel creation with locking and Ownership functionality.         | User Experience   |
| Speech System             | A custom system to let the Bot talk, on propability of specifies words.                    | Server Experience |
| Leveling                  | Custom Experience and leveling System                                                      | User Experience   |
| Quoting                   | Automatically resend messages for an easier quoting experience using a message link        | User Experience   |
| Dublication Message Check | Checks for the sending of two messages with the same content to prevent multi channel spam | Server Experience |

**Type Command**

| Name                | Description                                                   | Type               |
| ------------------- | ------------------------------------------------------------- | ------------------ |
| Leaderboard         | View your position on the leaderboard for the Leveling system | User               |
| Avatar              | Get a Users avatar                                            | Context/User       |
| Emoji               | Get the Emoji image as an image file                          | Context/User       |
| Who                 | Get user information                                          | Context/User/Admin |
| VoiceChatController | Initate the Voice Chat Controller per server                  | Admin              |
| Speech              | Add speaking lines for the bot to use in the Speech System    | Admin              |

## How to run this bot?

1. Download the repository as a ZIP file then extract it or use GIT.
2. Setup ./database as an empty folder for the database.
3. Setup a ./.env file using the example ENV file.
4. Run ./rebuild.sh for linux or ./rebuild.bat for windows.

## Requirements

- Docker & Docker Compose
- Bun

## I want to help out!

Perfect! Any help is appreciated! Head to out discord server [HERE](https://discord.gg/redmodding) and ask @Moonded for helping out. They then give you any more information required for the project.
