import { AppEntitiesNamesEnum } from '@shared/enums/app-entities-names.enum'
import { NodeBehaviorType } from '@shared/enums/node-behavior-type.enum'
import { ITreeNode } from '@shared/interfaces/tree-node.interface'
import { AppDispatch } from '../../../store/store'
import { showDeleteConfirmation } from '../../modal/services/modal.service'
import { IContextMenuAction } from '../../tree-view/interface'
import { createNew as createAgent, deleteItem } from '../store/agent.slice'

/**
 * Create agent context menu action
 */
export const createAgentAction = (dispatch: AppDispatch): IContextMenuAction => ({
  id: 'create-agent',
  label: 'Create Agent',
  icon: '+',
  handler: (node: ITreeNode) => {
    // Dispatch create action - saga will handle API call and navigation
    dispatch(createAgent())
    console.log('[Agent] Creating new agent from tree node:', node.label)
  },
  isVisible: (node: ITreeNode) =>
    node.nodeType === AppEntitiesNamesEnum.agents && node.behaviors.includes(NodeBehaviorType.Creation),
})

/**
 * Delete agent context menu action
 * Shows confirmation modal before deleting
 */
export const deleteAgentAction = (dispatch: AppDispatch): IContextMenuAction => ({
  id: 'delete-agent',
  label: 'Delete Agent',
  icon: '🗑',
  variant: 'danger',
  handler: async (node: ITreeNode) => {
    if (!node.entityId) {
      console.warn('[Agent] Cannot delete: no entityId')
      return
    }

    console.log('[Agent] Delete agent requested:', node.entityId, node.label)

    // Show app modal for delete confirmation
    const confirmed = await showDeleteConfirmation(node.label, 'Agent')

    if (confirmed) {
      console.log('[Agent] Delete confirmed, dispatching deleteItem:', node.entityId)
      dispatch(deleteItem(node.entityId))
    } else {
      console.log('[Agent] Delete cancelled')
    }
  },
  isVisible: (node: ITreeNode) =>
    // Only show delete on dynamic nodes with entityId (not static roots)
    node.nodeType === AppEntitiesNamesEnum.agents && Boolean(node.entityId),
})
