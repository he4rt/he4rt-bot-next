import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js'
import { Command, He4rtClient } from '@/types'
import { JUDGE } from '@/defines/commands.json'
import { MEMBER_OPTION, TYPE_OPTION, REASON_OPTION } from '-/commands/judge.json'
import { CALLED_CHANNEL } from '@/defines/ids.json'
import { CLIENT_NAME } from '@/defines/values.json'
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
        .addChoices(
          { name: '✅ Elogio', value: 0 },
          { name: '❕ Ponderação', value: 1 },
          { name: '❌ Crítica', value: 2 }
        )
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
          1: '❕ Ponderação',
          2: '❌ Crítica',
        }[value as number]
      }

      const embed = embedTemplate({
        title: `**He4rt Ticket** » ${getType()}`,
        description: reason.value as string,
        author: target,
        fields: [[{ name: '**ID**', value: target.id, inline: false }]],
      })

      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(new ButtonBuilder().setCustomId('c-judge-deny').setLabel('Negar').setStyle(ButtonStyle.Danger))
        .addComponents(
          new ButtonBuilder().setCustomId('c-judge-accept').setLabel('Aceitar').setStyle(ButtonStyle.Success)
        )

      const calledChannel = getChannel({ id: CALLED_CHANNEL.id, client })

      await calledChannel.send({ embeds: [embed], components: [row] })

      await reply(interaction).success()
    },
  ]
}

export const resolveJudgeCommandButtonEvents = async (client: He4rtClient, interaction: ButtonInteraction) => {
  if (interaction.customId.startsWith('c-judge')) {
    const id = interaction.message.embeds[0].data.fields[0].value
    const title = interaction.message.embeds[0].data.title
    const description = interaction.message.embeds[0].data.description

    if (interaction.customId === 'c-judge-accept') {
      const user = (await interaction.guild.members.fetch()).get(id)

      user
        .createDM()
        .then((dm) => {
          const embed = embedTemplate({
            title,
            description,
          })

          dm.send({
            content: `**Você recebeu um ticket de um usuário pertencente ao servidor **${CLIENT_NAME}!**`,
            embeds: [embed],
          })
            .then(async () => {
              client.logger.emit({
                type: 'ticket',
                color: 'success',
                message: `O ticket de título ${title} e de descrição **${description.substring(
                  0,
                  30
                )}** foi aceito por ${getTargetMember(
                  interaction.member as GuildMember
                )} e enviado para ${getTargetMember(user)}!`,
              })

              await interaction.message.delete().catch(() => {})

              await reply(interaction).success()
            })
            .catch(async () => {
              client.logger.emit({
                type: 'ticket',
                color: 'error',
                message: `Não foi possível acessar a **DM** do usuário **${id}**!`,
              })

              await reply(interaction).errorInAccessDM()
            })
        })
        .catch(async () => {
          client.logger.emit({
            type: 'ticket',
            color: 'error',
            message: `Não foi possível acessar a **DM** do usuário **${id}**!`,
          })

          await reply(interaction).errorInAccessDM()
        })
    }

    if (interaction.customId === 'c-judge-deny') {
      client.logger.emit({
        type: 'ticket',
        color: 'warning',
        message: `O ticket de título ${title} e de descrição **${description.substring(
          0,
          30
        )}** foi recusado por ${getTargetMember(interaction.member as GuildMember)}!`,
      })

      await interaction.message.delete().catch(() => {})

      await reply(interaction).success()
    }
  }
}
