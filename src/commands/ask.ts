import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { ASK } from '@/defines/commands.json'
import { MEMBER_OPTION, EMBED_TITLE, EMBED_IMAGE_URL } from '-/commands/ask.json'
import { embedTemplate, reply } from '@/utils'

export const useAsk = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(ASK.TITLE)
    .setDescription(ASK.DESCRIPTION)
    .setDMPermission(false)
    .addUserOption((option) => option.setName('membro').setDescription(MEMBER_OPTION).setRequired(true))

  return [
    data,
    async (interaction, client) => {
      const author = interaction.user
      const target = interaction.options.getMember('membro') as GuildMember

      const embed = embedTemplate({
        title: EMBED_TITLE,
        description: `
          Ei **${target.user.username}**
          Explique a ideia
          Mostre o que você tentou
          Mostre o que deu errado
          E nos facilite a resolver o seu problema!
        `,
        author: author,
        target: {
          user: target.user,
          icon: true,
        },
      })
      embed.setImage(EMBED_IMAGE_URL)

      await interaction.channel.send({
        content: `<@${target.user.id}>`,
        embeds: [embed],
      })

      await reply(interaction).success()
    },
  ]
}
