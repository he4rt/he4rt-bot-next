import { He4rtClient } from '@/types'
import { setPomodoroListener } from './pomodoro'
import { setPresence } from './presence'

export const tickerEvents = async (client: He4rtClient) => {
  await setPomodoroListener(client)
  await setPresence(client)

  await client.ticker.start()
}
