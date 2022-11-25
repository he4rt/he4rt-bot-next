import { ApoiaseGET, He4rtClient, UserGET, UserPUT } from '@/types'
import { getGuild, isApoiaseMember, isNitroBoosterMember, js } from '@/utils'
import { APOIASE_CUSTOM_COLOR_MINIMAL_VALUE } from '@/defines/values.json'
import { DONATOR_ROLE } from '@/defines/ids.json'
import { CronJob } from 'cron'

export const cronEvents = async (client: He4rtClient) => {
  await verifyApoiaseMembers(client)
}

export const verifyApoiaseMembers = async (client: He4rtClient) => {
  const guild = getGuild(client)

  await new CronJob('00 00 12 10 * *', () => {
    guild.members
      .fetch()
      .then((members) => {
        const normalize = members.filter((t) => isApoiaseMember(t) && !isNitroBoosterMember(t))

        for (const [_, member] of normalize) {
          // apoia.se requests by second limit
          js()
            .sleep(1000)
            .then(() => {
              client.api.he4rt
                .users(member.id)
                .get<UserGET>()
                .then(({ email }) => {
                  client.api.apoiase.backers
                    .charges(email)
                    .get<ApoiaseGET>()
                    .then(({ isBacker, isPaidThisMonth, thisMonthPaidValue }) => {
                      if (
                        isBacker &&
                        isPaidThisMonth &&
                        thisMonthPaidValue &&
                        thisMonthPaidValue >= APOIASE_CUSTOM_COLOR_MINIMAL_VALUE
                      ) {
                        return
                      }

                      client.api.he4rt
                        .users(member.id)
                        .put<UserPUT>({
                          is_donator: 0,
                        })
                        .then(async () => {
                          await member.roles.remove(DONATOR_ROLE.id).catch(() => {})
                        })
                        .catch(() => {})
                    })
                    .catch(() => {})
                })
                .catch(() => {})
            })
        }
      })
      .catch(() => {})
  }).start()
}
