import { GuildMember, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js'
import { Command } from '@/types'
import SUGGEST_INTRODUCE_LABELS from '-/commands/suggest_introduction.json'
import { SUGGEST_INTRODUCE } from '@/defines/commands.json'
import {
  interpolate,
  isPresentedMember,
  isPresentingMember,
  reply,
} from '@/utils'
import { embedTemplate } from '@/utils'


export const useSuggestIntroduction = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(SUGGEST_INTRODUCE.TITLE)
    .setDescription(SUGGEST_INTRODUCE.DESCRIPTION)
    .setDMPermission(false)
    .addUserOption(
      option =>
        option
          .setRequired(true)
          .setName('member')
          .setDescription(SUGGEST_INTRODUCE_LABELS.OPTIONS_MEMBER)
    )

  return [
    data,
    async (interaction, client) => {
      const author = interaction.user
      const target = interaction.options.getMember('member') as GuildMember

      if (isPresentingMember(target)) {
        await reply(interaction).errorMemberPresentingFail()
        return
      }
      
      if (isPresentedMember(target)) {
        await reply(interaction).errorMemberPresentedFail()
        return
      }

      const component = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('c-introduce')
            .setLabel(SUGGEST_INTRODUCE_LABELS.CALL_TO_ACTION)
            .setStyle(ButtonStyle.Primary)
        )

      const embed = embedTemplate({
        title: interpolate(
          SUGGEST_INTRODUCE_LABELS.EMBED.TITLE,
          { user: target.user.username }
        ),
        author: author,
        target: {
          user: target.user,
          icon: true,
        },
        description: SUGGEST_INTRODUCE_LABELS.EMBED.DESCRIPTION,
      })
      
      await interaction.channel.send({
        content: `<@${target.user.id}>`,
        embeds: [embed],
        components: [component]
      })

      await reply(interaction).success()
    },
  ]
}
