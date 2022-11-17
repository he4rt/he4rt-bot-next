import { Events, Routes } from 'discord.js'
import { Context } from '../types'
import { useAnnounce } from './announce'
import { useCommandsList } from './command_list'
import { useIntroduce } from './introduce'

export const registerCommands = async ({ client, rest }: Context) => {
  const [commandsData, commandsCallback] = useCommandsList()
  const [introduceData, introduceCallback] = useIntroduce()
  const [announceData, announceCallback] = useAnnounce()

  client.commands.set(commandsData, commandsCallback)
  client.commands.set(introduceData, introduceCallback)
  client.commands.set(announceData, announceCallback)

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    switch (interaction.commandName) {
      case introduceData.name:
        introduceCallback(interaction, client)
        break
      case announceData.name:
        announceCallback(interaction, client)
        break
      case commandsData.name:
        commandsCallback(interaction, client)
        break
      default:
        await interaction.reply({
          content: 'Comando inválido!',
          ephemeral: true,
        })
    }
  })

  await rest.put(
    Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID as string, process.env.DISCORD_GUILD_ID as string),
    { body: [...client.commands.keys()] }
  )
}
