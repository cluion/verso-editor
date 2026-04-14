import { Extension } from '@verso-editor/core'
import { InputRule } from 'prosemirror-inputrules'

export interface TypographyOptions {
  openDoubleQuote: string
  closeDoubleQuote: string
  openSingleQuote: string
  closeSingleQuote: string
  emDash: string
  ellipsis: string
  rightArrow: string
  leftArrow: string
  // Enable/disable toggles
  smartQuotes: boolean
  dashes: boolean
  ellipsisEnabled: boolean
  arrows: boolean
}

export const TypographyExtension = Extension.create<TypographyOptions>({
  name: 'typography',
  defaultOptions: {
    openDoubleQuote: '\u201C',
    closeDoubleQuote: '\u201D',
    openSingleQuote: '\u2018',
    closeSingleQuote: '\u2019',
    emDash: '\u2014',
    ellipsis: '\u2026',
    rightArrow: '\u2192',
    leftArrow: '\u2190',
    smartQuotes: true,
    dashes: true,
    ellipsisEnabled: true,
    arrows: true,
  },
  inputRules: [
    () => {
      const opts = TypographyExtension.options as TypographyOptions
      const rules: InputRule[] = []

      // Smart quotes: "text" → curly quotes
      if (opts.smartQuotes) {
        rules.push(
          new InputRule(/(?:^|\s)"([^"]*)"?$/, (state, match, start, end) => {
            const text = match[1]
            const prefix = match[0].startsWith(' ') ? ' ' : ''
            const from = start + prefix.length
            const replacement = `${prefix}${opts.openDoubleQuote}${text}${opts.closeDoubleQuote}`
            return state.tr.insertText(replacement, from, end)
          }),
        )
        // Single quotes
        rules.push(
          new InputRule(/(?:^|\s)'([^']*)'?$/, (state, match, start, end) => {
            const text = match[1]
            const prefix = match[0].startsWith(' ') ? ' ' : ''
            const from = start + prefix.length
            const replacement = `${prefix}${opts.openSingleQuote}${text}${opts.closeSingleQuote}`
            return state.tr.insertText(replacement, from, end)
          }),
        )
      }

      // Em dash: -- → —
      if (opts.dashes) {
        rules.push(
          new InputRule(/--$/, (state, _match, start, end) => {
            return state.tr.insertText(opts.emDash, start, end)
          }),
        )
      }

      // Ellipsis: ... → …
      if (opts.ellipsisEnabled) {
        rules.push(
          new InputRule(/\.\.\.$/, (state, _match, start, end) => {
            return state.tr.insertText(opts.ellipsis, start, end)
          }),
        )
      }

      // Arrows: --> → →, <-- → ←
      if (opts.arrows) {
        rules.push(
          new InputRule(/-->$/, (state, _match, start, end) => {
            return state.tr.insertText(opts.rightArrow, start, end)
          }),
        )
        rules.push(
          new InputRule(/<--$/, (state, _match, start, end) => {
            return state.tr.insertText(opts.leftArrow, start, end)
          }),
        )
      }

      return rules
    },
  ],
})
