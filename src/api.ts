import { createClient } from 'uncreate'
import JSON_PARSE from 'destr'

export const API = createClient({
  parseResponse: JSON_PARSE,
  baseURL: process.env.API_URL,
  headers: {
    Authorization: process.env.HE4RT_TOKEN,
  },
})
