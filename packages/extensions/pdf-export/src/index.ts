import { Extension } from '@verso-editor/core'

export type PageSize = 'a4' | 'letter' | 'a3' | 'a5' | 'legal'
export type Orientation = 'portrait' | 'landscape'

export interface PdfExportOptions {
  filename?: string
  pageSize?: PageSize
  orientation?: Orientation
  margin?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
  header?: string
  footer?: string
  imageQuality?: number
  onProgress?: (percent: number) => void
  onComplete?: (blob: Blob) => void
  onError?: (error: Error) => void
}

// biome-ignore lint/suspicious/noExplicitAny: html2pdf.js has no type declarations
type Html2PdfWorker = any
// biome-ignore lint/suspicious/noExplicitAny: jsPDF accessed dynamically without types
type JspdfInstance = any

let html2pdfCache: Html2PdfWorker | null = null

async function loadHtml2Pdf(): Promise<Html2PdfWorker> {
  if (!html2pdfCache) {
    html2pdfCache = (await import('html2pdf.js')).default
  }
  return html2pdfCache
}

function buildPdfOptions(options: PdfExportOptions) {
  const margin = options.margin
  const marginValue = margin
    ? [margin.top ?? 10, margin.right ?? 10, margin.bottom ?? 10, margin.left ?? 10]
    : 10

  return {
    margin: marginValue as unknown as number,
    filename: options.filename ?? 'document.pdf',
    image: { type: 'jpeg', quality: options.imageQuality ?? 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: {
      unit: 'mm',
      format: options.pageSize ?? 'a4',
      orientation: options.orientation ?? 'portrait',
    },
  }
}

export const PdfExportExtension = Extension.create({
  name: 'pdfExport',
  commands: {
    exportPDF:
      (...args: unknown[]) =>
      () => {
        const options = (args[0] as PdfExportOptions | undefined) ?? {}

        const doExport = async () => {
          try {
            const html2pdf = await loadHtml2Pdf()
            options.onProgress?.(10)

            const element = document.querySelector('.ProseMirror')
            if (!element) {
              throw new Error('Editor element not found')
            }

            options.onProgress?.(30)

            const pdfOpts = buildPdfOptions(options)
            const worker = html2pdf().set(pdfOpts).from(element.cloneNode(true))

            if (options.header || options.footer) {
              worker
                .toPdf()
                .get('pdf')
                .then((pdf: JspdfInstance) => {
                  const pages = pdf.internal.getNumberOfPages()
                  for (let i = 1; i <= pages; i++) {
                    pdf.setPage(i)
                    const pageWidth = pdf.internal.pageSize.getWidth()
                    const pageHeight = pdf.internal.pageSize.getHeight()

                    if (options.header) {
                      pdf.setFontSize(10)
                      pdf.setTextColor(128, 128, 128)
                      pdf.text(options.header, pageWidth / 2, 8, { align: 'center' })
                    }

                    if (options.footer) {
                      const footerText = options.footer
                        .replace('{page}', String(i))
                        .replace('{total}', String(pages))
                      pdf.setFontSize(10)
                      pdf.setTextColor(128, 128, 128)
                      pdf.text(footerText, pageWidth / 2, pageHeight - 5, { align: 'center' })
                    }
                  }
                })
            }

            options.onProgress?.(60)

            await worker.save()
            options.onProgress?.(100)
          } catch (error) {
            options.onError?.(error instanceof Error ? error : new Error(String(error)))
          }
        }

        doExport()
        return true
      },
  },
})
