import { He4rtClient } from '@/types'
import { verifyApoiaseMembers } from './apoiase'
import { sendDrinkWaterReminderInDynamicVoiceChannels } from './dynamic_voice'

export const cronEvents = async (client: He4rtClient) => {
  await verifyApoiaseMembers(client)
  await sendDrinkWaterReminderInDynamicVoiceChannels(client)
}
