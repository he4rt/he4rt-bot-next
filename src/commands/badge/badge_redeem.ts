import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command, CommandSet } from '@/types'
import { BADGE_SET } from '@/defines/commands.json'
import { CODE_OPTION, REPLY_SUCCESS, REPLY_ERROR } from '-/commands/badge_redeem.json'
import { getOption, getTargetMember } from '@/utils'

export const useBadgeRedeem = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(BADGE_SET.TITLE)
    .setDescription(BADGE_SET.DESCRIPTION)
    .setDMPermission(false)
    .addStringOption((option) => option.setName('codigo').setDescription(CODE_OPTION).setRequired(true)) as CommandSet

  return [
    data,
    async (interaction, client) => {
      const member = interaction.member as GuildMember

      const code = getOption(interaction, 'codigo')

      client.api.he4rt.characters
        .discord(member.id)
        ['claimBadge'].post({
          redeem_code: code.value as string,
        })
        .then(async () => {
          client.logger.emit({
            message: `${getTargetMember(interaction.member as GuildMember)} resgatou o distintivo de código **${
              code.value
            }**!`,
            type: 'he4rt-api',
            color: 'success',
          })

          await interaction.reply({
            content: REPLY_SUCCESS,
            ephemeral: true,
          })
        })
        .catch(async () => {
          await interaction.reply({
            content: REPLY_ERROR,
            ephemeral: true,
          })
        })
    },
  ]
}
