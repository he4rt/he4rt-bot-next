import { He4rtClient } from '@/types'
import { verifyApoiaseMembers } from './apoiase'
import { verifyQuizEvent } from './quiz'

export const cronEvents = async (client: He4rtClient) => {
  await verifyApoiaseMembers(client)
  await verifyQuizEvent(client)
}
