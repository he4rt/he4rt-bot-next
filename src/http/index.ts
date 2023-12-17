import { createClient } from 'uncreate'
import { destr as JSON_PARSE } from 'destr'
import firebase_admin from '../../firebase_admin.json'
import firebase from 'firebase-admin'

export const HE4RT = createClient({
  parseResponse: JSON_PARSE,
  baseURL: `${process.env.HE4RT_URL}/api/`,
  headers: {
    'X-He4rt-Authorization': process.env.HE4RT_TOKEN,
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

const FIREBASE = firebase.initializeApp({
  // @ts-expect-error
  credential: firebase.credential.cert(firebase_admin),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
})

export const FIRESTORE = FIREBASE.firestore()

export const GIF = createClient({
  parseResponse: JSON_PARSE,
  baseURL: `${process.env.TENOR_URL}`,
})