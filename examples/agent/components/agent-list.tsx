/**
 * Agent List Component
 * Displays simple list of all agents (route: /agents)
 * Create/delete handled by TreeView context menu
 */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { treeViewActions } from '../../tree-view/store/tree-view.slice'
import { selectAll, selectLoading } from '../store/agent.selectors'
import { loadAll } from '../store/agent.slice'

export const AgentList = () => {
  const dispatch = useDispatch()
  const agents = useSelector(selectAll)
  const loading = useSelector(selectLoading)

  // Load agents on mount
  useEffect(() => {
    dispatch(loadAll())
  }, [dispatch])

  const handleAgentClick = (agentId: string) => {
    // Use TreeView node ID format: tree-{entityId}
    const nodeId = `tree-${agentId}`
    dispatch(treeViewActions.selectNode(nodeId))
  }

  if (loading) {
    return <div className="agent-list">Loading agents...</div>
  }

  return (
    <div className="agent-list">
      <div className="agent-list__header">
        <h2>All Agents</h2>
      </div>

      {agents.length === 0 ? (
        <div className="agent-list__empty">No agents yet. Use TreeView to create agents from a Schema.</div>
      ) : (
        <ul className="agent-list__items">
          {agents.map(agent => (
            <li key={agent.id} className="agent-list__item">
              <button onClick={() => handleAgentClick(agent.id)} className="agent-list__link">
                {agent.name || '(Unnamed)'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
