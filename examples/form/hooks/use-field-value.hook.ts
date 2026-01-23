/**
 * useFieldValue Hook
 * Subscribes to EntityDescriptor field updates using useSyncExternalStore
 */

import { notificationManager } from '@shared/services/notification/notification-manager'
import { useCallback, useSyncExternalStore } from 'react'
import { useFormContext } from '../context/form-provider'

/**
 * Hook to subscribe to a field's value from EntityDescriptor
 * Automatically re-renders when the model updates
 */
export const useFieldValue = (fieldName: string): unknown => {
  const { getField, model } = useFormContext()
  // Subscribe to EntityDescriptor updates via NotificationManager
  const fieldValue = useSyncExternalStore(
    // Subscribe function
    useCallback(
      (callback: () => void) => {
        console.log('[useFieldValue] Subscribing to field:', fieldName)
        const unsubscribe = notificationManager.subscribe(model.notificationId, () => {
          console.log('[useFieldValue] Update notification received for field:', fieldName)
          callback()
        })
        return () => {
          console.log('[useFieldValue] Unsubscribing from field:', fieldName)
          unsubscribe()
        }
      },
      [model, fieldName]
    ),
    // Get snapshot - always get fresh field value from model
    useCallback(() => {
      const field = getField(fieldName)
      console.log('[useFieldValue] Getting snapshot for field:', fieldName, 'value:', field.value)
      return field.value
    }, [fieldName, getField])
  )

  return fieldValue
}
