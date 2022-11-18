import 'dotenv/config'
import { afterListeners } from './events/after'
import { beforeListeners } from './events/before'
import { runner } from './main'

runner()
  .then(async ({ client }) => {
    await beforeListeners(client)

    await client.login(process.env.DISCORD_TOKEN)

    await afterListeners(client)
  })
  .catch(() => {})
  .finally(() => {})
