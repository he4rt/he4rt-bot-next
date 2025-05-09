import { GuildMember, Message, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js'
import { Command, CommandSet } from '@/types'
import { BAN } from '@/defines/commands.json'
import { MEMBER_OPTION, REASON_OPTION, EXPOSE_OPTION, EMBED_TITLE } from '-/commands/ban.json'
import {
  EMBED_FIELD_PUNISHED,
  EMBED_FIELD_TYPE,
  EMBED_FIELD_REASON,
  EMBED_FIELD_REASON_VALUE,
  EMBED_FIELD_TYPE_BAN,
} from '-/commands/shared.json'
import { PUNISHMENTS_CHANNEL, HE4RT_EMOJI_ID } from '@/defines/ids.json'
import { CLIENT_NAME } from '@/defines/values.json'
import { embedTemplate, getChannel, getOption, openAndSendMessageInDm, reply, sendMessageToChannel } from '@/utils'

export const useBan = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(BAN.TITLE)
    .setDescription(BAN.DESCRIPTION)
    .setDMPermission(false)
    .addUserOption((option) => option.setName('membro').setDescription(MEMBER_OPTION).setRequired(true))
    .addStringOption((option) => option.setName('razao').setDescription(REASON_OPTION).setRequired(true))
    .addChannelOption((option) => option.setName('expor').setDescription(EXPOSE_OPTION))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) as CommandSet

  return [
    data,
    async (interaction, client) => {
      const author = interaction.user

      const memberOption = getOption(interaction, 'membro')
      const member = interaction.guild.members.cache.get(memberOption.user.id) as GuildMember
      const reason = interaction.options.get('razao')
      const expose = interaction.options.get('expor')

      await openAndSendMessageInDm(
        client,
        member,
        `Você foi banido do servidor **${CLIENT_NAME}**!\n\nMotivo: ${reason.value}`,
      )

      interaction.guild.members
        .ban(member, { reason: reason.value as string, deleteMessageSeconds: 604800 })
        .catch(async () => {
          await reply(interaction).errorUserCannotBeBaned()
        })
        .then(async () => {
          const embed = embedTemplate({
            title: EMBED_TITLE,
            target: {
              user: member.user,
              icon: true,
            },
            author,
            fields: [
              [
                { name: EMBED_FIELD_PUNISHED, value: `**${member.nickname ?? member.user.username}**` },
                { name: EMBED_FIELD_TYPE, value: EMBED_FIELD_TYPE_BAN },
                { name: EMBED_FIELD_REASON, value: (reason.value as string) || EMBED_FIELD_REASON_VALUE },
              ],
            ],
          })

          const channel = getChannel({ id: PUNISHMENTS_CHANNEL.id, client })

          await sendMessageToChannel(channel, { content: `Usuário **${member.id}** Banido!`, embeds: [embed] })

          if (expose?.channel) {
            const target = expose.channel as TextChannel

            const msg = (await sendMessageToChannel(target, {
              content: `Usuário **${member.nickname ?? member.user.username}** Banido!`,
              embeds: [embed],
            })) as Message
            if (msg) {
              await msg.react(HE4RT_EMOJI_ID).catch(async () => {
                await msg.react('💜').catch(() => {})
              })
            }
          }

          await reply(interaction).success()
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
