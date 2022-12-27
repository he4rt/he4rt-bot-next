import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import COMMANDS from '@/defines/commands.json'
import { PUNISHMENTS_CHANNEL } from '@/defines/ids.json'
import TIMEOUT from '-/commands/timeout.json'
import {
  EMBED_FIELD_USER,
  EMBED_FIELD_TYPE,
  EMBED_FIELD_REASON,
  EMBED_FIELD_REASON_VALUE,
} from '-/commands/shared.json'
import { embedTemplate, getChannel, getOption, reply } from '@/utils'

export const useTimeout = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(COMMANDS.TIMEOUT.TITLE)
    .setDescription(COMMANDS.TIMEOUT.DESCRIPTION)
    .setDMPermission(false)
    .addUserOption((option) => option.setName('membro').setDescription(TIMEOUT.MEMBER_OPTION).setRequired(true))
    .addStringOption((option) => option.setName('razao').setDescription(TIMEOUT.REASON_OPTION).setRequired(true))
    .addNumberOption((option) =>
      option
        .setName('tempo')
        .setDescription(TIMEOUT.TIME_OPTION)
        .setRequired(true)
        .addChoices(
          { name: '60 segundos', value: 60_000 },
          { name: '5 minutos', value: 300_000 },
          { name: '10 minutos', value: 600_000 },
          { name: '1 hora', value: 3600_000 },
          { name: '1 dia', value: 86400_000 },
          { name: '1 semana', value: 604800_000 }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)

  return [
    data,
    async (interaction, client) => {
      const member = interaction.options.getMember('membro') as GuildMember
      const reason = getOption(interaction, 'razao')
      const time = getOption(interaction, 'tempo')

      if (!member || !reason || !time) {
        await reply(interaction).error()

        return
      }

      const timeout = time.value as number

      try {
        await member.timeout(timeout, reason.value as string)
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
            { name: EMBED_FIELD_USER, value: `**<@${member.user.id}>**` },
            { name: EMBED_FIELD_TYPE, value: 'Supressão' },
            { name: EMBED_FIELD_REASON, value: (reason.value as string) || EMBED_FIELD_REASON_VALUE },
          ],
        ],
      })

      const channel = getChannel({ id: PUNISHMENTS_CHANNEL.id, client })

      const normalize =
        {
          60000: '60 segundos',
          300000: '5 minutos',
          600000: '10 minutos',
          3600000: '1 hora',
          86400000: '1 dia',
          604800000: '1 semana',
        }[timeout] || 'deu ruim'

      await channel?.send({ content: `Usuário **${member.id}** suprimido por ${normalize}!`, embeds: [embed] })

      await reply(interaction).success()
    },
  ]
}
