import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js'
import { Command, FeedbackCreatePOST, FeedbackReviewPOST, He4rtClient } from '@/types'
import { JUDGE } from '@/defines/commands.json'
import { MEMBER_OPTION, TYPE_OPTION, REASON_OPTION } from '-/commands/judge.json'
import { CALLED_CHANNEL } from '@/defines/ids.json'
import { DISCORD_MESSAGE_LIMIT, CLIENT_NAME } from '@/defines/values.json'
import { embedTemplate, getChannel, getTargetMember, reply } from '@/utils'

export const useJudge = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(JUDGE.TITLE)
    .setDescription(JUDGE.DESCRIPTION)
    .setDMPermission(false)
    .addUserOption((option) => option.setName('membro').setDescription(MEMBER_OPTION).setRequired(true))
    .addIntegerOption((option) =>
      option
        .setName('tipo')
        .setDescription(TYPE_OPTION)
        .setRequired(true)
        .addChoices({ name: '✅ Elogio', value: 0 }, { name: '❌ Crítica', value: 1 })
    )
    .addStringOption((option) => option.setName('motivo').setDescription(REASON_OPTION).setRequired(true))

  return [
    data,
    async (interaction, client) => {
      const target = interaction.options.getUser('membro')
      const { value } = interaction.options.get('tipo')
      const reason = interaction.options.get('motivo')

      const getType = () => {
        return {
          0: '✅ Elogio',
          1: '❌ Crítica',
        }[value as number]
      }

      if ((reason.value as string).length >= DISCORD_MESSAGE_LIMIT) {
        await interaction.reply({
          content: `O seu texto de motivo ultrapassa o limite do discord (${DISCORD_MESSAGE_LIMIT} caracteres) e por isso foi desconsiderado! Opte por enviar ticket's separados!`,
          ephemeral: true,
        })

        return
      }

      client.api.he4rt.feedback
        .post<FeedbackCreatePOST>({
          sender_id: interaction.user.id,
          target_id: target.id,
          message: reason.value as string,
          type: getType(),
        })
        .then(async ({ id }) => {
          const embed = embedTemplate({
            title: `**Avaliar** » ${getType()}`,
            description: reason.value as string,
            author: interaction.user,
            target: {
              user: target,
              icon: true,
            },
            fields: [
              [
                { name: '**ID do Ticket**', value: String(id), inline: false },
                { name: '**ID do Alvo**', value: target.id, inline: false },
                { name: '**ID do Autor**', value: interaction.user.id, inline: false },
              ],
            ],
          })

          const component = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
              new ButtonBuilder().setCustomId('c-judge-deny').setLabel('Negar').setStyle(ButtonStyle.Danger)
            )
            .addComponents(
              new ButtonBuilder().setCustomId('c-judge-accept').setLabel('Aceitar').setStyle(ButtonStyle.Success)
            )

          const calledChannel = getChannel({ id: CALLED_CHANNEL.id, client })

          await calledChannel.send({ embeds: [embed], components: [component] })

          client.logger.emit({
            type: 'command',
            color: 'success',
            message: `Feedback **${id}** foi criado com sucesso!`,
          })

          await reply(interaction).success()
        })
        .catch(async () => {
          client.logger.emit({
            type: 'command',
            color: 'error',
            message: `Um pedido de feedback enviado por **${interaction.user.id}** não foi enviado!`,
          })

          await reply(interaction).error()
        })
    },
  ]
}

export const resolveJudgeCommandButtonEvents = async (client: He4rtClient, interaction: ButtonInteraction) => {
  if (interaction.customId.startsWith('c-judge')) {
    const feedback_id = interaction.message.embeds[0].data.fields[0].value
    const target_id = interaction.message.embeds[0].data.fields[1].value
    const author_id = interaction.message.embeds[0].data.fields[2].value

    const title = interaction.message.embeds[0].data.title
    const description = interaction.message.embeds[0].data.description

    if (interaction.customId === 'c-judge-accept') {
      client.api.he4rt.feedback
        .review(feedback_id)
        .approve.post<FeedbackReviewPOST>({
          staff_id: interaction.user.id,
        })
        .then(async () => {
          const members = await interaction.guild.members.fetch()

          const target = members.get(target_id)
          const author = members.get(author_id)

          target
            .createDM()
            .then((dm) => {
              const embed = embedTemplate({
                title,
                description,
              })

              dm.send({
                content: `Você recebeu um ticket de um usuário pertencente ao servidor **${CLIENT_NAME}!**`,
                embeds: [embed],
              })
                .then(async () => {
                  client.logger.emit({
                    type: 'ticket',
                    color: 'success',
                    message: `O ticket de título ${title} e de descrição **${description}** foi enviado por ${getTargetMember(
                      author
                    )}, aceito por ${getTargetMember(
                      interaction.member as GuildMember
                    )} e enviado para ${getTargetMember(target)}!`,
                    customChannelId: CALLED_CHANNEL.id
                  })

                  await interaction.message.delete().catch(() => { })

                  await reply(interaction).success()
                })
                .catch(async () => {
                  client.logger.emit({
                    type: 'ticket',
                    color: 'error',
                    message: `Não foi possível acessar a **DM** do usuário **${target_id}**!`,
                  })

                  await reply(interaction).errorInAccessDM()
                })
            })
            .catch(async () => {
              client.logger.emit({
                type: 'ticket',
                color: 'error',
                message: `Não foi possível acessar a **DM** do usuário **${target_id}**!`,
              })

              await reply(interaction).errorInAccessDM()
            })
        })
        .catch(() => { })
    }

    if (interaction.customId === 'c-judge-deny') {
      client.api.he4rt.feedback
        .review(feedback_id)
        .decline.post<FeedbackReviewPOST>({
          staff_id: interaction.user.id,
        })
        .then(async () => {
          client.logger.emit({
            type: 'ticket',
            color: 'warning',
            message: `O ticket de título ${title} e de descrição **${description}** foi recusado por ${getTargetMember(
              interaction.member as GuildMember
            )}!`,
            customChannelId: CALLED_CHANNEL.id
          })

          await interaction.message.delete().catch(() => { })

          await reply(interaction).success()
        })
        .catch(() => { })
    }
  }
}
