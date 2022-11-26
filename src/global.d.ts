declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly DISCORD_TOKEN: string
      readonly DISCORD_CLIENT_ID: string
      readonly DISCORD_GUILD_ID: string

      readonly HE4RT_URL: `http${string}`
      readonly HE4RT_TOKEN: string

      readonly APOIASE_URL: `http${string}`
      readonly APOIASE_TOKEN: string
      readonly APOIASE_SECRET: string
    }
  }
}

export {}
