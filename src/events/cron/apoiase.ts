import { ApoiaseGET, He4rtClient, UserGET, UserPUT } from '@/types'
import { getGuild, getTargetMember, isApoiaseMember, isNitroBoosterMember, js } from '@/utils'
import { APOIASE_CUSTOM_COLOR_MINIMAL_VALUE } from '@/defines/values.json'
import { DONATOR_ROLE } from '@/defines/ids.json'
import { CronJob } from 'cron'

export const verifyApoiaseMembers = async (client: He4rtClient) => {
  const guild = getGuild(client)

  await new CronJob('00 00 12 10 * *', () => {
    client.logger.emit({
      type: 'event',
      color: 'warning',
      message: '`CronJob 00 00 12 10 * *` **da verificação mensal do apoia.se executado!**',
    })

    guild.members
      .fetch()
      .then(async (members) => {
        const normalize = members.filter((t) => isApoiaseMember(t) && !isNitroBoosterMember(t))

        for (const [_, member] of normalize) {
          // apoia.se requests by second limit
          await js().sleep(2000)

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

                      client.logger.emit({
                        type: 'apoiase',
                        color: 'warning',
                        message: `${getTargetMember(
                          member
                        )} teve o seu **apoio removido** por não atender aos requisitos!`,
                        user: member.user,
                      })
                    })
                    .catch(() => {})
                })
                .catch(() => {})
            })
            .catch(() => {})
        }
      })
      .catch(() => {})
  }).start()
}
