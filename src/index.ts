import 'dotenv/config'
import { afterEvents } from './events/after'
import { cronEvents } from './events/cron'
import { discordEvents } from './events/discord'
import { runner } from './main'

runner()
  .then(async ({ client }) => {
    await discordEvents(client)
    await cronEvents(client)

    await client.login(process.env.DISCORD_TOKEN)

    await afterEvents(client)

    await client.ticker.start()
  })
  .catch(() => {})
  .finally(() => {})
