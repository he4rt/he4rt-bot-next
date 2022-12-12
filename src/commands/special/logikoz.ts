import { SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { SPECIAL_LOGIKOZ } from '@/defines/commands.json'

export const useSpecialLogikoz = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(SPECIAL_LOGIKOZ.TITLE)
    .setDescription(SPECIAL_LOGIKOZ.DESCRIPTION)
    .setDMPermission(false)

  return [
    data,
    async (interaction, client) => {
      await interaction.reply({ content: 'c# the best', ephemeral: true }).catch(() => {})
    },
  ]
}
