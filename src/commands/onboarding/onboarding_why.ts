import { SlashCommandBuilder } from 'discord.js'
import { Command } from '@/types'
import { ONBOARDING_WHY } from '@/defines/commands.json'

export const useOnboardingWhy = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(ONBOARDING_WHY.TITLE)
    .setDescription(ONBOARDING_WHY.DESCRIPTION)
    .setDMPermission(false)

  return [
    data,
    async (interaction, client) => {
      await interaction.reply({
        content:
          'O nosso sistema de **onboarding** serve como uma ajuda direcionada a novos membros no servidor e que desejam conhecer nossa iniciativa e participar mais ativamente dela. Para isso, temos os seguintes comandos à disposição:\n\n**/onboarding-requisitar**: Requisite uma ajuda especial aos nossos **voluntários**, alertando-os de que você deseja um *tour* por nosso servidor.\n\n**/onboarding-voluntariar**: Se torne um **voluntário** e receba novos membros na comunidade (sendo recompensado por isso).\n\n**/onboarding-finalizar**: Caso você seja um **voluntário** e tenha terminado uma ajuda, use este comando para receber pontos extras no servidor!\n\n**/onboarding-desistir**: Use este comando caso deseje não ser mais um **voluntário**.\n\n**ATENÇÃO: Este sistema funciona de forma assíncrona, ou seja, se você requisitar uma ajuda, não quer dizer que aparecerá alguém de imediato para a sua requisição!**',
        ephemeral: true,
      })
    },
  ]
}
