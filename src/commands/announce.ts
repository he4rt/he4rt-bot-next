import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, TextBasedChannel } from 'discord.js'
import { Command } from '../types'
import COMMANDS from '../defines/commands.json'
import { ADVERTS_CHANNEL } from '../defines/ids.json'

export const useAnnounce = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(COMMANDS.ANNOUNCE.TITLE)
    .setDescription(COMMANDS.ANNOUNCE.DESCRIPTION)
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

      const embed = new EmbedBuilder()
        .setTitle('``🔔`` **Heart Informa:**')
        .setDescription(text!.value as string)
        .setColor('#8146DC')
        .setFooter({
          text: `${new Date().getFullYear()} © He4rt Developers`,
          iconURL: 'https://i.imgur.com/14yqEKn.png',
        })
        .setTimestamp()
      if (image?.value) embed.setImage(image.value as string)

      const channel = (client.channels.cache.get(ADVERTS_CHANNEL.id) as TextBasedChannel) || interaction.channel

      await channel?.send({ content: '@everyone', embeds: [embed] })

      await interaction.reply({ content: 'Sucesso!', ephemeral: true })
    },
  ]
}
