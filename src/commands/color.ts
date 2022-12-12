import { CommandInteractionOption, GuildMember, HexColorString, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { COLOR } from '@/defines/commands.json'
import { DONATORS_CHANNEL } from '@/defines/ids.json'
import { HEX_ERROR, HEX_OPTION, HEX_SUCCESS, HEX_ERROR_IN_SPECIFIC_COLOR } from '-/commands/color.json'
import { getCustomColorRole, getTargetMember, isCustomColorRole, isHex, isPrivilegedMember, reply } from '@/utils'

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

      if (!isPrivilegedMember(member)) {
        await reply(interaction).errorPermission()

        return
      }

      if (interaction.channel.id !== DONATORS_CHANNEL.id) {
        await reply(interaction).errorSpecificChannel(DONATORS_CHANNEL.title)

        return
      }

      if (!isHex(color)) {
        await interaction.reply({ content: HEX_ERROR, ephemeral: true })

        return
      }

      if (color === '#000000') {
        await interaction.reply({ content: HEX_ERROR_IN_SPECIFIC_COLOR, ephemeral: true })

        return
      }

      const colorRole = getCustomColorRole(member)

      const highestRole = member.roles.highest
      const priority = highestRole.position + 1

      const content = `<@${member.id}>${HEX_SUCCESS}(${color})`

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

            await interaction.channel.send({ content })

            client.logger.emit({
              message: `${getTargetMember(member)} criou seu cargo colorido!`,
              type: 'role',
              color: 'success',
            })

            await reply(interaction).success()
          })
          .catch(async () => {
            await reply(interaction).error()
          })

        return
      }

      await colorRole.setColor(color).catch(() => {})
      if (!isCustomColorRole(highestRole.name)) await colorRole.setPosition(priority).catch(() => {})

      client.logger.emit({
        message: `${getTargetMember(member)} atualizou seu cargo colorido!`,
        type: 'role',
        color: 'warning',
      })

      await interaction.channel.send({ content })

      await reply(interaction).success()
    },
  ]
}
