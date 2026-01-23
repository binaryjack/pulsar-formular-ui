import { notificationManager } from '@shared/services/notification/notification-manager'
import { useCallback, useEffect, useState } from 'react'
import { useFormContext } from '../form/context/form-provider'

interface ValidationResultsProps {
  fieldName: string
}

export const ValidationResults = ({ fieldName }: ValidationResultsProps) => {
  const { getValidations, model, getField } = useFormContext()
  const [errors, setErrors] = useState<string[]>([])
  const [guide, setGuide] = useState<string>('')
  const [hasFocus, setHasFocus] = useState(false)
  const [hasBeenTouched, setHasBeenTouched] = useState(false)

  const handleModelUpdated = useCallback(() => {
    const validators = getValidations(fieldName)
    const field = getField(fieldName)
    const behavior = field.behavior

    if (validators.length > 0) {
      const validator = validators[0]
      const results = validator.getResults()

      setErrors(results.filter(r => r.error).map(r => r.error || ''))
      setGuide(results.find(r => r.guide)?.guide || '')
    }

    setHasFocus(behavior?.isFocus || false)
    setHasBeenTouched(behavior?.hasBeenTouched || false)
  }, [fieldName, getValidations, getField])

  useEffect(() => {
    // Subscribe to model updates via NotificationManager
    const unsubscribe = notificationManager.subscribe(model.notificationId, () => {
      handleModelUpdated()
    })

    // Initial call
    handleModelUpdated()

    return () => {
      unsubscribe()
    }
  }, [model, handleModelUpdated])

  // Show guide when focused
  if (hasFocus && guide) {
    return <div className="text-sm text-green-600 mt-1">💡 {guide}</div>
  }

  // Show errors when touched and not focused
  if (hasBeenTouched && !hasFocus && errors.length > 0) {
    return (
      <div className="flex flex-col gap-1 mt-1">
        {errors.map((error, index) => (
          <div key={index} className="text-sm text-red-600">
            ⚠️ {error}
          </div>
        ))}
      </div>
    )
  }

  return null
}
