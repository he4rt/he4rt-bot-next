import { He4rtClient } from '@/types'
import { verifyApoiaseMembers } from './apoiase'
import { verifyEventCode } from './quiz'

export const cronEvents = async (client: He4rtClient) => {
  await verifyApoiaseMembers(client)
  await verifyEventCode(client)
}
