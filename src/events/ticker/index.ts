import { He4rtClient } from '@/types'
import { setDynamicVoiceRemover } from './dynamic_voice'
import { setPomodoro } from './pomodoro'
import { setPresence } from './presence'
import { setVoiceXP } from './voice_xp'

export const tickerEvents = async (client: He4rtClient) => {
  await setPomodoro(client)
  await setPresence(client)
  await setVoiceXP(client)
  await setDynamicVoiceRemover(client)

  await client.ticker.start()
}
