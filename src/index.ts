import 'dotenv/config'
import { cronEvents } from './events/cron'
import { discordEvents } from './events/discord'
import { tickerEvents } from './events/ticker'
import { runner } from './main'
import { getBotVersion } from './utils'

runner()
  .then(async ({ client }) => {
    await client.login(process.env.DISCORD_TOKEN)

    await discordEvents(client)
    await cronEvents(client)
    await tickerEvents(client)

    client.logger.emit({
      type: 'bot',
      color: 'info',
      message: `**BOT ON! ${getBotVersion()}**`,
    })
  })
  .catch(() => {})
  .finally(() => {})
