import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command, CommandSet } from '@/types'
import { ONBOARDING_REQUIRE } from '@/defines/commands.json'
import { VOLUNTEER_ROLE, VOLUNTEER_CHANNEL } from '@/defines/ids.json'
import { getChannel, reply, sendMessageToChannel } from '@/utils'

export const useOnboardingRequire = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(ONBOARDING_REQUIRE.TITLE)
    .setDescription(ONBOARDING_REQUIRE.DESCRIPTION)
    .setDMPermission(false) as CommandSet

  return [
    data,
    async (interaction, client) => {
      const member = interaction.member as GuildMember

      const channel = getChannel({ id: VOLUNTEER_CHANNEL.id, client })

      await sendMessageToChannel(
        channel,
        `**<@&${VOLUNTEER_ROLE.id}> | <@${member.id}> deseja ser orientado por um voluntário!**`,
      )

      await reply(interaction).success()
    },
  ]
}
