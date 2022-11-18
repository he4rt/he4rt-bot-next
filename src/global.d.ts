declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string
      DISCORD_CLIENT_ID: string
      DISCORD_GUILD_ID: string

      HE4RT_TOKEN: string
      API_KEY: string
      API_URL: `http${string}`
    }
  }
}

export {}
