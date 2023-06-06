import { He4rtClient } from '@/types'
import { verifyApoiaseMembers } from './apoiase'
import { everyQuizEvent } from './quiz'

export const cronEvents = async (client: He4rtClient) => {
  await verifyApoiaseMembers(client)
  await everyQuizEvent(client)
}
