import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js'
import { Command, CommandSet, He4rtClient } from '@/types'
import { JUDGE } from '@/defines/commands.json'
import { MEMBER_OPTION, TYPE_OPTION, REASON_OPTION } from '-/commands/judge.json'
import { CALLED_CHANNEL } from '@/defines/ids.json'
import { DISCORD_MESSAGE_LIMIT, CLIENT_NAME } from '@/defines/values.json'
import { embedTemplate, getChannel, getOption, getTargetMember, reply, sendMessageToChannel } from '@/utils'
import { getUser, upsertUser } from '@/http/firebase'

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
        .addChoices({ name: '✅ Elogio', value: 0 }, { name: '❌ Oportunidade de Melhoria', value: 1 }),
    )
    .addStringOption((option) => option.setName('motivo').setDescription(REASON_OPTION).setRequired(true)) as CommandSet

  return [
    data,
    async (interaction, client) => {
      const targetOption = getOption(interaction, 'membro')
      const target = targetOption.user
      const { value } = interaction.options.get('tipo')
      const reason = interaction.options.get('motivo')

      const getType = () => {
        return {
          0: '✅ Elogio',
          1: '❌ Oportunidade de Melhoria',
        }[value as number]
      }

      if ((reason.value as string).length >= DISCORD_MESSAGE_LIMIT) {
        await interaction.reply({
          content: `O seu texto de motivo ultrapassa o limite do discord (${DISCORD_MESSAGE_LIMIT} caracteres) e por isso foi desconsiderado! Opte por enviar feedback's separados!`,
          ephemeral: true,
        })

        return
      }

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
            { name: '**Tipo**', value: String(value), inline: false },
            { name: '**ID do Alvo**', value: target.id, inline: false },
            { name: '**ID do Autor**', value: interaction.user.id, inline: false },
          ],
        ],
      })

      const component = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(new ButtonBuilder().setCustomId('c-judge-deny').setLabel('Negar').setStyle(ButtonStyle.Danger))
        .addComponents(
          new ButtonBuilder().setCustomId('c-judge-accept').setLabel('Aceitar').setStyle(ButtonStyle.Success),
        )

      const calledChannel = getChannel({ id: CALLED_CHANNEL.id, client })

      await sendMessageToChannel(calledChannel, { embeds: [embed], components: [component] })

      client.logger.emit({
        type: 'command',
        color: 'success',
        message: `Novo feedback criado com sucesso!`,
      })

      await reply(interaction).success()
    },
  ]
}

export const resolveJudgeCommandButtonEvents = async (client: He4rtClient, interaction: ButtonInteraction) => {
  if (interaction.customId.startsWith('c-judge')) {
    const type = interaction.message.embeds[0].data.fields[0].value
    const target_id = interaction.message.embeds[0].data.fields[1].value
    const author_id = interaction.message.embeds[0].data.fields[2].value

    const title = interaction.message.embeds[0].data.title
    const description = interaction.message.embeds[0].data.description

    if (interaction.customId === 'c-judge-accept') {
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
          sendMessageToChannel(dm, {
            content: `Você recebeu um feedback de um usuário pertencente ao servidor **${CLIENT_NAME}!**`,
            embeds: [embed],
          })
            .then(async () => {
              client.logger.emit({
                type: 'ticket',
                color: 'success',
                message: `O feedback para ${getTargetMember(
                  target,
                )} de título ${title} e de descrição **${description}** foi criado por ${getTargetMember(
                  author,
                )}, aceito por ${getTargetMember(interaction.member as GuildMember)} e enviado para ${getTargetMember(
                  target,
                )}!`,
                customChannelId: CALLED_CHANNEL.id,
              })

              const user = await getUser(client, { id: target.id })

              const reputation =
                type == '0' ? (user.reputation ? ++user.reputation : 1) : user.reputation ? --user.reputation : -1

              upsertUser(client, { id: target.id, reputation })
                .then(async () => {
                  await interaction.message.delete().catch(() => {})

                  await reply(interaction).success()
                })
                .catch(async () => {
                  await reply(interaction).error()
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
        .catch(async () => {
          client.logger.emit({
            type: 'ticket',
            color: 'error',
            message: `Não foi possível acessar a **DM** do usuário **${target_id}**!`,
          })

          await reply(interaction).errorInAccessDM()
        })
    }

    if (interaction.customId === 'c-judge-deny') {
      const members = await interaction.guild.members.fetch()

      const target = members.get(target_id)

      client.logger.emit({
        type: 'ticket',
        color: 'warning',
        message: `O feedback para ${getTargetMember(
          target,
        )} de título ${title} e de descrição **${description}** foi recusado por ${getTargetMember(
          interaction.member as GuildMember,
        )}!`,
        customChannelId: CALLED_CHANNEL.id,
      })

      await interaction.message.delete().catch(() => {})

      await reply(interaction).success()
    }
  }
}
