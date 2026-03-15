import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

const defaultTemplate = `
RETAINER AGREEMENT

This Retainer Agreement ("Agreement") is entered into on {{CURRENT_DATE}} between {{CLIENT_NAME}} ("Client") and [Your Company Name] ("Service Provider").

CLIENT INFORMATION:
Name: {{CLIENT_NAME}}
Email: {{CLIENT_EMAIL}}
Company: {{CLIENT_COMPANY}}
Address: {{CLIENT_ADDRESS}}
Phone: {{CLIENT_PHONE}}

RETAINER TERMS:
1. RETAINER FEE: Client agrees to pay a retainer fee of {{RETAINER_FEE}} upon signing this agreement.

2. MONTHLY FEE: Client agrees to pay a monthly fee of {{MONTHLY_FEE}} for ongoing services.

3. EXPENSES: Additional expenses may apply up to {{EXPENSES}}.

4. SCOPE OF WORK: {{TERMS}}

5. AGREEMENT LENGTH: This agreement is valid for {{LENGTH}}.

6. START DATE: Services will commence on {{START_DATE}}.

7. END DATE: This agreement will expire on {{END_DATE}} unless renewed.

{{CUSTOM_CONTENT}}

By signing below, both parties agree to the terms and conditions outlined in this retainer agreement.

Service Provider: _________________________ Date: _______

Client Signature: _________________________ Date: _______
Client Name: {{CLIENT_NAME}}

This agreement constitutes the entire understanding between the parties and supersedes all prior agreements relating to the subject matter herein.
`

async function main() {
  console.log('Seeding database...')

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (!existingAdmin) {
    // Create default admin user
    const adminPassword = await hashPassword('admin123')
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'ADMIN',
      },
    })

    // Create default template
    await prisma.template.create({
      data: {
        name: 'Standard Retainer Agreement',
        description: 'A comprehensive retainer agreement template with all standard terms and conditions.',
        content: defaultTemplate.trim(),
        isActive: true,
        userId: admin.id,
      },
    })

    // Create sample client
    const sampleClient = await prisma.client.create({
      data: {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '(555) 123-4567',
        address: '123 Main St, Anytown, ST 12345',
        companyName: 'Smith Enterprises',
        notes: 'Sample client for demonstration purposes',
        userId: admin.id,
      },
    })

    console.log('Created admin user:', admin.email)
    console.log('Created default template and sample client')
  } else {
    console.log('Admin user already exists, skipping seed')
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })