import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { BAGDE_SET } from '@/defines/commands.json'
import { CODE_OPTION, REPLY_SUCCESS } from '-/commands/badge.json'
import { getOption, getTargetMember, reply } from '@/utils'

export const useBadge = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(BAGDE_SET.TITLE)
    .setDescription(BAGDE_SET.DESCRIPTION)
    .setDMPermission(false)
    .addStringOption((option) => option.setName('codigo').setDescription(CODE_OPTION).setRequired(true))

  return [
    data,
    async (interaction, client) => {
      const member = interaction.member as GuildMember

      const code = getOption(interaction, 'codigo')

      client.api.he4rt
        .users(member.id)
        ['claim-badge'].post({
          redeem_code: code.value as string,
        })
        .then(async () => {
          client.logger.emit({
            message: `${getTargetMember(interaction.member as GuildMember)} resgatou o distintivo de código **${
              code.value
            }**!`,
            type: 'role',
            color: 'success',
          })

          await interaction.reply({
            content: REPLY_SUCCESS,
            ephemeral: true,
          })
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
