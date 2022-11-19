import { Events } from 'discord.js'
import { commandsListener } from '@/commands'
import { He4rtClient } from '@/types'
import { gamificationListener } from './gamification'
import { isValidListenerMessage } from '@/utils'

export const beforeListeners = (client: He4rtClient) => {
  client.on(Events.MessageCreate, (message) => {
    if (!isValidListenerMessage(message)) return

    gamificationListener(client, message)
  })

  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) await commandsListener(client, interaction)
  })
}
