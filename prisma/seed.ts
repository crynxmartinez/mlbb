import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'el@mlbb.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'el123'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin',
    },
  })

  console.log(`✅ Admin created: ${admin.email}`)

  // Create default tournament
  const tournament = await prisma.tournament.upsert({
    where: { id: 'default-tournament' },
    update: {},
    create: {
      id: 'default-tournament',
      name: 'Season 40 Hero Tournament',
      status: 'active',
      startDate: new Date(),
      minGamesRequired: 20,
      maxGamesCounted: 50,
      baseWinPoints: 15,
      baseLossPoints: -10,
      kdaBonusMax: 10,
      mvpBonus: 5,
      autoUpdateEnabled: true,
      updateFrequency: 30,
    },
  })

  console.log(`✅ Tournament created: ${tournament.name}`)

  // Add some popular heroes
  const popularHeroes = [
    { heroId: 101, heroName: 'Miya' },
    { heroId: 102, heroName: 'Layla' },
    { heroId: 103, heroName: 'Balmond' },
    { heroId: 104, heroName: 'Fanny' },
    { heroId: 105, heroName: 'Gusion' },
    { heroId: 106, heroName: 'Ling' },
    { heroId: 107, heroName: 'Lancelot' },
    { heroId: 108, heroName: 'Granger' },
  ]

  for (const hero of popularHeroes) {
    await prisma.enabledHero.upsert({
      where: {
        tournamentId_heroId: {
          tournamentId: tournament.id,
          heroId: hero.heroId,
        },
      },
      update: {},
      create: {
        tournamentId: tournament.id,
        heroId: hero.heroId,
        heroName: hero.heroName,
        enabled: true,
      },
    })
  }

  console.log(`✅ ${popularHeroes.length} heroes enabled`)

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
