import { He4rtClient } from '@/types'
import { verifyApoiaseMembers } from './apoiase'

export const cronEvents = async (client: He4rtClient) => {
  await verifyApoiaseMembers(client)
}
