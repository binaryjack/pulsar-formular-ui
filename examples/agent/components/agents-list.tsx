import { Spinner } from '@shared/components/atoms/spinner'
import { Card } from '@shared/components/molecules/card'
import { useEffect, useState } from 'react'

interface Agent {
  id: string
  name: string
  technology?: string
  status?: string
}

interface AgentsListProps {
  agents: Agent[]
  loading?: boolean
  onSelect?: (agentId: string) => void
  title?: string
}

export const AgentsList = ({ agents, loading = false, onSelect, title = 'Agents' }: AgentsListProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredAgents, setFilteredAgents] = useState(agents)

  useEffect(() => {
    const filtered = agents.filter(agent => agent.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredAgents(filtered)
  }, [agents, searchTerm])

  if (loading) {
    return (
      <Card label={title}>
        <div className="flex items-center justify-center p-4">
          <Spinner />
        </div>
      </Card>
    )
  }

  return (
    <Card label={title}>
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Search agents..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        />

        {filteredAgents.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            {searchTerm ? 'No agents match your search' : 'No agents available'}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredAgents.map(agent => (
              <button
                key={agent.id}
                onClick={() => onSelect?.(agent.id)}
                className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50 text-left"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{agent.name}</div>
                  {agent.technology && <div className="text-xs text-gray-500 mt-1">{agent.technology}</div>}
                </div>
                {agent.status && (
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">{agent.status}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
