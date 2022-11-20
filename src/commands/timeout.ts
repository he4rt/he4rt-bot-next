import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import COMMANDS from '@/defines/commands.json'
import { PUNISHMENTS_CHANNEL } from '@/defines/ids.json'
import TIMEOUT from '@/defines/localisation/commands/timeout.json'
import { embedTemplate, getChannel, getOption, reply } from '@/utils'

export const useTimeout = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(COMMANDS.TIMEOUT.TITLE)
    .setDescription(COMMANDS.TIMEOUT.DESCRIPTION)
    .setDMPermission(false)
    .addUserOption((option) => option.setName('member').setDescription(TIMEOUT.MEMBER_OPTION).setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription(TIMEOUT.REASON_OPTION).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.MuteMembers)

  return [
    data,
    async (interaction, client) => {
      const member = interaction.options.getMember('member') as GuildMember
      const reason = getOption(interaction, 'reason')
      // const time = getOption(interaction, 'time')

      if (!member || !reason) {
        await reply(interaction).error()

        return
      }

      // TODO: dynamic time value
      // const set = 60_000 * (time.value as number)

      try {
        await member.timeout(60_000)
      } catch (e) {
        await reply(interaction).errorPermission()

        return
      }

      const embed = embedTemplate({
        title: '``🚔`` » Suprimido',
        target: {
          user: member.user,
          icon: true,
        },
        author: interaction.user,
        fields: [
          [
            { name: '``👤`` **Usuário:**', value: `**<@${member.user.id}>**` },
            { name: '``📄`` **Tipo:**', value: 'Supressão' },
            { name: '``📣`` **Motivo:**', value: (reason.value as string) || 'Não Inferido.' },
          ],
        ],
      })

      const channel = getChannel({ id: PUNISHMENTS_CHANNEL.id, client })

      await channel?.send({ content: `Usuário ${member.id} suprimido por 1 minuto!`, embeds: [embed] })

      await reply(interaction).success()
    },
  ]
}
