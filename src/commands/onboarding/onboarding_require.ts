import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { ONBOARDING_REQUIRE } from '@/defines/commands.json'
import { VOLUNTEER_ROLE, VOLUNTEER_CHANNEL } from '@/defines/ids.json'
import { getChannel, reply } from '@/utils'

export const useOnboardingRequire = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(ONBOARDING_REQUIRE.TITLE)
    .setDescription(ONBOARDING_REQUIRE.DESCRIPTION)
    .setDMPermission(false)

  return [
    data,
    async (interaction, client) => {
      const member = interaction.member as GuildMember

      const channel = getChannel({ id: VOLUNTEER_CHANNEL.id, client })

      await channel.send(`**<@&${VOLUNTEER_ROLE.id}> | <@${member.id}> deseja ser orientado por um voluntário!**`)

      await reply(interaction).success()
    },
  ]
}
