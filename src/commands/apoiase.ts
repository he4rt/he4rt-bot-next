import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { ApoiaseGET, Command } from '@/types'
import { APOIASE } from '@/defines/commands.json'
import { APOIASE_CUSTOM_COLOR_MINIMAL_VALUE } from '@/defines/values.json'
import { DONATOR_ROLE } from '@/defines/ids.json'
import { EMAIL_OPTION, INVALID_ACCOUNT, SUCCESS_ACCOUNT } from '-/commands/apoiase.json'
import { getOption, reply } from '@/utils'

export const useApoiase = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(APOIASE.TITLE)
    .setDescription(APOIASE.DESCRIPTION)
    .setDMPermission(false)
    .addStringOption((option) => option.setName('email').setDescription(EMAIL_OPTION).setRequired(true))

  return [
    data,
    async (interaction, client) => {
      const member = interaction.member as GuildMember
      const email = getOption(interaction, 'email')

      const value = email.value as string

      if (
        !value.match(
          /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/
        )
      ) {
        await reply(interaction).errorInvalidEmail()

        return
      }

      client.api.apoiase.backers
        .charges(value)
        .get<ApoiaseGET>()
        .then(async ({ isBacker, isPaidThisMonth, thisMonthPaidValue }) => {
          if (
            isBacker &&
            isPaidThisMonth &&
            thisMonthPaidValue &&
            thisMonthPaidValue >= APOIASE_CUSTOM_COLOR_MINIMAL_VALUE
          ) {
            member.roles.add(DONATOR_ROLE.id)

            await interaction.reply({ content: SUCCESS_ACCOUNT, ephemeral: true }).catch(() => {})

            return
          }

          await interaction.reply({
            content: INVALID_ACCOUNT,
            ephemeral: true,
          })
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
