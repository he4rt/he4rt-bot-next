import { PermissionFlagsBits, SlashCommandBuilder, TextBasedChannel } from 'discord.js'
import { Command } from '@/types'
import { ANNOUNCE } from '@/defines/commands.json'
import { ADVERTS_CHANNEL } from '@/defines/ids.json'
import { embedTemplate } from '@/utils'

export const useAnnounce = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(ANNOUNCE.TITLE)
    .setDescription(ANNOUNCE.DESCRIPTION)
    .setDMPermission(false)
    .addStringOption((option) =>
      option.setName('text').setDescription('Texto que irá aparecer no anúncio').setRequired(true)
    )
    .addStringOption((option) => option.setName('image').setDescription('Possível imagem no anúncio'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

  return [
    data,
    async (interaction, client) => {
      const text = interaction.options.get('text')
      const image = interaction.options.get('image')

      const embed = embedTemplate({
        title: '``🔔`` **Heart Informa:**',
        description: text!.value as string,
      })
      if (image?.value) embed.setImage(image.value as string)

      const channel = (client.channels.cache.get(ADVERTS_CHANNEL.id) as TextBasedChannel) || interaction.channel

      await channel?.send({ content: '@everyone', embeds: [embed] })

      await interaction.reply({ content: 'Sucesso!', ephemeral: true })
    },
  ]
}
