import type { MarkSpec, NodeSpec } from 'prosemirror-model'

export interface ExtensionConfig<
  Options extends Record<string, unknown> = Record<string, unknown>,
> {
  name: string
  defaultOptions?: Options
  options?: Partial<Options>
  dependencies?: string[]
  plugins?: ExtensionPluginFactory[]
  keymap?: ExtensionKeymapFactory
  inputRules?: ExtensionInputRulesFactory
  commands?: ExtensionCommands
}

export interface NodeExtensionConfig<
  Options extends Record<string, unknown> = Record<string, unknown>,
> extends ExtensionConfig<Options> {
  nodeSpec: NodeSpec
}

export interface MarkExtensionConfig<
  Options extends Record<string, unknown> = Record<string, unknown>,
> extends ExtensionConfig<Options> {
  markSpec: MarkSpec
}

export type ExtensionPluginFactory = () => unknown
export type ExtensionKeymapFactory = () => Record<string, () => boolean>
export type ExtensionInputRulesFactory = () => unknown[]
export type ExtensionCommands = Record<string, (...args: unknown[]) => () => boolean>

export class Extension<Options extends Record<string, unknown> = Record<string, unknown>> {
  readonly name: string
  readonly options: Options
  readonly dependencies: string[]
  readonly plugins: ExtensionPluginFactory[]
  readonly keymap: ExtensionKeymapFactory | undefined
  readonly inputRules: ExtensionInputRulesFactory | undefined
  readonly commands: ExtensionCommands | undefined

  protected constructor(
    name: string,
    options: Options,
    dependencies: string[],
    plugins: ExtensionPluginFactory[],
    keymap: ExtensionKeymapFactory | undefined,
    inputRules: ExtensionInputRulesFactory | undefined,
    commands: ExtensionCommands | undefined,
  ) {
    this.name = name
    this.options = options
    this.dependencies = dependencies
    this.plugins = plugins
    this.keymap = keymap
    this.inputRules = inputRules
    this.commands = commands
  }

  static create<Options extends Record<string, unknown> = Record<string, unknown>>(
    config: ExtensionConfig<Options>,
  ): Extension<Options> {
    const defaults = config.defaultOptions ?? ({} as Options)
    const options = { ...defaults, ...config.options } as Options
    return new Extension(
      config.name,
      options,
      config.dependencies ?? [],
      config.plugins ?? [],
      config.keymap,
      config.inputRules,
      config.commands,
    )
  }

  configure(options: Partial<Options>): Extension<Options> {
    return new Extension(
      this.name,
      { ...this.options, ...options },
      this.dependencies,
      this.plugins,
      this.keymap,
      this.inputRules,
      this.commands,
    )
  }
}

export class NodeExtension<
  Options extends Record<string, unknown> = Record<string, unknown>,
> extends Extension<Options> {
  readonly nodeSpec: NodeSpec

  private constructor(base: Extension<Options>, nodeSpec: NodeSpec) {
    super(
      base.name,
      base.options,
      base.dependencies,
      base.plugins,
      base.keymap,
      base.inputRules,
      base.commands,
    )
    this.nodeSpec = nodeSpec
  }

  static create<Options extends Record<string, unknown> = Record<string, unknown>>(
    config: NodeExtensionConfig<Options>,
  ): NodeExtension<Options> {
    const base = Extension.create(config)
    return new NodeExtension(base, config.nodeSpec)
  }

  override configure(options: Partial<Options>): NodeExtension<Options> {
    const base = super.configure(options)
    return new NodeExtension(base, this.nodeSpec)
  }
}

export class MarkExtension<
  Options extends Record<string, unknown> = Record<string, unknown>,
> extends Extension<Options> {
  readonly markSpec: MarkSpec

  private constructor(base: Extension<Options>, markSpec: MarkSpec) {
    super(
      base.name,
      base.options,
      base.dependencies,
      base.plugins,
      base.keymap,
      base.inputRules,
      base.commands,
    )
    this.markSpec = markSpec
  }

  static create<Options extends Record<string, unknown> = Record<string, unknown>>(
    config: MarkExtensionConfig<Options>,
  ): MarkExtension<Options> {
    const base = Extension.create(config)
    return new MarkExtension(base, config.markSpec)
  }

  override configure(options: Partial<Options>): MarkExtension<Options> {
    const base = super.configure(options)
    return new MarkExtension(base, this.markSpec)
  }
}
