import { Client, Collection, GatewayIntentBits, REST } from 'discord.js'
import { Context, He4rtClient } from './types'
import { registerCommands } from './commands'
import { API } from './api'

export const runner = async (): Promise<Context> => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
    ],
  }) as He4rtClient
  client.commands = new Collection()
  client.api = API

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)

  await registerCommands({ client, rest })

  return { client, rest }
}
