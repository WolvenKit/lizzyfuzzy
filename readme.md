# LizzyFuzzy

A simple discord bot for the Cyberpunk Modding Community discord server written in Typescript using [https://discord.js.org/](https://discord.js.org/).

## Slash Commands

### Modding

| Command | Description                                        | Requirements |
| ------- | -------------------------------------------------- | ------------ |
| `who`   | Admin command for getting information about a user | ManageServer |

### Common

| Command | Description                             | Requirements |
| ------- | --------------------------------------- | ------------ |
| `meme`  | Generate a meme from a memegen template |              |

## Message Commands

| Command              | Description                                                 | Requirements |
| -------------------- | ----------------------------------------------------------- | ------------ |
| Check DDS Format     | Right click on an uploaded .dds file to get the DXGI format |              |
| Get custom emote url | Right click on a single emote message to get the emote url  |              |

## User Commands

| Command         | Description                                 | Requirements |
| --------------- | ------------------------------------------- | ------------ |
| Get user avatar | Right click on a user to get the avatar url |              |

## API

| Endpoint           | Description                                                      | Requirements                                                         |
| ------------------ | ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| /api/discord/user  | Provides information of a user/users                             | Needs search params of `server=server_ID` and json array of user ids |
| /api/discord/roles | Provides information about all the available roles on the Server | Needs search params of `server=server_ID`                            |
| /\*                | All Routes                                                       | Every Request requires Authorization via Bearer + Token              |

## Help Functions

| Function            | Description                                                                                      | Requirements |
| ------------------- | ------------------------------------------------------------------------------------------------ | ------------ |
| Image to Text       | Convers screenshot images to text and checks for support query reason                            |              |
| Message File Upload | Checks an uploaded file, specifically log file for their type and information about the problems |              |
