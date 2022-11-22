import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { BAN } from '@/defines/commands.json'
import { MEMBER_OPTION, REASON_OPTION, EMBED_TITLE } from '@/defines/localisation/commands/ban.json'
import {
  EMBED_FIELD_PUNISHED,
  EMBED_FIELD_TYPE,
  EMBED_FIELD_REASON,
  EMBED_FIELD_REASON_VALUE,
  EMBED_FIELD_TYPE_BAN,
} from '@/defines/localisation/commands/shared.json'
import { PUNISHMENTS_CHANNEL } from '@/defines/ids.json'
import { embedTemplate, getChannel, reply } from '@/utils'

export const useBan = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(BAN.TITLE)
    .setDescription(BAN.DESCRIPTION)
    .setDMPermission(false)
    .addUserOption((option) => option.setName('membro').setDescription(MEMBER_OPTION).setRequired(true))
    .addStringOption((option) => option.setName('razao').setDescription(REASON_OPTION).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)

  return [
    data,
    async (interaction, client) => {
      const author = interaction.user

      const user = interaction.options.getUser('membro')
      const reason = interaction.options.get('razao')

      if (!user || !reason) {
        return
      }

      try {
        await interaction?.guild?.members.ban(user)
      } catch (e) {
        await reply(interaction).errorUserCannotBeBaned()

        return
      }

      const embed = embedTemplate({
        title: EMBED_TITLE,
        target: {
          user,
          icon: true,
        },
        author,
        fields: [
          [
            { name: EMBED_FIELD_PUNISHED, value: `**${user!.username}**` },
            { name: EMBED_FIELD_TYPE, value: EMBED_FIELD_TYPE_BAN },
            { name: EMBED_FIELD_REASON, value: (reason.value as string) || EMBED_FIELD_REASON_VALUE },
          ],
        ],
      })

      const channel = getChannel({ id: PUNISHMENTS_CHANNEL.id, client })

      await channel?.send({ content: `Usuário **${user.id}** Banido!`, embeds: [embed] })

      await reply(interaction).success()
    },
  ]
}
