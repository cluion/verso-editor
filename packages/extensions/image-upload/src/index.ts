import { Plugin, PluginKey } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

export interface UploadOptions {
  upload: (file: File) => Promise<string>
  accept?: string[]
  maxSize?: number
  onError?: (error: Error) => void
}

const DEFAULT_ACCEPT = ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024 // 5MB
const uploadKey = new PluginKey('versoImageUpload')

function isAcceptedType(file: File, accept: string[]): boolean {
  return accept.includes(file.type)
}

function isWithinSizeLimit(file: File, maxSize: number): boolean {
  return file.size <= maxSize
}

function insertImage(view: EditorView, src: string): void {
  const schema = view.state.schema
  if (!schema.nodes.image) return

  const node = schema.nodes.image.create({ src })
  const tr = view.state.tr.replaceSelectionWith(node)
  view.dispatch(tr)
}

export function createImageUploadPlugin(options: UploadOptions): Plugin {
  const { upload, accept = DEFAULT_ACCEPT, maxSize = DEFAULT_MAX_SIZE, onError } = options

  return new Plugin({
    key: uploadKey,
    props: {
      handleDrop(view: EditorView, event: DragEvent) {
        if (!event.dataTransfer?.files.length) return false

        const files = Array.from(event.dataTransfer.files)
        handleFiles(view, files, upload, accept, maxSize, onError)
        return true
      },
      handlePaste(view: EditorView, event: ClipboardEvent) {
        if (!event.clipboardData?.files.length) return false

        const files = Array.from(event.clipboardData.files)
        const imageFiles = files.filter((f) => isAcceptedType(f, accept))
        if (imageFiles.length === 0) return false

        handleFiles(view, imageFiles, upload, accept, maxSize, onError)
        return true
      },
    },
  })
}

function handleFiles(
  view: EditorView,
  files: File[],
  upload: (file: File) => Promise<string>,
  accept: string[],
  maxSize: number,
  onError?: (error: Error) => void,
): void {
  for (const file of files) {
    if (!isAcceptedType(file, accept)) continue
    if (!isWithinSizeLimit(file, maxSize)) continue

    upload(file)
      .then((src) => {
        insertImage(view, src)
      })
      .catch((error: unknown) => {
        const err = error instanceof Error ? error : new Error(String(error))
        if (onError) {
          onError(err)
        } else {
          console.error(err)
        }
      })
  }
}
