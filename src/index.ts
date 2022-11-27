import 'dotenv/config'
import { registerLogger } from './client/logger'
import { cronEvents } from './events/cron'
import { discordEvents } from './events/discord'
import { tickerEvents } from './events/ticker'
import { runner } from './main'

runner()
  .then(async ({ client }) => {
    await discordEvents(client)
    await cronEvents(client)

    await client.login(process.env.DISCORD_TOKEN)

    await tickerEvents(client)
    await registerLogger(client)
  })
  .catch(() => {})
  .finally(() => {})
