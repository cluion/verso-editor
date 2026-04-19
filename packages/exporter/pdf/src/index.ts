export interface ExportPdfOptions {
  filename?: string
  margin?: number | string
  imageQuality?: number
  html2canvas?: Record<string, unknown>
  jsPDF?: Record<string, unknown>
}

export async function exportPDF(html: string, options: ExportPdfOptions = {}): Promise<void> {
  const html2pdf = (await import('html2pdf.js')).default

  const container = document.createElement('div')
  // HTML is from the editor's own getHTML() output — trusted content
  container.innerHTML = html // eslint-disable-line no-unsanitized/property
  container.style.padding = '20px'

  const opts = {
    margin: options.margin ?? 10,
    filename: options.filename ?? 'document.pdf',
    image: { type: 'jpeg', quality: options.imageQuality ?? 0.98 },
    html2canvas: { scale: 2, useCORS: true, ...options.html2canvas },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const, ...options.jsPDF },
  }

  await html2pdf().set(opts).from(container).save()
  container.remove()
}
