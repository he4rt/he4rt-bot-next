import { SlashCommandBuilder } from 'discord.js'
import { Command } from '../types'
import COMMANDS from '../defines/commands.json'

export const useIntroduce = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(COMMANDS.INTRODUCE.TITLE)
    .setDescription(COMMANDS.INTRODUCE.DESCRIPTION)
    .setDMPermission(true)

  return [
    data,
    async (interaction, client) => {
      const dm = await client.users?.createDM(interaction.user)

      if(!dm) {
        await interaction.reply({ content: 'Não foi possível enviar mensagem pelo privado!', ephemeral: true })

        return
      }

      if(interaction.guild?.roles.cache.some(role => role.name === '🎓 Apresentou')) {
        await interaction.reply({ content: 'Você já se apresentou!', ephemeral: true })

        return
      }

      await dm.send('``❗`` Este é o nosso sistema de apresentação.\n\nResponda as perguntas com sinceridade total por sua pessoa.\nPara cancelar o envio, apenas ignore.\n\n``❗`` Para continuar digite ``!CONTINUAR`` aqui neste chat.')

      await interaction.reply({ content: 'Enviado na DM!', ephemeral: true })
    },
  ]
}
