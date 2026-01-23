/**
 * Agent Form Page
 * Displays agent edit form (accessed via /agents/:id)
 * Left panel TreeView navigation handled by layout
 */

import { ITreeNode } from '@shared/interfaces/tree-node.interface'
import { notificationManager } from '@shared/services/notification/notification-manager'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useUnsavedChangesWarning } from '../../../hooks/use-unsaved-changes-warning.hook'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { selectExpandedItems, selectTree } from '../../tree-view/store/tree-view.selectors'
import { treeViewActions } from '../../tree-view/store/tree-view.slice'
import { AgentForm } from '../components/agent-form'
import { selectIsDirty } from '../store/agent.selectors'
import * as agentActions from '../store/agent.slice'
import './agent-form-page.css'

/**
 * Find node by entity ID in tree
 */
const findNodeByEntityId = (nodes: ITreeNode[], entityId: string): ITreeNode | null => {
  for (const node of nodes) {
    if (node.entityId === entityId) return node
    if (node.children) {
      const found = findNodeByEntityId(node.children, entityId)
      if (found) return found
    }
  }
  return null
}

/**
 * Find node by node ID
 */
const findNodeById = (nodes: ITreeNode[], nodeId: string): ITreeNode | null => {
  for (const node of nodes) {
    if (node.id === nodeId) return node
    if (node.children) {
      const found = findNodeById(node.children, nodeId)
      if (found) return found
    }
  }
  return null
}

/**
 * Get all parent IDs from node to root
 */
const getParentChain = (nodeId: string, tree: ITreeNode[]): string[] => {
  const chain: string[] = []
  let currentId: string | null = nodeId

  while (currentId) {
    const node = findNodeById(tree, currentId)
    if (!node || !node.parentId) break
    chain.push(node.parentId)
    currentId = node.parentId
  }

  return chain.reverse() // Root first, immediate parent last
}

export const AgentFormPage = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const tree = useAppSelector(selectTree)
  const expandedIds = useAppSelector(selectExpandedItems)
  const isDirty = useAppSelector(selectIsDirty)

  // Warn before leaving page with unsaved changes
  useUnsavedChangesWarning({ isDirty })

  // Track if we've already expanded parents for this ID to prevent re-expansion loop
  const expandedForId = useRef<string | null>(null)

  // Load agent on mount or when ID changes
  useEffect(() => {
    if (id) {
      console.log('[AgentFormPage] Loading agent:', id)
      dispatch(agentActions.loadById(id))
    }
  }, [id, dispatch])

  // Expand parent chain and highlight this agent's node
  useEffect(() => {
    if (!id) {
      console.warn('[AgentFormPage] No ID provided')
      return
    }

    if (tree.length === 0) {
      console.warn('[AgentFormPage] Tree not loaded yet, skipping parent expansion')
      return
    }

    // Only expand parents once per ID (prevent re-expansion loop when user collapses)
    if (expandedForId.current === id) {
      console.log(`[AgentFormPage] Already expanded parents for ${id}, skipping`)
      return
    }

    console.log(`[AgentFormPage] Expanding parents and highlighting agent: ${id}`)

    // Find the node in the tree by entityId
    const node = findNodeByEntityId(tree, id)

    if (!node) {
      console.warn(`[AgentFormPage] Node not found in tree for entityId:`, id)
      return
    }

    console.log(`[AgentFormPage] Found node:`, node.id, node.label)

    // Get parent chain
    const parentChain = getParentChain(node.id, tree)

    if (parentChain.length > 0) {
      console.log(`[AgentFormPage] Parent chain:`, parentChain, 'Currently expanded:', expandedIds)
      // Expand only collapsed parents
      parentChain.forEach(parentId => {
        if (!expandedIds.includes(parentId)) {
          console.log(`[AgentFormPage] Expanding parent:`, parentId)
          dispatch(treeViewActions.toggleExpanded(parentId))
        } else {
          console.log(`[AgentFormPage] Parent already expanded:`, parentId)
        }
      })
    } else {
      console.log(`[AgentFormPage] No parents to expand (root level node)`)
    }

    // Mark as expanded for this ID
    expandedForId.current = id

    // Then send highlight notification
    notificationManager.notify({
      type: 'highlight',
      entityId: id,
    })

    // Clear highlight when component unmounts
    return () => {
      notificationManager.notify({
        type: 'clear-highlight',
        entityId: id,
      })
    }
  }, [id, dispatch, tree, expandedIds])

  return <AgentForm />
}
