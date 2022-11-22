import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { ANNOUNCE } from '@/defines/commands.json'
import { ADVERTS_CHANNEL } from '@/defines/ids.json'
import { TEXT_OPTION, IMAGE_OPTION, EMBED_CONTENT, EMBED_TITLE } from '@/defines/localisation/commands/announce.json'
import { embedTemplate, getChannel, reply } from '@/utils'

export const useAnnounce = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(ANNOUNCE.TITLE)
    .setDescription(ANNOUNCE.DESCRIPTION)
    .setDMPermission(false)
    .addStringOption((option) => option.setName('texto').setDescription(TEXT_OPTION).setRequired(true))
    .addStringOption((option) => option.setName('imagem').setDescription(IMAGE_OPTION))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

  return [
    data,
    async (interaction, client) => {
      const text = interaction.options.get('texto')
      const image = interaction.options.get('imagem')

      const embed = embedTemplate({
        title: EMBED_TITLE,
        description: text!.value as string,
      })
      if (image?.value) embed.setImage(image.value as string)

      const channel = getChannel({ id: ADVERTS_CHANNEL.id, client })

      await channel?.send({ content: EMBED_CONTENT, embeds: [embed] })

      await reply(interaction).success()
    },
  ]
}
