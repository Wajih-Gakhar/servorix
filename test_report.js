const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const c = await prisma.user.findFirst({ where: { role: 'CUSTOMER' }});
    const b = await prisma.business.findFirst();
    const a = await prisma.user.findFirst({ where: { role: 'ADMIN' }});
    console.log('Customer:', c?.id);
    console.log('Business:', b?.id);
    console.log('Admin:', a?.id);

    if (c && b && a) {
        try {
            const conversation = await prisma.conversation.create({
                data: {
                    type: 'REPORT',
                    businessId: b.id,
                    reportReason: "Fake reason",
                    reportDesc: "Testing from script",
                    reportStatus: 'OPEN',
                    isSystem: true,
                    participants: {
                        create: [
                            { userId: c.id },
                            { userId: a.id }
                        ]
                    }
                }
            });
            console.log("Conversation created:", conversation.id);
        } catch (e) {
            console.error("Failed to create conversation:", e.message);
        }
    }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
