import { describe, expect, it } from 'vitest'
import { PdfExportExtension, type PdfExportOptions } from '../index'

describe('PdfExportExtension', () => {
  it('creates extension with correct name', () => {
    expect(PdfExportExtension.name).toBe('pdfExport')
  })

  it('has exportPDF command', () => {
    expect(PdfExportExtension.commands).toBeDefined()
    expect(PdfExportExtension.commands?.exportPDF).toBeDefined()
  })

  it('exportPDF command returns true', () => {
    const cmd = PdfExportExtension.commands?.exportPDF()
    const result = cmd?.()
    expect(result).toBe(true)
  })

  it('accepts all option types', () => {
    const options: PdfExportOptions = {
      filename: 'test.pdf',
      pageSize: 'a4',
      orientation: 'landscape',
      margin: { top: 20, bottom: 20, left: 15, right: 15 },
      header: 'Document Title',
      footer: 'Page {page} of {total}',
      imageQuality: 0.95,
      onProgress: () => {},
      onComplete: () => {},
      onError: () => {},
    }
    const cmd = PdfExportExtension.commands?.exportPDF(options)
    expect(cmd).toBeDefined()
  })
})
