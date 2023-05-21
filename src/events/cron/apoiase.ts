import { ApoiaseGET, He4rtClient, UserGET } from '@/types'
import { getGuild, getTargetMember, isApoiaseMember, js, openAndSendMessageInDm } from '@/utils'
import { APOIASE_CUSTOM_COLOR_MINIMAL_VALUE, CLIENT_NAME } from '@/defines/values.json'
import { DONATOR_ROLE } from '@/defines/ids.json'
import { CronJob } from 'cron'
import { getUser, upsertUser } from '@/http/firebase'
import { GuildMember } from 'discord.js'

const removeDonatorRole = async (member: GuildMember) => await member.roles.remove(DONATOR_ROLE.id).catch(() => {})

export const verifyApoiaseMembers = async (client: He4rtClient) => {
  const guild = getGuild(client)

  await new CronJob('00 00 12 10 * *', async () => {
    client.logger.emit({
      type: 'event',
      color: 'warning',
      message: '`CronJob 00 00 12 10 * *` **da verificação mensal do apoia.se executado!**',
    })

    const members = await guild.members.fetch()
    const supporters = members.filter((t) => isApoiaseMember(t))

    for (const [_, member] of supporters) {
      // apoia.se requests by second limit
      await js().sleep(2000)

      getUser(client, { id: member.id })
        .then(({ donator_email }) => {
          if (!donator_email) {
            removeDonatorRole(member)

            return
          }

          client.api.apoiase.backers
            .charges(donator_email)
            .get<ApoiaseGET>()
            .then(async ({ isBacker, isPaidThisMonth, thisMonthPaidValue }) => {
              if (
                isBacker &&
                isPaidThisMonth &&
                thisMonthPaidValue &&
                thisMonthPaidValue >= APOIASE_CUSTOM_COLOR_MINIMAL_VALUE
              ) {
                client.logger.emit({
                  type: 'apoiase',
                  color: 'success',
                  message: `${getTargetMember(
                    member
                  )} teve o seu **apoio renovado** com o email **${donator_email}** no valor de **${thisMonthPaidValue}** reais mensais!`,
                  user: member.user,
                })

                upsertUser(client, {
                  id: member.id,
                  donator_email,
                  donator_value: thisMonthPaidValue,
                }).catch(() => {
                  client.logger.emit({
                    type: 'apoiase',
                    color: 'error',
                    message: `Não foi possível atualizar o valor da doação mensal do usuário ${getTargetMember(
                      member
                    )}!`,
                    user: member.user,
                  })
                })

                return
              }

              await removeDonatorRole(member)

              await openAndSendMessageInDm(
                client,
                member,
                `O seu **apoia.se** no servidor **${CLIENT_NAME}** foi removido por não atender aos requisitos mínimos!\n\nCaso queira manter o seu apoio, acesse https://apoia.se/heartdevs e utilize o comando **/apoiase <email_do_apoiase>** dentro do servidor!`
              )

              client.logger.emit({
                type: 'apoiase',
                color: 'warning',
                message: `${getTargetMember(member)} teve o seu **apoio removido** por não atender aos requisitos!`,
                user: member.user,
              })
            })
            .catch(() => {
              removeDonatorRole(member)
            })
        })
        .catch(() => {
          removeDonatorRole(member)
        })
    }
  }).start()
}
