/**
 * Command Registry & Handlers
 * Central definition of all commands available in the Command Palette
 */

import { Command, CommandContext, CommandGroup } from '@/types/commands'

/**
 * Perspective options
 */
const perspectiveCommands: Command[] = [
  {
    id: 'perspective-conceptual',
    label: 'Conceptual',
    description: 'Focus on ideas and understanding',
    icon: '💡',
    category: 'settings',
    handler: async (ctx) => {
      // Will be wired to actual perspective setter in Bundle 2
      console.log('[Command] Switch perspective to Conceptual')
      ctx.onClose?.()
    },
  },
  {
    id: 'perspective-implementation',
    label: 'Implementation',
    description: 'Focus on code and practical details',
    icon: '⚙️',
    category: 'settings',
    handler: async (ctx) => {
      console.log('[Command] Switch perspective to Implementation')
      ctx.onClose?.()
    },
  },
  {
    id: 'perspective-business',
    label: 'Business',
    description: 'Focus on impact and use cases',
    icon: '💼',
    category: 'settings',
    handler: async (ctx) => {
      console.log('[Command] Switch perspective to Business')
      ctx.onClose?.()
    },
  },
]

/**
 * Timebox options
 */
const timeboxCommands: Command[] = [
  {
    id: 'timebox-5m',
    label: '5 minutes',
    description: 'Quick explanation',
    icon: '⚡',
    category: 'settings',
    handler: async (ctx) => {
      console.log('[Command] Set timebox to 5 minutes')
      ctx.onClose?.()
    },
  },
  {
    id: 'timebox-10m',
    label: '10 minutes',
    description: 'Balanced explanation',
    icon: '⏱️',
    category: 'settings',
    handler: async (ctx) => {
      console.log('[Command] Set timebox to 10 minutes')
      ctx.onClose?.()
    },
  },
  {
    id: 'timebox-20m',
    label: '20 minutes',
    description: 'Deep dive',
    icon: '🔍',
    category: 'settings',
    handler: async (ctx) => {
      console.log('[Command] Set timebox to 20 minutes')
      ctx.onClose?.()
    },
  },
  {
    id: 'timebox-unlimited',
    label: 'Unlimited',
    description: 'No time constraints',
    icon: '∞',
    category: 'settings',
    handler: async (ctx) => {
      console.log('[Command] Set timebox to unlimited')
      ctx.onClose?.()
    },
  },
]

/**
 * Cognitive Load options
 */
const cognitiveLoadCommands: Command[] = [
  {
    id: 'load-overwhelmed',
    label: 'Overwhelmed',
    description: 'Simplest possible explanations',
    icon: '🌊',
    category: 'settings',
    handler: async (ctx) => {
      console.log('[Command] Set cognitive load to overwhelmed')
      ctx.onClose?.()
    },
  },
  {
    id: 'load-balanced',
    label: 'Balanced',
    description: 'Mix of clarity and depth',
    icon: '⚖️',
    category: 'settings',
    handler: async (ctx) => {
      console.log('[Command] Set cognitive load to balanced')
      ctx.onClose?.()
    },
  },
  {
    id: 'load-speed',
    label: 'Speed',
    description: 'Fast, efficient explanations',
    icon: '🚀',
    category: 'settings',
    handler: async (ctx) => {
      console.log('[Command] Set cognitive load to speed')
      ctx.onClose?.()
    },
  },
  {
    id: 'load-mastery',
    label: 'Mastery',
    description: 'Deep learning mode',
    icon: '🎓',
    category: 'settings',
    handler: async (ctx) => {
      console.log('[Command] Set cognitive load to mastery')
      ctx.onClose?.()
    },
  },
]

/**
 * Main commands registry
 */
