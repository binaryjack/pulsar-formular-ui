/**
 * Agent Redux Selectors
 * Memoized selectors for accessing agent state
 */

import { createSelector } from '@reduxjs/toolkit'
import { denormalizeArray } from '@shared/utils/redux-normalized-helpers'
import { RootState } from '../../../store/store'

/**
 * Select agent state slice
 */
export const selectAgentState = (state: RootState) => state.agent

/**
 * Select normalized cache (byId)
 */
export const selectById = createSelector([selectAgentState], state => state.byId)

/**
 * Select all IDs array
 */
export const selectAllIds = createSelector([selectAgentState], state => state.allIds)

/**
 * Select all agents (denormalized array)
 * Converts byId + allIds → array for UI display
 */
export const selectAll = createSelector([selectAgentState], state => denormalizeArray(state))

/**
 * Select single agent by ID
 */
export const selectAgentById = (id: string) => createSelector([selectById], byId => byId[id] || null)

/**
 * Select selected agent ID
 */
export const selectSelectedId = createSelector([selectAgentState], state => state.selectedId)

/**
 * Select working instance (for forms)
 */
export const selectWorkingInstance = createSelector([selectAgentState], state => state.workingInstance)

/**
 * Select original instance (for comparison)
 */
export const selectOriginalInstance = createSelector([selectAgentState], state => state.originalInstance)

/**
 * Select isDirty flag
 */
export const selectIsDirty = createSelector([selectAgentState], state => state.isDirty)

/**
 * Select loading state
 */
export const selectLoading = createSelector([selectAgentState], state => state.loading)

/**
 * Select saving state
 */
export const selectSaving = createSelector([selectAgentState], state => state.saving)

/**
 * Select deleting state
 */
export const selectDeleting = createSelector([selectAgentState], state => state.deleting)

/**
 * Select error message
 */
export const selectError = createSelector([selectAgentState], state => state.error)

/**
 * Select whether can save (derived)
 * Returns true if there are unsaved changes and not currently saving
 */
export const selectCanSave = createSelector(
  [selectIsDirty, selectSaving, selectWorkingInstance],
  (isDirty, saving, workingInstance) => isDirty && !saving && workingInstance !== null
)

/**
 * Select agent count
 */
export const selectCount = createSelector([selectAllIds], allIds => allIds.length)
