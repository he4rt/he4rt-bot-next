import { Events } from 'discord.js'
import { commandsListener } from '@/commands'
import { He4rtClient } from '@/types'
import { gamificationListener } from './gamification'
import { isBot, isValidListenerMessage } from '@/utils'
import { deleteUserInServerLeave } from './guild'

export const beforeListeners = (client: He4rtClient) => {
  client.on(Events.GuildMemberRemove, (member) => {
    if (isBot(member.user)) return

    deleteUserInServerLeave(client, member.user.id)
  })

  client.on(Events.MessageCreate, (message) => {
    if (!isValidListenerMessage(message)) return

    gamificationListener(client, message)
  })

  client.on(Events.InteractionCreate, (interaction) => {
    if (interaction.isChatInputCommand()) commandsListener(client, interaction)
  })
}
