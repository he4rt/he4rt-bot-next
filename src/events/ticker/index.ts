import { He4rtClient } from '@/types'
import { setDynamicVoice } from './dynamic_voice'
import { setPomodoro } from './pomodoro'
import { setPresence } from './presence'
import { setVoiceXP } from './voice_xp'

export const tickerEvents = async (client: He4rtClient) => {
  await setPomodoro(client)
  await setPresence(client)
  await setVoiceXP(client)
  await setDynamicVoice(client)

  await client.ticker.start()
}
