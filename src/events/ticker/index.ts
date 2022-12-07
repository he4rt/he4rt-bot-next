import { He4rtClient } from '@/types'
import { setPomodoro } from './pomodoro'
import { setPresence } from './presence'

export const tickerEvents = async (client: He4rtClient) => {
  await setPomodoro(client)
  await setPresence(client)

  await client.ticker.start()
}
