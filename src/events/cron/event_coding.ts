import { ApoiaseGET, He4rtClient, UserGET } from '@/types'
import { getGuild, getTargetMember, isApoiaseMember, js } from '@/utils'
import { APOIASE_CUSTOM_COLOR_MINIMAL_VALUE } from '@/defines/values.json'
import { EVENT_CODING } from '@/defines/ids.json'
import { CronJob } from 'cron'

export const verifyEventCode = async (client: He4rtClient) => {
  const guild = getGuild(client)

  await new CronJob('0 */1 * * *', async () => {
    console.log('trigger')
  }).start()
}
