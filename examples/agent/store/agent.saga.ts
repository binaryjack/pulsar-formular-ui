/**
 * Agent Redux Saga
 * Handles async operations with ApiService
 */

import type { FieldUpdatePayload } from '@/store/field-update-payload.interface'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createAgent } from '@shared/features/agent/factories/agent.factory'
import { Agent } from '@shared/features/agent/interfaces/agent.interface'
import { call, debounce, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { apiService } from '../../../services/api.service'
import { modelResolutionService } from '../../../services/model-resolution.service'
import { navigateTo } from '../../../services/navigation.service'
import type { RootState } from '../../../store/store'
import { setGlobalError } from '../../app/store'
import { syncTreeSaga } from '../../tree-view/store/tree-view.saga'
import { selectIsDirty, selectWorkingInstance } from './agent.selectors'
import {
  createNew,
  createNewFailure,
  createNewSuccess,
  deleteFailure,
  deleteItem,
  deleteSuccess,
  loadAll,
  loadAllFailure,
  loadAllSuccess,
  loadById,
  loadByIdFailure,
  loadByIdSuccess,
  save,
  saveFailure,
  setLoading,
  setSaving,
  setWorkingInstance,
  updateCache,
  updateField,
  updateFieldSilent,
} from './agent.slice'

/**
 * Auto-save after field updates
 * Debounced to avoid excessive saves during typing
 */
function* handleAutoSave() {
  try {
    // Check if there are actually changes to save
    const isDirty: boolean = yield select(selectIsDirty)

    if (!isDirty) {
      console.log('[AgentSaga] No changes to save, skipping auto-save')
      return
    }

    // Get working instance
    const agent: Agent | null = yield select(selectWorkingInstance)

    if (!agent) {
      console.log('[AgentSaga] No working instance, skipping auto-save')
      return
    }

    // Trigger save
    console.log('[AgentSaga] Auto-saving agent:', agent.id)
    yield put(save())
  } catch (error) {
    console.error('[AgentSaga] Auto-save failed:', error)
  }
}

/**
 * Create new agent - creates in backend first, then loads into form
 */
function* handleCreateNew() {
  try {
    // Set loading TRUE
    yield put(setLoading(true))

    // Create empty agent
    const newAgent = createAgent({ name: '' })

    console.log('[AgentSaga] Creating new agent in backend')

    // Save to backend immediately
    const response: Awaited<ReturnType<typeof apiService.send<Agent>>> = yield call(
      [apiService, 'send'],
      'agent/create',
      { data: newAgent }
    )

    if (response.success && response.data) {
      yield put(createNewSuccess(response.data))
      console.log('[AgentSaga] Agent created:', response.data.id)

      // Navigate to edit page
      navigateTo(`/agents/${response.data.id}`)
      console.log('[AgentSaga] Navigated to edit page')

      // Trigger TreeView sync to show new node (wait for completion)
      yield call(syncTreeSaga)
      console.log('[AgentSaga] TreeView sync completed')

      // Set loading FALSE on success
      yield put(setLoading(false))
    } else {
      yield put(createNewFailure(response.error?.message || 'Failed to create agent'))
      yield put(setLoading(false))
    }
  } catch (error) {
    // On error: set global error + clear loading
    const errorMessage = error instanceof Error ? error.message : 'Failed to create agent'
    yield put(setGlobalError(errorMessage))
    yield put(createNewFailure(errorMessage))
    yield put(setLoading(false))
  }
}

/**
 * Load all agents from backend
 */
function* handleLoadAll() {
  try {
    // Set loading TRUE
    yield put(setLoading(true))

    const response: Awaited<ReturnType<typeof apiService.send<Agent[]>>> = yield call(
      [apiService, 'send'],
      'agent/list'
    )

    if (response.success && response.data) {
      yield put(loadAllSuccess(response.data))
      // Set loading FALSE on success
      yield put(setLoading(false))
    } else {
      yield put(loadAllFailure(response.error?.message || 'Failed to load agents'))
      yield put(setLoading(false))
    }
  } catch (error) {
    // On error: set global error + clear loading
    const errorMessage = error instanceof Error ? error.message : 'Failed to load agents'
    yield put(setGlobalError(errorMessage))
    yield put(loadAllFailure(errorMessage))
    yield put(setLoading(false))
  }
}

/**
 * Load single agent by ID
 */
function* handleLoadById(action: PayloadAction<string>) {
  try {
    // Set loading TRUE
    yield put(setLoading(true))

    const id = action.payload

    const response: Awaited<ReturnType<typeof apiService.send<Agent>>> = yield call(
      [apiService, 'send'],
      'agent/read',
      { id }
    )

    if (response.success && response.data) {
      yield put(loadByIdSuccess(response.data))
      // Set loading FALSE on success
      yield put(setLoading(false))
    } else {
      yield put(loadByIdFailure(response.error?.message || 'Failed to load agent'))
      yield put(setLoading(false))
    }
  } catch (error) {
    // On error: set global error + clear loading
    const errorMessage = error instanceof Error ? error.message : 'Failed to load agent'
    yield put(setGlobalError(errorMessage))
    yield put(loadByIdFailure(errorMessage))
    yield put(setLoading(false))
  }
}

/**
 * Save agent (create or update)
 */
function* handleSave() {
  yield put(setSaving(true))

  try {
    yield put(setLoading(true))

    // Get working instance from Redux state
    const agent: Agent | null = yield select(selectWorkingInstance)

    if (!agent) {
      yield put(saveFailure('No agent to save'))
      yield put(setLoading(false))
      yield put(setSaving(false))
      return
    }

    // Store current selectedId before save to check race condition
    const currentSelectedId: string | null = yield select((state: RootState) => state.agent.selectedId)

    // Determine operation: create if temp ID, otherwise update
    const isCreate = !agent.id || agent.id.startsWith('temp-')
    const operation = isCreate ? 'agent/create' : 'agent/update'

    console.log(`[AgentSaga] Saving agent via ${operation}:`, agent)

    const response: Awaited<ReturnType<typeof apiService.send<Agent>>> = yield call([apiService, 'send'], operation, {
      data: agent,
    })

    if (response.success && response.data) {
      const savedAgent = response.data
      console.log('[AgentSaga] Save successful:', savedAgent)

      // Always update cache
      yield put(updateCache(savedAgent))

      // Only update workingInstance if user is still viewing this agent
      if (currentSelectedId === savedAgent.id) {
        yield put(setWorkingInstance(savedAgent))
      }

      // Trigger TreeView sync to update node label (wait for completion)
      yield call(syncTreeSaga)
      console.log('[AgentSaga] TreeView sync completed after save')

      yield put(setLoading(false))
      yield put(setSaving(false))
    } else {
      yield put(saveFailure(response.error?.message || 'Failed to save agent'))
      yield put(setLoading(false))
      yield put(setSaving(false))
    }
  } catch (error) {
    // On error: set global error + clear loading
    const errorMessage = error instanceof Error ? error.message : 'Failed to save agent'
    yield put(setGlobalError(errorMessage))
    yield put(saveFailure(errorMessage))
    yield put(setLoading(false))
    yield put(setSaving(false))
  }
}

/**
 * Delete agent by ID
 */
function* handleDelete(action: PayloadAction<string>) {
  try {
    // Set loading TRUE
    yield put(setLoading(true))

    const id = action.payload

    console.log('[AgentSaga] Deleting agent:', id)

    const response: Awaited<ReturnType<typeof apiService.send<void>>> = yield call(
      [apiService, 'send'],
      'agent/delete',
      { id }
    )

    if (response.success) {
      yield put(deleteSuccess(id))

      console.log('[AgentSaga] Agent deleted successfully, navigating to list')

      // Navigate back to list FIRST (before tree refresh)
      navigateTo('/agents')

      console.log('[AgentSaga] About to call syncTreeSaga...')

      // Refresh tree to remove the deleted node (wait for completion)
      yield call(syncTreeSaga)

      console.log('[AgentSaga] TreeView sync completed after delete')

      // Set loading FALSE on success
      yield put(setLoading(false))
    } else {
      yield put(deleteFailure(response.error?.message || 'Failed to delete agent'))
      yield put(setLoading(false))
    }
  } catch (error) {
    // On error: set global error + clear loading
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete agent'
    yield put(setGlobalError(errorMessage))
    yield put(deleteFailure(errorMessage))
    yield put(setLoading(false))
  }
}

/**
 * Cascade: designTimeModelTier changed
 * 1. Validate current quality still valid for new tier
 * 2. Reset to default quality if invalid
 * 3. Resolve new model ID
 */
function* handleDesignTimeTierChange() {
  try {
    const agent: Agent | null = yield select(selectWorkingInstance)
    if (!agent || !agent.designTimeModelTier) return

    const tier = agent.designTimeModelTier
    const currentQuality = agent.designTimeQualityId

    // Check if current quality is valid for new tier
    if (currentQuality && !modelResolutionService.isQualityValidForTier(tier, currentQuality)) {
      // Reset to default quality for this tier
      const defaultQuality = modelResolutionService.getDefaultQuality(tier)
      const resolvedModel = modelResolutionService.resolveModel(tier, defaultQuality)

      // Use updateField to maintain dirty tracking
      yield put(updateField({ fieldPath: 'designTimeQualityId', value: defaultQuality }))
      if (resolvedModel) {
        yield put(updateField({ fieldPath: 'designTimeModelUsed', value: resolvedModel }))
      }
    } else if (currentQuality) {
      // Quality is valid, just update model
      const resolvedModel = modelResolutionService.resolveModel(tier, currentQuality)
      if (resolvedModel) {
        yield put(updateField({ fieldPath: 'designTimeModelUsed', value: resolvedModel }))
      }
    }
  } catch (error) {
    console.error('[AgentSaga] Tier change cascade failed:', error)
  }
}

/**
 * Cascade: designTimeQualityId changed
 * Resolve and update model ID
 */
function* handleDesignTimeQualityChange() {
  try {
    const agent: Agent | null = yield select(selectWorkingInstance)
    if (!agent || !agent.designTimeModelTier || !agent.designTimeQualityId) return

    const resolvedModel = modelResolutionService.resolveModel(agent.designTimeModelTier, agent.designTimeQualityId)

    if (resolvedModel) {
      // Use updateFieldSilent to maintain dirty tracking
      yield put(updateFieldSilent({ fieldPath: 'designTimeModelUsed', value: resolvedModel }))
    }
  } catch (error) {
    console.error('[AgentSaga] Quality change cascade failed:', error)
  }
}

/**
 * Root agent saga
 * Watches all agent actions
 */
export function* agentSaga() {
  // Use takeLatest for queries (cancels previous if new request comes)
  yield takeLatest(loadAll.type, handleLoadAll)
  yield takeLatest(loadById.type, handleLoadById)
  yield takeLatest(createNew.type, handleCreateNew)
  yield takeLatest(save.type, handleSave)

  // Auto-save: debounce field updates to avoid excessive saves
  yield debounce(300, updateField.type, handleAutoSave)

  // Cascade watchers: model tier/quality changes
  // Only trigger cascades for the source fields, not the result fields
  yield takeLatest(updateField.type, function* (action: PayloadAction<FieldUpdatePayload>) {
    const { fieldPath } = action.payload

    // Only cascade on source field changes, not cascaded updates
    if (fieldPath === 'designTimeModelTier') {
      yield call(handleDesignTimeTierChange)
    } else if (fieldPath === 'designTimeQualityId') {
      yield call(handleDesignTimeQualityChange)
    }
    // Note: designTimeModelUsed is a result field - don't cascade on it
  })

  // Use takeEvery for mutations (allow concurrent deletes)
  yield takeEvery(deleteItem.type, handleDelete)
}
