import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command, CommandSet } from '@/types'
import { WATCH } from '@/defines/commands.json'
import { MEMBER_OPTION, REASON_OPTION } from '-/commands/watch.json'
import { insertWatchedUser } from '@/http/firebase'
import { getOption, reply } from '@/utils'

export const useWatch = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(WATCH.TITLE)
    .setDescription(WATCH.DESCRIPTION)
    .setDMPermission(false)
    .addUserOption((option) => option.setName('membro').setDescription(MEMBER_OPTION).setRequired(true))
    .addStringOption((option) => option.setName('razao').setDescription(REASON_OPTION).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) as CommandSet

  return [
    data,
    async (interaction, client) => {
      const memberOption = getOption(interaction, 'membro')
      const member = interaction.guild.members.cache.get(memberOption.user.id) as GuildMember
      const reason = getOption(interaction, 'razao')

      insertWatchedUser(client, { author_id: interaction.user.id, id: member.id, reason: reason.value as string })
        .then(async () => {
          await reply(interaction).success()
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
