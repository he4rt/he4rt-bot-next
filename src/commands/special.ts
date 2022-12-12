import { SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { SPECIAL } from '@/defines/commands.json'
import { TYPE_OPTION } from '-/commands/special.json'
import { getOption, reply } from '@/utils'

export const useSpecial = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(SPECIAL.TITLE)
    .setDescription(SPECIAL.DESCRIPTION)
    .setDMPermission(false)
    .addIntegerOption((option) =>
      option
        .setName('membro')
        .setDescription(TYPE_OPTION)
        .setRequired(true)
        .addChoices({ name: 'Logikoz', value: 0 }, { name: 'GustavoHe4rt', value: 1 })
    )

  return [
    data,
    async (interaction, client) => {
      const type = getOption(interaction, 'membro')

      ;((
        {
          0: async () => {
            await interaction.reply({ content: 'c# the best', ephemeral: true }).catch(() => {})
          },
          1: async () => {
            await interaction.reply({ content: '🔥⚡😎😤🤬💜🥵🤑🫣😤🥱👉⚡🫣👌🙄', ephemeral: true }).catch(() => {})
          },
        }[type.value as number] ||
        (async () => {
          await reply(interaction).success()
        })
      )())
    },
  ]
}
