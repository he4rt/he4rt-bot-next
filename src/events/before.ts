import { Events } from 'discord.js'
import { commandsListener } from '@/commands'
import { He4rtClient } from '@/types'

export const beforeListeners = (client: He4rtClient) => {
  /*
   * TODO: fds essa merda bugada do caralho  
  client.on(Events.MessageCreate, async (message) => {
    await gamificationListener(client, message)
  })
  */

  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) await commandsListener(client, interaction)
  })
}
