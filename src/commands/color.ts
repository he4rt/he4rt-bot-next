import { CommandInteractionOption, GuildMember, HexColorString, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { COLOR } from '@/defines/commands.json'
import { DONATORS_CHANNEL } from '@/defines/ids.json'
import { HEX_ERROR, HEX_OPTION } from '@/defines/localisation/commands/color.json'
import { ROLE_CREATED, COLOR_CHANGED } from '@/defines/localisation/commands/shared.json'
import { isPrivileged, reply } from '@/utils'

export const useColor = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(COLOR.TITLE)
    .setDescription(COLOR.DESCRIPTION)
    .setDMPermission(false)
    .addStringOption((option) => option.setName('hex').setDescription(HEX_OPTION).setRequired(true))

  return [
    data,
    async (interaction, client) => {
      const member = interaction.member as GuildMember
      const nick = interaction.user.tag

      const hex = interaction.options.get('hex') as CommandInteractionOption
      const color = hex.value as HexColorString

      if (!isPrivileged(member)) {
        await reply(interaction).errorPermission()

        return
      }

      if (interaction.channel?.id !== DONATORS_CHANNEL.id) {
        await reply(interaction).errorSpecificChannel(DONATORS_CHANNEL.title)

        return
      }

      if (!color.match(/^#[0-9A-F]{6}$/i)) {
        await interaction.reply({ content: HEX_ERROR, ephemeral: true })

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

            await interaction.reply({ content: ROLE_CREATED, ephemeral: true })
          })

        return
      }

      await colorRole.setColor(color)
      await colorRole.setPosition(priority)

      await interaction.reply({ content: COLOR_CHANGED, ephemeral: true })
    },
  ]
}
