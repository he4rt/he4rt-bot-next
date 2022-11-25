import { He4rtClient } from '@/types'
import { verifyApoiaseMembers } from './role'

export const cronEvents = async (client: He4rtClient) => {
  await verifyApoiaseMembers(client)
}
