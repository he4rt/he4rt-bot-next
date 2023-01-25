import { He4rtClient } from '@/types'
import { verifyApoiaseMembers } from './apoiase'
import { verifyEventCode } from './event_coding'

export const cronEvents = async (client: He4rtClient) => {
  await verifyApoiaseMembers(client)
  // await verifyEventCode(client)
}
