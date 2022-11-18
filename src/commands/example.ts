import { SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { EXAMPLE } from '@/defines/commands.json'

export const useExample = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(EXAMPLE.TITLE)
    .setDescription(EXAMPLE.DESCRIPTION)
    .setDMPermission(false)

  return [
    data,
    async (interaction, client) => {
      // code here...
    },
  ]
}
