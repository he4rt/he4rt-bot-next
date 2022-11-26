import { Client, Collection, GatewayIntentBits, Options, REST } from 'discord.js'
import { Context, He4rtClient } from './types'
import { registerCommands } from './commands'
import { HE4RT, APOIASE } from './http'

export const runner = async (): Promise<Context> => {
  const client = new Client({
    makeCache: Options.cacheWithLimits(Options.DefaultMakeCacheSettings),
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
    ],
  }) as He4rtClient
  client.commands = new Collection()
  client.api = {
    he4rt: HE4RT,
    apoiase: APOIASE,
  }

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)

  await registerCommands({ client, rest })

  return { client, rest }
}
