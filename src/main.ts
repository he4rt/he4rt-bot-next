import { Client, Collection, GatewayIntentBits, Options, REST } from 'discord.js'
import { Context, He4rtClient } from './types'
import { registerCommands } from './commands'
import { HE4RT, APOIASE } from './http'
import { Ticker } from './client/ticker'
import { Logger } from './client/logger'

export const runner = async (): Promise<Context> => {
  const client = new Client({
    makeCache: Options.cacheWithLimits(Options.DefaultMakeCacheSettings),
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
    ],
  }) as He4rtClient
  client.commands = new Collection()
  client.ticker = new Ticker()
  client.logger = new Logger(client)
  client.api = {
    he4rt: HE4RT,
    apoiase: APOIASE,
  }

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)

  await registerCommands({ client, rest })

  return { client, rest }
}
