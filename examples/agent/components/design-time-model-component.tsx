import { Card } from '@shared/components/molecules/card'
import { ModelQualitySelector } from '@shared/components/molecules/model-quality-selector'
import { ModelTierSelector } from '@shared/components/molecules/model-tier-selector'

interface DesignTimeModelComponentProps {
  tierFieldName?: string
  qualityFieldName?: string
  title?: string
}

export const DesignTimeModelComponent = ({
  tierFieldName = 'modelTier',
  qualityFieldName = 'modelQuality',
  title = 'Model Configuration',
}: DesignTimeModelComponentProps) => {
  return (
    <Card label={title}>
      <div className="flex flex-col gap-4">
        <ModelTierSelector name={tierFieldName} label="Model Tier" required />
        <ModelQualitySelector name={qualityFieldName} label="Quality" required />
      </div>
    </Card>
  )
}
