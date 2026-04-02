import { getPayload } from 'payload'
import config from '../src/payload.config'

async function deleteAllUsers() {
  const payload = await getPayload({ config })

  // Получаем всех пользователей
  const users = await payload.find({
    collection: 'users',
    limit: 1000,
  })

  console.log(`Found ${users.docs.length} users to delete`)

  // Удаляем каждого пользователя
  for (const user of users.docs) {
    await payload.delete({
      collection: 'users',
      id: user.id,
    })
    console.log(`Deleted user: ${user.email}`)
  }

  console.log('All users deleted!')
  process.exit(0)
}

deleteAllUsers().catch((error) => {
  console.error('Error deleting users:', error)
  process.exit(1)
})
