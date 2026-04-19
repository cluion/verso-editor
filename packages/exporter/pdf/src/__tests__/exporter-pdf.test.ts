import { describe, expect, it } from 'vitest'
import type { ExportPdfOptions } from '../index'

describe('@verso-editor/exporter-pdf', () => {
  it('ExportPdfOptions type accepts all fields', () => {
    const opts: ExportPdfOptions = {
      filename: 'test.pdf',
      margin: 15,
      imageQuality: 0.95,
      html2canvas: { scale: 3 },
      jsPDF: { orientation: 'landscape' },
    }
    expect(opts.filename).toBe('test.pdf')
    expect(opts.margin).toBe(15)
    expect(opts.imageQuality).toBe(0.95)
  })

  it('ExportPdfOptions allows partial options', () => {
    const opts: ExportPdfOptions = {}
    expect(opts.filename).toBeUndefined()
    expect(opts.margin).toBeUndefined()
  })

  it('exportPDF function is importable', async () => {
    const { exportPDF } = await import('../index')
    expect(typeof exportPDF).toBe('function')
  })
})
