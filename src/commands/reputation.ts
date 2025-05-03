import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command, CommandSet } from '@/types'
import { REPUTATION } from '@/defines/commands.json'
import { MEMBER_OPTION, INVALID_REPUTATION } from '-/commands/reputation.json'
import { getOption, isPresentedMember, reply } from '@/utils'

export const useReputation = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(REPUTATION.TITLE)
    .setDescription(REPUTATION.DESCRIPTION)
    .setDMPermission(false)
    .addUserOption((option) => option.setName('membro').setDescription(MEMBER_OPTION).setRequired(true)) as CommandSet

  return [
    data,
    async (interaction, client) => {
      const author = interaction.member as GuildMember
      const targetOption = getOption(interaction, 'membro')
      const targetUser = targetOption.user
      const target = interaction.guild.members.cache.get(targetUser.id) as GuildMember

      if (!isPresentedMember(author)) {
        await reply(interaction).errorMemberIsNotPresented()

        return
      }

      client.api.he4rt
        .users(author.id)
        .reputation.post({
          receive_id: target.id,
        })
        .then(async () => {
          await reply(interaction).success()
        })
        .catch(async () => {
          await interaction.reply({ content: INVALID_REPUTATION, ephemeral: true })
        })
    },
  ]
}
