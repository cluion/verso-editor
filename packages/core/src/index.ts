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
