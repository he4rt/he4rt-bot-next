import { ChannelType, CommandInteractionOption, GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { MEDAL } from '@/defines/commands.json'
import medals from '@/defines/medals.json'
import { MEDAL_OPTION, NOT_EXIST, DO_NOT_HAVE, ALREADY, SUCCESS } from '-/commands/medal.json'
import { hasRole } from '../utils'

export const useMedal = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(MEDAL.TITLE)
    .setDescription(MEDAL.DESCRIPTION)
    .setDMPermission(false)
    .addStringOption((option) => option.addChoices({name: medals[0].name, value: medals[0].medal_role_id}).setName('medal').setDescription(MEDAL_OPTION).setRequired(true))

  return [
    data,
    async (interaction, _) => {
      const member = interaction.member as GuildMember

      const medalArg = interaction.options.get('medal') as CommandInteractionOption
      const medalSelected = medals.find(medal => medal.medal_role_id === medalArg.value);

      if(!medalSelected) {
        await interaction.reply({ content: NOT_EXIST, ephemeral: true })
        return
      }
      if(!medalSelected.members_id.includes(member.id)) {
        await interaction.reply({ content: DO_NOT_HAVE, ephemeral: true })
        return
      }
      if(hasRole(member, medalSelected.medal_role_id)) {
        await interaction.reply({ content: ALREADY, ephemeral: true })
        return
      }

      await member.roles.remove(medals.map(medal => medal.medal_role_id).filter(role_id => role_id !== medalSelected.medal_role_id))
      await member.roles.add(medalSelected.medal_role_id)
      await interaction.reply({ content: SUCCESS, ephemeral: true })
      
      return
    },
  ]
}
