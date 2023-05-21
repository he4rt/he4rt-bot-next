import { FirestoreUser, He4rtClient } from '@/types'

export const upsertUser = (client: He4rtClient, fields: Partial<FirestoreUser>) => {
  const collection = client.firestore.collection('users')

  return collection.doc(fields.id).set(fields)
}

export const deleteUser = async (client: He4rtClient, fields: Pick<FirestoreUser, 'id'>) => {
  const collection = client.firestore.collection('users')

  collection
    .doc(fields.id)
    .delete()
    .catch(() => {})
}

export const createUser = async (client: He4rtClient, fields: Pick<FirestoreUser, 'id'>) => {
  const collection = client.firestore.collection('users')

  return collection.doc(fields.id).create({ id: fields.id })
}

export const getUser = async (client: He4rtClient, fields: Pick<FirestoreUser, 'id'>) => {
  const collection = client.firestore.collection('users')

  const target = await collection.where('id', '==', fields.id).get()
  const user = target.docs[0]

  if (!user) return Promise.reject()

  return user.data() as FirestoreUser
}

export const insertWatchedUser = (
  client: He4rtClient,
  fields: Pick<FirestoreUser, 'id'> & { author_id: string; reason: string }
) => {
  const collection = client.firestore.collection('watched')

  return collection.doc(fields.id).create(fields)
}

export const removeWatchedUser = (client: He4rtClient, fields: Pick<FirestoreUser, 'id'>) => {
  const collection = client.firestore.collection('watched')

  return collection.doc(fields.id).delete()
}

export const getWatchedUsers = async (client: He4rtClient) => {
  const collection = client.firestore.collection('watched')

  const list = await collection.get()

  if (!list) return Promise.reject()

  return list.docs.reduce((arr, item) => [...arr, { ...item.data() }], [])
}
