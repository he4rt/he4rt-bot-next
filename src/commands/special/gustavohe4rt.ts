import { SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { SPECIAL_GUSTAVOHE4RT } from '@/defines/commands.json'

export const useSpecialGustavoHe4rt = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(SPECIAL_GUSTAVOHE4RT.TITLE)
    .setDescription(SPECIAL_GUSTAVOHE4RT.DESCRIPTION)
    .setDMPermission(false)

  return [
    data,
    async (interaction, client) => {
      await interaction.reply({ content: '🔥⚡😎😤🤬💜🥵🤑🫣😤🥱👉⚡🫣👌🙄', ephemeral: true }).catch(() => {})
    },
  ]
}
