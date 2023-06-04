import { He4rtClient } from '@/types'
import { getGuild, getTargetMember, isApoiaseMember, js } from '@/utils'
import { EVENT_CODING } from '@/defines/ids.json'
import { CronJob } from 'cron'

export const verifyEventCode = async (client: He4rtClient) => {
  const guild = getGuild(client)

  await new CronJob('*/10 * * * * *', async () => {
    
  }).start()
}
