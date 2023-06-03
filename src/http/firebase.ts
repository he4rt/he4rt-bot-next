import { FirestoreMedal, FirestoreMedalUser, FirestoreUser, FirestoreReward, FirestoreEvent, FirestoreQuiz, He4rtClient } from '@/types'
import { defu } from 'defu'

export const upsertUser = async (client: He4rtClient, fields: Partial<FirestoreUser>) => {
  const collection = client.firestore.collection('users')

  const user = await getUser(client, { id: fields.id })
  const result = defu(fields, user)

  return collection.doc(fields.id).set(result)
}

export const deleteUser = async (client: He4rtClient, fields: Pick<FirestoreUser, 'id'>) => {
  const collection = client.firestore.collection('users')

  return collection.doc(fields.id).delete()
}

export const createUser = async (client: He4rtClient, fields: Pick<FirestoreUser, 'id'>) => {
  const collection = client.firestore.collection('users')
  
  return collection.doc(fields.id).create({ id: fields.id })
}

export const getUser = async (client: He4rtClient, fields: Pick<FirestoreUser, 'id'>) => {
  const collection = client.firestore.collection('users')
  const user = await collection.doc(fields.id).get()

  if (!user) {
    await upsertUser(client, { id: fields.id })

    return { id: fields.id } as FirestoreUser
  }

  return user.data() as FirestoreUser
}

export const getUsers = async (client: He4rtClient) => {
  const collection = client.firestore.collection('users')

  const users = await collection.get()

  return users.docs
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

export const getMedals = async (client: He4rtClient): Promise<FirestoreMedal[]> => {
  const collection = client.firestore.collection('medals')

  const target = await collection.get()
  const docs = await target.docs

  if (!target) return Promise.reject()

  return (docs.map((doc) => ({ ...doc.data() })) as FirestoreMedal[]) ?? []
}

export const getMedalsDocument = async (client: He4rtClient) => {
  const collection = client.firestore.collection('medals')

  const target = await collection.get()

  if (!target) return Promise.reject()

  return target.docs ?? []
}

export const getMedalDocument = async (client: He4rtClient, fields: Pick<FirestoreMedal, 'role_id'>) => {
  const collection = client.firestore.collection('medals')

  const target = await collection.where('role_id', '==', fields.role_id).get()
  const medal = target.docs[0]

  if (!medal) return Promise.reject()

  return medal
}

export const getMedal = async (
  client: He4rtClient,
  fields: Pick<FirestoreMedal, 'role_id'>
): Promise<FirestoreMedal> => {
  return new Promise((res, rej) => {
    getMedalDocument(client, fields)
      .then((medal) => {
        res(medal.data() as FirestoreMedal)
      })
      .catch(() => {
        rej()
      })
  })
}

export const hasMedal = async (client: He4rtClient, fields: Pick<FirestoreMedal & FirestoreUser, 'id' | 'role_id'>) => {
  try {
    const medal = await getMedalDocument(client, { role_id: fields.role_id })

    return await !!medal.ref.collection('users').doc(fields.id).get()
  } catch (e) {
    return false
  }
}

export const addUserInMedal = async (
  client: He4rtClient,
  fields: Pick<FirestoreMedal & FirestoreMedalUser, 'id' | 'role_id' | 'expires_at'>
) => {
  const medal = await getMedalDocument(client, { role_id: fields.role_id })

  const userCollection = medal.ref.collection('users')

  return userCollection.doc(fields.id).set({ id: fields.id, expires_at: fields.expires_at })
}

const addUserEvent = async (client: He4rtClient, {user, eventId}): Promise<void> => {
  const collection = client.firestore.collection('users_event')
  
  await collection.add({ id: user, event: eventId})
}

const updateEventReward = async (client: He4rtClient, reward: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>): Promise<void> => {
  const collection = client.firestore.collection('rewards')
  const entity = defu({earned: true}, reward.data() as FirestoreReward)
  
  collection.doc(reward.id).set(entity)
}

const getReward = async (client: He4rtClient, eventId: string, place?: string) => {
  const rewardsCollection = client.firestore.collection('rewards')

  const query = place === 'participant'
    ? await rewardsCollection.where('fk_event', '==', eventId).where('earned', '==', false).limit(1).get()
    : await rewardsCollection.where('fk_event', '==', eventId).where('place', '==', 'participant').limit(1).get()


  const reward = query.docs[0]
  return reward
}

export const claimEventReward = async (client: He4rtClient, eventId: string, memberId: string) => {
  const result = await getReward(client, eventId)

  const avaliableReward = result.data() as FirestoreReward

  const reward = avaliableReward.place === 'participant'
    ? await getReward(client, eventId, 'participant') : result
 
  await addUserEvent(client, { user: memberId, eventId })
  await updateEventReward(client, reward)
  return reward.data() as FirestoreReward
}