const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Force migrating ALL blogs to first user...')

    const firstUser = await prisma.user.findFirst()
    if (!firstUser) {
        console.log('No users found. Please register a superadmin first.')
        return
    }

    console.log(`Using user: ${firstUser.email} (ID: ${firstUser.id})`)

    const result = await prisma.blog.updateMany({
        data: { authorId: firstUser.id }
    })

    console.log(`Updated ${result.count} blogs.`)
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
