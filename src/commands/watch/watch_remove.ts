import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { WATCH_REMOVE } from '@/defines/commands.json'
import { MEMBER_OPTION } from '-/commands/watch.json'
import { removeWatchedUser } from '@/http/firebase'
import { reply } from '@/utils'

export const useWatchRemove = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(WATCH_REMOVE.TITLE)
    .setDescription(WATCH_REMOVE.DESCRIPTION)
    .setDMPermission(false)
    .addUserOption((option) => option.setName('membro').setDescription(MEMBER_OPTION).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)

  return [
    data,
    async (interaction, client) => {
      const member = interaction.options.getMember('membro') as GuildMember

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
