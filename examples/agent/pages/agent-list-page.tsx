/**
 * Agent List Page
 * Displays agent list (accessed via /agents)
 * Left panel TreeView navigation handled by layout
 */

import { AgentList } from '../components/agent-list'
import './agent-list-page.css'

export const AgentListPage = () => {
  return (
    <div className="agent-list-page">
      <AgentList />
    </div>
  )
}
