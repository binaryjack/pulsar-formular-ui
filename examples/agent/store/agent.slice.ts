/**
 * Agent Redux Slice
 * Normalized state pattern with FormProvider integration
 */

import { FieldUpdatePayload } from '@/store/field-update-payload.interface'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Agent } from '@shared/features/agent/interfaces/agent.interface'
import { setNestedValue } from '@shared/utils/nested-field-helpers'
import {
  checkIsDirty,
  clearWorkingInstance as clearWorkingInstanceHelper,
  createInitialNormalizedState,
  loadWorkingInstance,
  normalizeArray,
  removeNormalizedItem,
  upsertNormalizedItem,
} from '@shared/utils/redux-normalized-helpers'
import { AgentState } from './agent-state.interface'

const initialState: AgentState = {
  ...createInitialNormalizedState<Agent>(),
  loading: false,
  saving: false,
  deleting: false,
  error: null,
}

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    // ============================================================
    // LOAD ALL (Saga trigger)
    // ============================================================
    loadAll: state => {
      state.loading = true
      state.error = null
    },

    loadAllSuccess: (state, action: PayloadAction<Agent[]>) => {
      const { byId, allIds } = normalizeArray(action.payload)
      state.byId = byId
      state.allIds = allIds
      state.loading = false
      state.error = null
    },

    loadAllFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // ============================================================
    // LOAD BY ID (Saga trigger)
    // ============================================================
    loadById: (state, action: PayloadAction<string>) => {
      // Clear working instance before loading new entity (StrictMode safe)
      clearWorkingInstanceHelper(state)

      state.loading = true
      state.error = null
      state.selectedId = action.payload
    },

    loadByIdSuccess: (state, action: PayloadAction<Agent>) => {
      const agent = action.payload

      // Store in cache
      upsertNormalizedItem(state, agent)

      // Load into working instance
      state.workingInstance = { ...agent }
      state.originalInstance = { ...agent }
      state.isDirty = false
      state.loading = false
    },

    loadByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // ============================================================
    // SELECT (Change selection)
    // ============================================================
    select: (state, action: PayloadAction<string | null>) => {
      loadWorkingInstance(state, action.payload)
    },

    // ============================================================
    // CREATE NEW (Saga trigger - creates in backend)
    // ============================================================
    createNew: state => {
      state.saving = true
      state.error = null
    },

    createNewSuccess: (state, action: PayloadAction<Agent>) => {
      const agent = action.payload

      // Store in cache
      upsertNormalizedItem(state, agent)

      // Load into working instance
      state.workingInstance = { ...agent }
      state.originalInstance = { ...agent }
      state.isDirty = false
      state.selectedId = agent.id
      state.saving = false
    },

    createNewFailure: (state, action: PayloadAction<string>) => {
      state.saving = false
      state.error = action.payload
    },

    // ============================================================
    // UPDATE FIELD (Called by FormProvider)
    // ============================================================
    // FormProvider dispatches this when Input/TextArea/Select changes
    // Supports nested paths: 'name' or 'designTimeModel.quality.maxTokens'
    updateField: (state, action: PayloadAction<FieldUpdatePayload>) => {
      if (state.workingInstance) {
        const { fieldPath, value } = action.payload

        // Support both flat and nested field paths
        setNestedValue(state.workingInstance, fieldPath, value)

        state.isDirty = checkIsDirty(state.workingInstance, state.originalInstance)
      }
    },

    // Update field silently (used by cascade handlers to avoid triggering watchers)
    updateFieldSilent: (state, action: PayloadAction<FieldUpdatePayload>) => {
      if (state.workingInstance) {
        const { fieldPath, value } = action.payload
        setNestedValue(state.workingInstance, fieldPath, value)
        state.isDirty = checkIsDirty(state.workingInstance, state.originalInstance)
      }
    },

    // ============================================================
    // SAVE (Saga trigger - Create or Update)
    // ============================================================
    save: state => {
      state.error = null
    },

    // ============================================================
    // GRANULAR STATE SETTERS (Called by Saga)
    // ============================================================
    setWorkingInstance: (state, action: PayloadAction<Agent>) => {
      const agent = action.payload
      state.workingInstance = { ...agent }
      state.originalInstance = { ...agent }
      state.isDirty = false
    },

    setSaving: (state, action: PayloadAction<boolean>) => {
      state.saving = action.payload
    },

    updateCache: (state, action: PayloadAction<Agent>) => {
      upsertNormalizedItem(state, action.payload)
    },

    saveFailure: (state, action: PayloadAction<string>) => {
      state.saving = false
      state.error = action.payload
    },

    // ============================================================
    // DELETE (Saga trigger)
    // ============================================================
    deleteItem: (state, _action: PayloadAction<string>) => {
      state.deleting = true
      state.error = null
    },

    deleteSuccess: (state, action: PayloadAction<string>) => {
      const id = action.payload

      // Remove from normalized cache
      removeNormalizedItem(state, id)

      // Clear selection if deleted item was selected
      if (state.selectedId === id) {
        clearWorkingInstanceHelper(state)
      }

      state.deleting = false
    },

    deleteFailure: (state, action: PayloadAction<string>) => {
      state.deleting = false
      state.error = action.payload
    },

    // ============================================================
    // DISCARD CHANGES
    // ============================================================
    discard: state => {
      if (state.originalInstance) {
        state.workingInstance = { ...state.originalInstance }
        state.isDirty = false
      }
    },

    // ============================================================
    // CLEAR ERROR
    // ============================================================
    clearError: state => {
      state.error = null
    },

    // ============================================================
    // CLEAR WORKING INSTANCE
    // ============================================================
    clearWorkingInstance: state => {
      clearWorkingInstanceHelper(state)
    },

    // ============================================================
    // SET LOADING (for global loading aggregation)
    // ============================================================
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const {
  loadAll,
  loadAllSuccess,
  loadAllFailure,
  loadById,
  loadByIdSuccess,
  loadByIdFailure,
  select,
  createNew,
  createNewSuccess,
  createNewFailure,
  updateField,
  updateFieldSilent,
  save,
  setWorkingInstance,
  setSaving,
  updateCache,
  saveFailure,
  deleteItem,
  deleteSuccess,
  deleteFailure,
  discard,
  clearError,
  clearWorkingInstance,
  setLoading,
} = agentSlice.actions

export const agentActions = agentSlice.actions
export const agentReducer = agentSlice.reducer
export default agentSlice.reducer
