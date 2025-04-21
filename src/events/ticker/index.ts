import { He4rtClient } from '@/types'
import { setDynamicVoice } from './dynamic_voice'
import { setPresence } from './presence'
import { setVoiceXP } from './voice_xp'
import { setMedalsExpires } from './medals'

export const tickerEvents = async (client: He4rtClient) => {
  await setPresence(client)
  await setVoiceXP(client)
  await setDynamicVoice(client)
  await setMedalsExpires(client)

  await client.ticker.start()
}
