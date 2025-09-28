import { SlashCommandBuilder } from 'discord.js'
import { command, update } from 'utils'
import { Database } from 'bun:sqlite'

const meta = new SlashCommandBuilder()
    .setName('core-versions')
    .setDescription('Display the core Mods and their latest versions')

export default command(meta, async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return
    if (!interaction.guild) return
    if (interaction.user.bot) return

    const db = new Database('settings.sqlite')

    const query = db.query(`SELECT * FROM 'coremods'`).all()

    if (query.length === 0) {
        db.close()
        return interaction.reply('No data found')
    }

    const localData = query as {
        tagName: string
        version: string
        updatedat: string
        url: string
    }[]

    const embed = [
        {
            title: 'Core mods and frameworks',
            description: `
  The core mods are required for many other mods to function at all. They are version-dependent and will not work with older versions of the game.
  If any of your mods depend on one of the following, make sure to always keep these dependencies up-to-date:

  ●  [RED4ext - ${localData[1].version}](<${localData[1].url}>)
  ●  [ArchiveXL - ${localData[2].version} ](<${localData[2].url}>)
  ●  [TweakXL - ${localData[3].version} ](<${localData[3].url}>)
  ●  [Codeware - ${localData[4].version} ](<${localData[4].url}>)
  ●  [Cyber Engine Tweaks - ${localData[5].version} ](<${localData[5].url}>)
  ●  [REDscript - ${localData[6].version} ](<${localData[6].url}>)

  Check [this wiki page](<https://wiki.redmodding.org/cyberpunk-2077-modding/modding-know-how/frameworks>) for more information.\n-# This data is queried from the local database.`,
            color: 16711680,
        },
    ]

    db.close()

    return interaction.reply({ embeds: embed })
})
