import 'dotenv/config'
import { setPresence } from './events/after'
import { runner } from './main'

runner()
  .then(async ({ client }) => {
    await client.login(process.env.DISCORD_TOKEN)

    setPresence(client)
  })
  .catch(() => {})
  .finally(() => {})
