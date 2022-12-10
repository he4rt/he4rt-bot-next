import { He4rtClient } from '@/types'
import { setPomodoro } from './pomodoro'
import { setPresence } from './presence'
import { setVoiceXP } from './xp'

export const tickerEvents = async (client: He4rtClient) => {
  await setPomodoro(client)
  await setPresence(client)
  await setVoiceXP(client)

  await client.ticker.start()
}
