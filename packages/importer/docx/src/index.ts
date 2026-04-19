import mammoth from 'mammoth'

export interface ImportDocxResult {
  html: string
  messages: string[]
}

export async function importDocx(file: File | ArrayBuffer): Promise<ImportDocxResult> {
  const arrayBuffer = file instanceof File ? await file.arrayBuffer() : file

  const result = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      convertImage: mammoth.images.imgElement((image) =>
        image.read('base64then').then((imageBuffer) => ({
          src: `data:${image.contentType};base64,${imageBuffer}`,
        })),
      ),
    },
  )

  return {
    html: result.value,
    messages: result.messages.map((m) => m.message),
  }
}
