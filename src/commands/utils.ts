import { EmbedBuilder, HexColorString, User } from 'discord.js'
import { COLORS, HE4RT_ICON_1_URL } from '../defines/values.json'
import { EmbedTemplateOptions } from '../types'

export const getUserAvatar = (author: User) => {
  return `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png?size=256`
}

export const embedTemplate = (options: EmbedTemplateOptions) => {
  const embed = new EmbedBuilder().setColor(options.color || (COLORS.HE4RT as HexColorString)).setTitle(options.title)

  if (options.target?.icon) embed.setThumbnail(getUserAvatar(options.target.user))
  if (options.url) embed.setURL(options.url)
  if (options.author?.avatar) embed.setAuthor({ name: options.author.username, iconURL: getUserAvatar(options.author) })

  options.fields?.forEach((f) => {
    embed.addFields(...f)
  })

  if (options.footer === undefined || options.footer) {
    embed
      .setFooter({
        text: `${new Date().getFullYear()} © He4rt Developers`,
        iconURL: HE4RT_ICON_1_URL,
      })
      .setTimestamp()
  }

  return embed
}
