import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { ApoiaseGET, Command, CommandSet } from '@/types'
import { APOIASE } from '@/defines/commands.json'
import { APOIASE_CUSTOM_COLOR_MINIMAL_VALUE } from '@/defines/values.json'
import { DONATOR_ROLE, CHAT_CHANNEL, HE4RT_EMOJI_ID } from '@/defines/ids.json'
import { EMAIL_OPTION, SUCCESS_IN_CHAT } from '-/commands/apoiase.json'
import { getChannel, getOption, getTargetMember, isPresentedMember, reply, sendMessageToChannel } from '@/utils'
import { upsertUser } from '@/http/firebase'

export const useApoiase = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(APOIASE.TITLE)
    .setDescription(APOIASE.DESCRIPTION)
    .setDMPermission(false)
    .addStringOption((option) => option.setName('email').setDescription(EMAIL_OPTION).setRequired(true)) as CommandSet

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
          /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>().,;\s@"]+\.{0,1})+([^<>().,;\s@"]{2,}|[\d.]+))$/,
        )
      ) {
        await reply(interaction).errorInvalidEmail()

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
            upsertUser(client, { id: member.id, donator_email: email, donator_value: thisMonthPaidValue })
              .then(async () => {
                await member.roles.add(DONATOR_ROLE.id)

                const chat = getChannel({ id: CHAT_CHANNEL.id, client })

                client.logger.emit({
                  type: 'apoiase',
                  color: 'success',
                  message: `${getTargetMember(
                    member,
                  )} com o email **${email}** ativou seu apoio no valor de **${thisMonthPaidValue}** reais mensais!`,
                  user: member.user,
                })

                const message = await sendMessageToChannel(chat, `<@${member.user.id}>${SUCCESS_IN_CHAT}`)

                if (message) {
                  await message.suppressEmbeds(true).catch(() => {})
                  await message.react(HE4RT_EMOJI_ID).catch(() => {})
                }
              })
              .catch(() => {
                client.logger.emit({
                  type: 'apoiase',
                  color: 'error',
                  message: `${getTargetMember(
                    member,
                  )} com o email **${email}** não conseguiu vincular sua conta do discord com o apoia.se!`,
                  user: member.user,
                })
              })
          }
        })
        .catch(() => {
          client.logger.emit({
            type: 'apoiase',
            color: 'error',
            message: `${getTargetMember(
              member,
            )} com o email **${email}** não conseguiu vincular sua conta do discord com o apoia.se pois o servidor sequer conseguiu encontrar o designado email!`,
            user: member.user,
          })
        })

      await reply(interaction)
        .executing()
        .catch(() => {})
    },
  ]
}
