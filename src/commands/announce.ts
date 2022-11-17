import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, TextBasedChannel } from 'discord.js'
import { Command } from '../types'
import COMMANDS from '../defines/commands.json'
import IDS from '../defines/ids.json'

export const useAnnounce = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(COMMANDS.ANNOUNCE.TITLE)
    .setDescription(COMMANDS.ANNOUNCE.DESCRIPTION)
    .setDMPermission(false)
    .addStringOption((option) =>
      option.setName('texto').setDescription('Texto que irá aparecer no anúncio').setRequired(true)
    )
    .addStringOption((option) => option.setName('imagem').setDescription('Possível imagem no anúncio'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

  return [
    data,
    async (interaction, client) => {
      const option_message = interaction.options.get('texto')
      const option_image = interaction.options.get('imagem')

      const embed = new EmbedBuilder()
        .setTitle('``🔔`` **Heart Informa:**')
        .setDescription(option_message!.value as string)
        .setColor('#8146DC')
        .setFooter({
          text: `${new Date().getFullYear()} © He4rt Developers`,
          iconURL: 'https://i.imgur.com/14yqEKn.png',
        })
        .setTimestamp()
      if (option_image?.value) embed.setImage(option_image.value as string)

      const channel = client.channels.cache.get(IDS.ADVERTS_CHANNEL) as TextBasedChannel || interaction.channel;

      await channel?.send({ content: '@everyone', embeds: [embed] })

      await interaction.reply({ content: 'Sucesso!', ephemeral: true })
    },
  ]
}
