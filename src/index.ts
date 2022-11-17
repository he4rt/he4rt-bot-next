import 'dotenv/config'
import { runner } from './main'

runner()
  .then(({ client }) => {
    client.login(process.env.DISCORD_TOKEN)
  })
  .catch(() => {})
  .finally(() => {})
