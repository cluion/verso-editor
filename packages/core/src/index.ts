export { Editor } from './editor'
export { EventEmitter } from './event-emitter'
export {
  Extension,
  MarkExtension,
  NodeExtension,
  type ExtensionConfig,
  type NodeExtensionConfig,
  type MarkExtensionConfig,
  type NodeViewFactory,
} from './extension'
export {
  createToggleMark,
  createSetBlockType,
  createToggleBlockType,
  createWrapIn,
  createLift,
  isMarkActive,
  isNodeActive,
} from './command-manager'
export { createInputRulesPlugin, inputRulesPluginKey } from './input-rules'
export { createKeymapPlugins } from './keymap'
export { sortExtensions } from './plugin-manager'
export { defaultSchema, defaultNodeSpecs, defaultMarkSpecs } from './schema'
export { resolveSchema } from './schema-resolver'
export { sanitizeHTML, type SanitizeOptions } from './sanitize'
export { setLocale, getLocale, t } from './locale'
export { I18n, type LocaleDictionary } from './i18n'
export { ThemeManager, type ThemeName } from './theme'
export {
  createSnapshot,
  compareSnapshots,
  RevisionHistory,
  type RevisionSnapshot,
} from './revision'
