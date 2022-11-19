import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import COMMANDS from '@/defines/commands.json'
import TIMEOUT from '@/defines/localisation/commands/timeout.json'
import { getOption, reply } from '@/utils'

export const useTimeout = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(COMMANDS.TIMEOUT.TITLE)
    .setDescription(COMMANDS.TIMEOUT.DESCRIPTION)
    .setDMPermission(false)
    .addUserOption((option) => option.setName('member').setDescription(TIMEOUT.MEMBER_OPTION).setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription(TIMEOUT.REASON_OPTION).setRequired(true))
    .addNumberOption((option) => option.setName('time').setDescription(TIMEOUT.TIME_OPTION).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.KickMembers)

  return [
    data,
    async (interaction, client) => {
      const member = interaction.options.getMember('member') as GuildMember
      const reason = getOption(interaction, 'reason')
      const time = getOption(interaction, 'time')

      if (!member || !time || !reason) {
        await reply(interaction).error()

        return
      }

      try {
        await member.timeout(60_000 * (time.value as number), reason.value as string)
      } catch (e) {
        await reply(interaction).errorPermission()

        return
      }

      await reply(interaction).success()
    },
  ]
}
