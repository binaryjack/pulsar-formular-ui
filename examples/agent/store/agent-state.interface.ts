/**
 * Agent Redux State Interface
 * Normalized state pattern with FormProvider integration
 */

import { Agent } from '@shared/features/agent/interfaces/agent.interface'

/**
 * Agent feature state (normalized pattern)
 */
export interface AgentState {
  // Normalized cache
  byId: Record<string, Agent>
  allIds: string[]

  // UI state
  selectedId: string | null

  // Working instance for forms
  workingInstance: Agent | null
  originalInstance: Agent | null
  isDirty: boolean

  // Loading states
  loading: boolean
  saving: boolean
  deleting: boolean
  error: string | null
}
