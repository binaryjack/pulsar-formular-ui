/**
 * Agent Form Component
 * Uses FormProvider with EntityDescriptor for auto-save forms
 */

import { DisplayField } from '@shared/components/atoms/display-field'
import { DisplayTextArea } from '@shared/components/atoms/display-text-area'
import { Input } from '@shared/components/atoms/input'
import { TextArea } from '@shared/components/atoms/text-area'
import { FormProvider } from '@shared/components/form/context/form-provider'
import { ModelQualitySelector } from '@shared/components/molecules/model-quality-selector'
import { ModelTierSelector } from '@shared/components/molecules/model-tier-selector'
import { Agent } from '@shared/features'
import { AgentClass } from '@shared/features/agent/models/agent.model'
import { useDispatch, useSelector } from 'react-redux'
import { useEntityForm } from '../../../hooks/use-entity-form.hook'
import { TechnologySelector } from '../../technology/components/technology-selector'
import { selectError, selectIsDirty, selectSaving, selectWorkingInstance } from '../store/agent.selectors'
import * as agentActions from '../store/agent.slice'

export const AgentForm = () => {
  const dispatch = useDispatch()
  const workingInstance = useSelector(selectWorkingInstance)
  const isDirty = useSelector(selectIsDirty)
  const saving = useSelector(selectSaving)
  const error = useSelector(selectError)

  // Manage EntityDescriptor lifecycle with fresh instance per mount
  const { model, isReady } = useEntityForm<Agent>({
    entityClass: AgentClass,
    workingInstance,
    entityId: workingInstance?.id,
    enableNotifications: false, // AgentPage handles notifications
    // TODO: Add validations once ValidatorRegistry is configured
    // validations: {
    //   name: { required: true, minLength: 3 }
    // }
  })

  if (!workingInstance || !isReady) {
    return (
      <div className="agent-form agent-form--empty">
        <p>Select an agent from the list or create a new one to get started.</p>
      </div>
    )
  }

  return (
    <div className="agent-form">
      <div className="agent-form__header">
        <h2>Agent Details</h2>
        <div className="agent-form__status">
          {saving && <span className="agent-form__status-saving">Saving...</span>}
          {isDirty && !saving && <span className="agent-form__status-dirty">Unsaved changes</span>}
          {!isDirty && !saving && <span className="agent-form__status-saved">Saved</span>}
        </div>
      </div>

      {error && <div className="agent-form__error">{error}</div>}

      <FormProvider
        model={model}
        dispatcher={dispatch}
        actions={agentActions}
        id={workingInstance?.id || 'new-agent'}
        feature="agent"
      >
        <div className="agent-form__fields">
          <DisplayField name="baseType" label="Type" />
          <DisplayField name="id" label="ID" />
          <Input name="name" label="Name" placeholder="Enter agent name" required />
          <DisplayField name="sequenceId" label="Sequence ID" />
          <DisplayField name="createdAt" label="Created At" />
          <DisplayField name="updatedAt" label="Updated At" />

          <TechnologySelector name="technologyId" label="Technology" />
          <DisplayField name="fileSize" label="File Size" />

          <ModelTierSelector name="designTimeModelTier" label="Design Model Tier" />
          <ModelQualitySelector name="designTimeQualityId" label="Design Quality" />
          <DisplayField name="designTimeModelUsed" label="Design Model Used" />

          <TextArea name="contextUserPrompt" label="User Prompt" placeholder="Enter user prompt" rows={4} />
          <DisplayTextArea name="contextOptimizedPrompt" label="Optimized Prompt" rows={4} />
        </div>
      </FormProvider>
    </div>
  )
}
