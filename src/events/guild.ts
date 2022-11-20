import { He4rtClient } from '@/types'

export const deleteUserInServerLeave = (client: He4rtClient, id: string) => {
  client.api
    .users(id)
    .delete()
    .then(() => {})
    .catch(() => {})
}
