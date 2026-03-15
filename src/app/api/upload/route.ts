import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import mammoth from 'mammoth'
import { readFileSync } from 'fs'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

async function extractTextFromFile(filePath: string, mimeType: string): Promise<string | null> {
  try {
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const buffer = readFileSync(filePath)
      const result = await mammoth.extractRawText({ buffer })
      return result.value
    }
    // For PDF and DOC files, we'd need additional libraries
    // For now, return null and implement later
    return null
  } catch (error) {
    console.error('Text extraction error:', error)
    return null
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

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const documentType = formData.get('documentType') as string || 'OTHER'
    const isTemplate = formData.get('isTemplate') === 'true'

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const uploadedFiles = []

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Maximum size is 10MB.` },
          { status: 400 }
        )
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File ${file.name} has an unsupported type. Only PDF, DOC, and DOCX files are allowed.` },
          { status: 400 }
        )
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate unique filename
      const timestamp = Date.now()
      const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filePath = join(uploadsDir, filename)

      // Save file
      await writeFile(filePath, buffer)

      // Extract text if possible
      const extractedText = await extractTextFromFile(filePath, file.type)

      // Save to database
      const uploadedDoc = await db.uploadedDocument.create({
        data: {
          filename,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          path: filePath,
          extractedText,
          documentType,
          isTemplate,
        },
      })

      uploadedFiles.push(uploadedDoc)
    }

    return NextResponse.json({
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
      files: uploadedFiles,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}