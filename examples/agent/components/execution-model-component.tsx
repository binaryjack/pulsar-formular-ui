import { Input } from '@shared/components/atoms/input'
import { Card } from '@shared/components/molecules/card'
import { ModelTierSelector } from '@shared/components/molecules/model-tier-selector'

interface ExecutionModelComponentProps {
  tierFieldName?: string
  maxTokensFieldName?: string
  temperatureFieldName?: string
  title?: string
}

export const ExecutionModelComponent = ({
  tierFieldName = 'executionModelTier',
  maxTokensFieldName = 'maxTokens',
  temperatureFieldName = 'temperature',
  title = 'Execution Model',
}: ExecutionModelComponentProps) => {
  return (
    <Card label={title}>
      <div className="flex flex-col gap-4">
        <ModelTierSelector name={tierFieldName} label="Execution Tier" required />
        <Input name={maxTokensFieldName} label="Max Tokens" type="number" placeholder="e.g., 4000" />
        <Input name={temperatureFieldName} label="Temperature" type="number" placeholder="0.0 - 1.0" />
      </div>
    </Card>
  )
}
