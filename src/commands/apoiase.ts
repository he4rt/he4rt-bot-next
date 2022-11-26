import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { ApoiaseGET, Command, UserPUT } from '@/types'
import { APOIASE } from '@/defines/commands.json'
import { APOIASE_CUSTOM_COLOR_MINIMAL_VALUE } from '@/defines/values.json'
import { DONATOR_ROLE, REPORT_CHANNEL, CHAT_CHANNEL } from '@/defines/ids.json'
import { EMAIL_OPTION, APOIASE_MEMBER, INVALID_ACCOUNT, SUCCESS_ACCOUNT } from '-/commands/apoiase.json'
import { getChannel, getOption, isApoiaseMember, isPresentedMember, reply } from '@/utils'

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

      if (!isPresentedMember(member)) {
        await reply(interaction).errorMemberIsNotPresented()

        return
      }

      if (
        !value.match(
          /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/
        )
      ) {
        await reply(interaction).errorInvalidEmail()

        return
      }

      if (isApoiaseMember(member)) {
        await interaction.reply({
          content: APOIASE_MEMBER,
          ephemeral: true,
        })

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
            client.api.he4rt
              .users(member.id)
              .put<UserPUT>({
                email: value,
                is_donator: 1,
              })
              .then(async () => {
                await member.roles.add(DONATOR_ROLE.id)

                const report = getChannel({ id: REPORT_CHANNEL.id, client })
                const chat = getChannel({ id: CHAT_CHANNEL.id, client })

                await report.send({
                  content: `**${member.id} - ${
                    member.user.username || 'Indefinido'
                  }** com o email **${value}** ativou seu apoio do **apoia.se** no valor de **${thisMonthPaidValue}** reais mensais!`,
                })

                const message = await chat.send(
                  `<@${member.user.id}> acabou de apoiar a nossa comunidade no Apoia.se :he4rt: , caso queira contribuir financeiramente entre no nosso apoia.se https://apoia.se/heartdevs, e com apenas R$ 5 você já está apoiando nossa comunidade! 💜`
                )

                await message.suppressEmbeds(true).catch(() => {})
              })
              .catch(() => {})
              .finally(async () => {
                await interaction.reply({ content: SUCCESS_ACCOUNT, ephemeral: true }).catch(() => {})
              })

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
