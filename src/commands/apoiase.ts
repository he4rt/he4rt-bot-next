import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { ApoiaseGET, Command, UserPUT } from '@/types'
import { APOIASE } from '@/defines/commands.json'
import { APOIASE_CUSTOM_COLOR_MINIMAL_VALUE } from '@/defines/values.json'
import { DONATOR_ROLE, CHAT_CHANNEL } from '@/defines/ids.json'
import { EMAIL_OPTION, APOIASE_MEMBER, INVALID_ACCOUNT, SUCCESS_IN_CHAT } from '-/commands/apoiase.json'
import { getChannel, getOption, getTargetMember, isApoiaseMember, isPresentedMember, reply } from '@/utils'

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
      const email = getOption(interaction, 'email').value as string

      if (!isPresentedMember(member)) {
        await reply(interaction).errorMemberIsNotPresented()

        return
      }

      if (
        !email?.match(
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
        .charges(email)
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
                email: email,
                is_donator: 1,
              })
              .then(async () => {
                await member.roles.add(DONATOR_ROLE.id)

                const chat = getChannel({ id: CHAT_CHANNEL.id, client })

                client.logger.emit({
                  type: 'apoiase',
                  color: 'success',
                  message: `${getTargetMember(
                    member
                  )} com o email **${email}** ativou seu apoio no valor de **${thisMonthPaidValue}** reais mensais!`,
                  user: member.user,
                })

                const message = await chat.send(`<@${member.user.id}>${SUCCESS_IN_CHAT}`)

                await message.suppressEmbeds(true).catch(() => {})

                await message.react('💜').catch(() => {})
              })
              .catch(() => {})

            return
          }

          await interaction.reply({
            content: INVALID_ACCOUNT,
            ephemeral: true,
          })
        })
        .catch(() => {})

      await reply(interaction)
        .executing()
        .catch(() => {})
    },
  ]
}
