/**
 * Command Palette & AI Command Types
 * Defines the contract for all commands available in GyaanForge
 */

export type CommandCategory = 'general' | 'learning' | 'tools' | 'settings'

export interface CommandContext {
  input?: string
  selectedText?: string
  currentMode?: string
  currentIntent?: string
  onClose: () => void
  onResult?: (result: CommandResult) => void
}

export interface CommandResult {
  type: 'success' | 'error' | 'info'
  title: string
  content: string
  data?: any
}

export interface Command {
  id: string
  label: string
  description: string
  icon: string
  category: CommandCategory
  shortcut?: string
  /** If true, shows submenu with these commands */
  subcommands?: Command[]
  /** Handler function that executes the command (optional if has subcommands) */
  handler?: (context: CommandContext) => Promise<void> | void
  /** Shown in list if no handler result */
  details?: string
}

export interface CommandGroup {
  category: CommandCategory
  label: string
  commands: Command[]
}

export interface CommandPaletteState {
  isOpen: boolean
  searchQuery: string
  selectedIndex: number
  filteredCommands: Command[]
}
