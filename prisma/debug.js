const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const blogs = await prisma.blog.findMany({ take: 10 })
    console.log('Sample blogs:')
    blogs.forEach(b => console.log(`- ${b.title}: authorId=${b.authorId}`))
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
