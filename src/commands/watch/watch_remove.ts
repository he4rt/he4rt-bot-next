import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command, CommandSet } from '@/types'
import { WATCH_REMOVE } from '@/defines/commands.json'
import { MEMBER_OPTION } from '-/commands/watch.json'
import { removeWatchedUser } from '@/http/firebase'
import { getOption, reply } from '@/utils'

export const useWatchRemove = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(WATCH_REMOVE.TITLE)
    .setDescription(WATCH_REMOVE.DESCRIPTION)
    .setDMPermission(false)
    .addUserOption((option) => option.setName('membro').setDescription(MEMBER_OPTION).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) as CommandSet

  return [
    data,
    async (interaction, client) => {
      const memberOption = getOption(interaction, 'membro')
      const member = interaction.guild.members.cache.get(memberOption.user.id) as GuildMember

      removeWatchedUser(client, { id: member.id })
        .then(async () => {
          await reply(interaction).success()
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
