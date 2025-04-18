import { createClient } from 'uncreate'
import { destr as JSON_PARSE } from 'destr'
import firebase from 'firebase-admin'
import path from 'path'
import fs from 'fs/promises'

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

export const createFirebaseClient = async (): Promise<firebase.firestore.Firestore> => {
  const FILE_PATH = path.resolve(__dirname, '..', '..', 'firebase_admin.json')
  const RAW_FILE = await fs.readFile(FILE_PATH, 'utf-8')
  const firebaseConfig = JSON.parse(RAW_FILE)

  return firebase
    .initializeApp({
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      credential: firebase.credential.cert(firebaseConfig),
    })
    .firestore()
}
