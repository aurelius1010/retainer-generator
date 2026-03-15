import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const user = await getCurrentUser(token)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const retainers = await db.retainer.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { name: true, email: true, companyName: true } },
        template: { select: { name: true } },
      },
    })

    return NextResponse.json(retainers)
  } catch (error) {
    console.error('Get retainers error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const user = await getCurrentUser(token)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const {
      clientId,
      templateId,
      retainerFee,
      monthlyFee,
      expenses,
      terms,
      length,
      startDate,
      endDate,
      customContent,
      notes,
      status = 'DRAFT',
    } = await request.json()

    if (!clientId || !templateId || !retainerFee || !terms || !length || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify client belongs to user
    const client = await db.client.findFirst({
      where: { id: clientId, userId: user.id },
    })
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    // Verify template belongs to user
    const template = await db.template.findFirst({
      where: { id: templateId, userId: user.id },
    })
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    const retainer = await db.retainer.create({
      data: {
        clientId,
        templateId,
        retainerFee,
        monthlyFee,
        expenses,
        terms,
        length,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        customContent,
        notes,
        status,
        userId: user.id,
      },
      include: {
        client: { select: { name: true, email: true, companyName: true } },
        template: { select: { name: true, content: true } },
      },
    })

    return NextResponse.json(retainer)
  } catch (error) {
    console.error('Create retainer error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}