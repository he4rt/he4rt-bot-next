import { Client, Collection, GatewayIntentBits, REST } from 'discord.js'
import { Context, He4rtClient } from './types'
import { registerCommands } from './commands'
import { ofetch } from 'ofetch'

export const runner = async (): Promise<Context> => {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages],
  }) as He4rtClient
  client.commands = new Collection()

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN as string)

  await registerCommands({ client, rest })

  return { client, rest }
}
