import { CommandInteractionOption, GuildMember, HexColorString, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { COLOR } from '@/defines/commands.json'
import { DONATORS_CHANNEL } from '@/defines/ids.json'
import { isPrivileged } from '@/utils'

export const useColor = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(COLOR.TITLE)
    .setDescription(COLOR.DESCRIPTION)
    .setDMPermission(false)
    .addStringOption((option) =>
      option.setName('hex').setDescription('Coloração Desejada em HEX. Formato de Exemplo: #FFFFFF').setRequired(true)
    )

  return [
    data,
    async (interaction, client) => {
      const member = interaction.member as GuildMember
      const nick = interaction.user.tag

      const hex = interaction.options.get('hex') as CommandInteractionOption
      const color = hex.value as HexColorString

      if (!isPrivileged(member)) {
        await interaction.reply({ content: 'Você não possui permissão para utilizar este comando!', ephemeral: true })

        return
      }

      if (interaction.channel?.id !== DONATORS_CHANNEL.id) {
        await interaction.reply({
          content: `Só é permitido usar este comando no canal ${DONATORS_CHANNEL.title}!`,
          ephemeral: true,
        })

        return
      }

      if (!color.match(/^#[0-9A-F]{6}$/i)) {
        await interaction.reply({ content: 'Digite uma cor válida no formato hexadecimal (#FFFFFF)!', ephemeral: true })

        return
      }

      const colorRole = member.roles.cache.find((x) => /.+#\d{4}/i.test(x.name))
      const priority = member.roles.highest.position + 1

      if (!colorRole) {
        interaction?.guild?.roles
          .create({
            name: nick,
            color,
            permissions: [],
            hoist: false,
            mentionable: false,
            position: priority,
          })
          .then(async (role) => {
            await member.roles.add(role)

            await interaction.reply({ content: 'Cargo criado com sucesso!', ephemeral: true })
          })

        return
      }

      await colorRole.setColor(color)
      await colorRole.setPosition(priority)

      await interaction.reply({ content: 'Cor alterada com sucesso!', ephemeral: true })
    },
  ]
}
