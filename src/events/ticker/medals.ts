import { He4rtClient } from '@/types'
import { TickerName } from '@/types'
import { TICKER_SETTER, MEDALS_COUNTER_IN_MINUTES } from '@/defines/values.json'
import { getMedalsDocument } from '@/http/firebase'
import { getGuild } from '@/utils'

export const setMedalsExpires = async (client: He4rtClient) => {
  const guild = getGuild(client)

  const xpTimer = 60 * MEDALS_COUNTER_IN_MINUTES
  let xpCounterInSeconds = TICKER_SETTER

  client.ticker.add(TickerName.VoiceXP, async () => {
    --xpCounterInSeconds

    if (xpCounterInSeconds <= 0) {
      xpCounterInSeconds = xpTimer

      const currentTime = new Date().valueOf()

      getMedalsDocument(client)
        .then(async (documents) => {
          for (const document of documents) {
            const { role_id } = document.data()

            const usersCollection = document.ref.collection('users')
            const users = await usersCollection.get()

            for (const doc of users.docs) {
              const { expires_at, id } = doc.data()

              if (role_id && expires_at && id && currentTime >= Number(expires_at)) {
                const user = guild.members.cache.get(id)

                if (user) {
                  await user.roles.remove(role_id)
                  await doc.ref.delete()
                }
              }
            }
          }
        })
        .catch(() => {})
    }
  })
}
