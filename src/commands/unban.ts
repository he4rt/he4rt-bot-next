import { Message, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js'
import { Command } from '@/types'
import { UNBAN } from '@/defines/commands.json'
import { MEMBER_OPTION, REASON_OPTION, EXPOSE_OPTION, EMBED_TITLE } from '-/commands/unban.json'
import { EMBED_FIELD_TYPE_BAN } from '-/commands/shared.json'
import { PUNISHMENTS_CHANNEL, HE4RT_EMOJI_ID } from '@/defines/ids.json'
import {
  EMBED_FIELD_UNPUNISHED,
  EMBED_FIELD_TYPE,
  EMBED_FIELD_REASON,
  EMBED_FIELD_REASON_VALUE,
} from '@/defines/localisation/commands/shared.json'
import { embedTemplate, getChannel, reply } from '@/utils'

export const useUnban = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(UNBAN.TITLE)
    .setDescription(UNBAN.DESCRIPTION)
    .setDMPermission(false)
    .addUserOption((option) => option.setName('membro').setDescription(MEMBER_OPTION).setRequired(true))
    .addStringOption((option) => option.setName('razao').setDescription(REASON_OPTION).setRequired(true))
    .addChannelOption((option) => option.setName('expor').setDescription(EXPOSE_OPTION))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)

  return [
    data,
    async (interaction, client) => {
      const author = interaction.user

      const user = interaction.options.getUser('membro')
      const reason = interaction.options.get('razao')
      const expose = interaction.options.get('expor')

      interaction.guild.members
        .unban(user, reason.value as string)
        .then(async () => {
          const embed = embedTemplate({
            title: EMBED_TITLE,
            target: {
              user,
              icon: true,
            },
            author,
            fields: [
              [
                { name: EMBED_FIELD_UNPUNISHED, value: `**${user!.username}**` },
                { name: EMBED_FIELD_TYPE, value: EMBED_FIELD_TYPE_BAN },
                { name: EMBED_FIELD_REASON, value: (reason.value as string) || EMBED_FIELD_REASON_VALUE },
              ],
            ],
          })

          const channel = getChannel({ id: PUNISHMENTS_CHANNEL.id, client })

          await channel?.send({ content: `Usuário **${user.id}** Desbanido!`, embeds: [embed] })

          if (expose.channel) {
            const target = expose.channel as TextChannel

            await target
              .send({ content: `Usuário **${user.username ?? user.id}** Desbanido!`, embeds: [embed] })
              .then(async (msg: Message) => {
                await msg.react(HE4RT_EMOJI_ID).catch(async () => {
                  await msg.react('💜').catch(() => {})
                })
              })
          }

          await reply(interaction).success()
        })
        .catch(async () => {
          await reply(interaction).errorUserCannotBeBaned()
        })
    },
  ]
}
