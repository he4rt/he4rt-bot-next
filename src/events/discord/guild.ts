import { He4rtClient } from '@/types'

export const deletePossibleUserInServerLeave = (client: He4rtClient, id: string) => {
  client.api.he4rt
    .users(id)
    .delete()
    .then(() => {})
    .catch(() => {})
}
