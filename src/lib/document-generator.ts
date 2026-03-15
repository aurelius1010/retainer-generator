import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Document, Packer, Paragraph, TextRun } from 'docx'

interface RetainerData {
  id: string
  client: {
    name: string
    email: string
    companyName?: string | null
    address?: string | null
    phone?: string | null
  }
  template: {
    name: string
    content: string
  }
  retainerFee: number
  monthlyFee?: number | null
  expenses?: number | null
  terms: string
  length: string
  startDate: Date
  endDate?: Date | null
  customContent?: string | null
  notes?: string | null
  status: string
}

function replacePlaceholders(content: string, data: RetainerData): string {
  const placeholders = {
    '{{CLIENT_NAME}}': data.client.name,
    '{{CLIENT_EMAIL}}': data.client.email,
    '{{CLIENT_COMPANY}}': data.client.companyName || '',
    '{{CLIENT_ADDRESS}}': data.client.address || '',
    '{{CLIENT_PHONE}}': data.client.phone || '',
    '{{RETAINER_FEE}}': `$${data.retainerFee.toLocaleString()}`,
    '{{MONTHLY_FEE}}': data.monthlyFee ? `$${data.monthlyFee.toLocaleString()}` : 'N/A',
    '{{EXPENSES}}': data.expenses ? `$${data.expenses.toLocaleString()}` : 'N/A',
    '{{TERMS}}': data.terms,
    '{{LENGTH}}': data.length,
    '{{START_DATE}}': data.startDate.toLocaleDateString(),
    '{{END_DATE}}': data.endDate ? data.endDate.toLocaleDateString() : 'TBD',
    '{{CUSTOM_CONTENT}}': data.customContent || '',
    '{{CURRENT_DATE}}': new Date().toLocaleDateString(),
  }

  let processedContent = content
  Object.entries(placeholders).forEach(([placeholder, value]) => {
    processedContent = processedContent.replace(new RegExp(placeholder, 'g'), value)
  })

  return processedContent
}

export async function generatePDF(data: RetainerData): Promise<Buffer> {
  const doc = new jsPDF()
  const processedContent = replacePlaceholders(data.template.content, data)
  
  // Title
  doc.setFontSize(20)
  doc.text('Retainer Agreement', 20, 30)
  
  // Client Information
  doc.setFontSize(14)
  doc.text('Client Information:', 20, 50)
  doc.setFontSize(12)
  doc.text(`Name: ${data.client.name}`, 20, 60)
  doc.text(`Email: ${data.client.email}`, 20, 70)
  if (data.client.companyName) {
    doc.text(`Company: ${data.client.companyName}`, 20, 80)
  }
  
  // Financial Details
  doc.setFontSize(14)
  doc.text('Financial Details:', 20, 100)
  doc.setFontSize(12)
  doc.text(`Retainer Fee: $${data.retainerFee.toLocaleString()}`, 20, 110)
  if (data.monthlyFee) {
    doc.text(`Monthly Fee: $${data.monthlyFee.toLocaleString()}`, 20, 120)
  }
  
  // Terms
  doc.setFontSize(14)
  doc.text('Terms & Conditions:', 20, 140)
  doc.setFontSize(10)
  
  // Split content into lines that fit the page
  const splitContent = doc.splitTextToSize(processedContent, 170)
  doc.text(splitContent, 20, 150)
  
  return Buffer.from(doc.output('arraybuffer'))
}

export async function generateDOCX(data: RetainerData): Promise<Buffer> {
  const processedContent = replacePlaceholders(data.template.content, data)
  
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Retainer Agreement",
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: "" })], // Empty line
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Client Information",
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Name: ${data.client.name}` })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Email: ${data.client.email}` })],
          }),
          ...(data.client.companyName
            ? [
                new Paragraph({
                  children: [new TextRun({ text: `Company: ${data.client.companyName}` })],
                }),
              ]
            : []),
          new Paragraph({
            children: [new TextRun({ text: "" })], // Empty line
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Financial Details",
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Retainer Fee: $${data.retainerFee.toLocaleString()}` })],
          }),
          ...(data.monthlyFee
            ? [
                new Paragraph({
                  children: [new TextRun({ text: `Monthly Fee: $${data.monthlyFee.toLocaleString()}` })],
                }),
              ]
            : []),
          new Paragraph({
            children: [new TextRun({ text: "" })], // Empty line
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Terms & Conditions",
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: processedContent })],
          }),
        ],
      },
    ],
  })

  return await Packer.toBuffer(doc)
}