export const commandRegistry: Command[] = [
  {
    id: 'explain-selection',
    label: 'Explain selection',
    description: 'Get AI explanation of selected code or text',
    icon: '📝',
    category: 'learning',
    handler: async (ctx) => {
      console.log('[Command] Explain selection', ctx.selectedText)
      ctx.onClose?.()
      // Will be wired to API call in Bundle 2
    },
  },
  {
    id: 'compare-concepts',
    label: 'Compare concepts',
    description: 'Compare two concepts side-by-side',
    icon: '⚖️',
    category: 'learning',
    handler: async (ctx) => {
      console.log('[Command] Compare concepts')
      ctx.onClose?.()
      // Will open comparison UI in Bundle 2
    },
  },
  {
    id: 'generate-path',
    label: 'Generate learning path',
    description: 'Create a structured learning roadmap',
    icon: '🗺️',
    category: 'learning',
    handler: async (ctx) => {
      console.log('[Command] Generate learning path')
      ctx.onClose?.()
      // Will open path generator drawer in Bundle 3
    },
  },
  {
    id: 'explain-diff',
    label: 'Explain diff / PR',
    description: 'Analyze and explain git diffs and pull requests',
    icon: '📋',
    category: 'tools',
    handler: async (ctx) => {
      console.log('[Command] Explain diff/PR')
      ctx.onClose?.()
      // Will open diff input panel in Bundle 2
    },
  },
  {
    id: 'start-quiz',
    label: 'Start quiz',
    description: 'Test your knowledge with reverse teaching',
    icon: '🧪',
    category: 'learning',
    handler: async (ctx) => {
      console.log('[Command] Start quiz')
      ctx.onClose?.()
      // Will trigger existing quiz flow
    },
  },
  {
    id: 'toggle-future-you',
    label: 'Toggle Future-You',
    description: 'Enable/disable future self guidance',
    icon: '🔮',
    category: 'general',
    handler: async (ctx) => {
      console.log('[Command] Toggle Future-You')
      ctx.onClose?.()
      // Will toggle existing future-you state
    },
  },
  {
    id: 'switch-perspective',
    label: 'Switch perspective',
    description: 'Change how concepts are explained',
    icon: '👁️',
    category: 'settings',
    subcommands: perspectiveCommands,
  },
  {
    id: 'switch-timebox',
    label: 'Switch timebox',
    description: 'Set time allocation for explanations',
    icon: '⏱️',
    category: 'settings',
    subcommands: timeboxCommands,
  },
  {
    id: 'switch-cognitive-load',
    label: 'Switch cognitive load',
    description: 'Adjust explanation complexity',
    icon: '🧠',
    category: 'settings',
    subcommands: cognitiveLoadCommands,
  },
  {
    id: 'open-vault',
    label: 'Open Vault',
    description: 'Access your learning memory dashboard',
    icon: '💎',
    category: 'tools',
    handler: async (ctx) => {
      console.log('[Command] Open vault')
      ctx.onClose?.()
      // Will open vault drawer in Bundle 3
    },
  },
]

/**
 * Group commands by category for UI rendering
 */
export function getCommandGroups(): CommandGroup[] {
  const groups = new Map<string, Command[]>()

  commandRegistry.forEach((cmd) => {
    if (!groups.has(cmd.category)) {
      groups.set(cmd.category, [])
    }
    groups.get(cmd.category)!.push(cmd)
  })

  const categoryLabels: Record<string, string> = {
    general: 'General',
    learning: 'Learning',
    tools: 'Tools',
    settings: 'Settings',
  }

  return Array.from(groups.entries())
    .map(([category, cmds]) => ({
      category: category as any,
      label: categoryLabels[category] || category,
      commands: cmds,
    }))
    .sort((a, b) => {
      const order = ['general', 'learning', 'tools', 'settings']
      return order.indexOf(a.category) - order.indexOf(b.category)
    })
}

/**
 * Find command by ID (handles nested subcommands)
 */
export function findCommand(id: string): Command | null {
  const search = (cmds: Command[]): Command | null => {
    for (const cmd of cmds) {
      if (cmd.id === id) return cmd
      if (cmd.subcommands) {
        const found = search(cmd.subcommands)
        if (found) return found
      }
    }
    return null
  }
  return search(commandRegistry)
}

/**
 * Filter commands by search query (fuzzy match on label + description)
 */
export function filterCommands(query: string, commands: Command[] = commandRegistry): Command[] {
  if (!query) return commands

  const q = query.toLowerCase()
  return commands.filter((cmd) => {
    const label = cmd.label.toLowerCase()
    const desc = cmd.description.toLowerCase()
    return label.includes(q) || desc.includes(q)
  })
}

/**
 * Execute a command handler
 */
export async function executeCommand(cmd: Command, context: CommandContext): Promise<void> {
  if (!cmd.handler) return
  try {
    await cmd.handler(context)
  } catch (err) {
    console.error(`[Command Error] ${cmd.id}:`, err)
    throw err
  }
}
