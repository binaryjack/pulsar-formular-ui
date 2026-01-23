/**
 * AgentSelector Component
 * Form-centric agent selector - Only use in FormContext
 * Self-contained: loads agents from Redux store
 * Automatically disables during save operations
 */

import { useSpecializedSelector } from '@/hooks/use-specialized-selector'
import { SelectBase } from '@shared/components/atoms'
import { ValidationResults } from '@shared/components/atoms/validation-results'
import { Agent } from '@shared/features/agent/interfaces/agent.interface'
import { useAppContext } from '@shared/hooks/use-app-context.hook'
import { useSelector } from 'react-redux'

interface AgentSelectorProps {
  name: string
  label?: string
  required?: boolean
  disabled?: boolean
}

interface AgentState {
  byId: Record<string, Agent>
  allIds: string[]
  saving?: boolean
}

interface RootStateWithAgent {
  agent: AgentState
  app: {
    isLoading: boolean
    isSaving: boolean
  }
}

export const AgentSelector = ({ name, label, required = false, disabled = false }: AgentSelectorProps) => {
  const { isBusy } = useAppContext()

  // Self-contained: Load agents from Redux store
  const agents = useSelector((state: RootStateWithAgent) => {
    console.log('[AgentSelector] allIds:', state.agent?.allIds)
    console.log('[AgentSelector] byId keys:', Object.keys(state.agent?.byId || {}))
    return state.agent?.allIds?.map((id: string) => state.agent.byId[id]) || []
  })

  const { handleBlur, handleChange, handleFocus } = useSpecializedSelector(name)

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <SelectBase
        id={name}
        name={name}
        disabled={disabled || isBusy}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        options={agents}
      />
      <ValidationResults fieldName={name} />
    </div>
  )
}
