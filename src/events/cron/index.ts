import { He4rtClient } from '@/types'
import { verifyApoiaseMembers } from './apoiase'
import { manageBreakfast } from './breakfast'

export const cronEvents = async (client: He4rtClient) => {
  await verifyApoiaseMembers(client)
  await manageBreakfast(client)
}
