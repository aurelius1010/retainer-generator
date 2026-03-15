import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { generatePDF, generateDOCX } from '@/lib/document-generator'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value
    const user = await getCurrentUser(token)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') as 'pdf' | 'docx'

    if (!format || !['pdf', 'docx'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Must be "pdf" or "docx"' },
        { status: 400 }
      )
    }

    const { id } = await params
    const retainer = await db.retainer.findFirst({
      where: { 
        id: id,
        userId: user.id 
      },
      include: {
        client: true,
        template: true,
      },
    })

    if (!retainer) {
      return NextResponse.json(
        { error: 'Retainer not found' },
        { status: 404 }
      )
    }

    let buffer: Buffer
    let mimeType: string
    let filename: string

    if (format === 'pdf') {
      buffer = await generatePDF(retainer)
      mimeType = 'application/pdf'
      filename = `retainer_${retainer.id}_${retainer.client.name.replace(/\s+/g, '_')}.pdf`
    } else {
      buffer = await generateDOCX(retainer)
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      filename = `retainer_${retainer.id}_${retainer.client.name.replace(/\s+/g, '_')}.docx`
    }

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Export retainer error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}