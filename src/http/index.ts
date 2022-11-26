import { createClient } from 'uncreate'
import JSON_PARSE from 'destr'

export const HE4RT = createClient({
  parseResponse: JSON_PARSE,
  baseURL: process.env.HE4RT_URL,
  headers: {
    Authorization: process.env.HE4RT_TOKEN,
  },
})

export const APOIASE = createClient({
  parseResponse: JSON_PARSE,
  baseURL: process.env.APOIASE_URL,
  retry: 3,
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json',
    'x-api-key': process.env.APOIASE_TOKEN,
    authorization: `Bearer ${process.env.APOIASE_SECRET}`,
  },
})
