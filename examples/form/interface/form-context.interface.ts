import { IEntityDescriptor } from '../../../core/models/entity/interface/entity-descriptor.interface'
import { IFieldDescriptor } from '../../../core/models/fields/interface/field-descriptor.interface'
import { Validator } from '../../../core/validation/validator/validator.class'

/**
 * Form context interface
 * Provides access to model and field operations
 */
export interface IFormContext<T extends object> {
  /** Entity descriptor model */
  model: IEntityDescriptor<T>

  /** Update field value and dispatch to Redux - supports nested paths like 'designTimeModel.quality.maxTokens' */
  updateField: (fieldPath: string, value: unknown) => void

  /** Clear field value */
  clearField: (fieldName: string) => void

  /** Fetch data for the entity type (dispatches loadAll action) */
  fetch: () => void

  /** Get field descriptor by name */
  getField: (fieldName: string) => IFieldDescriptor<unknown>

  /** Validate field (after blur) */
  validateField: (fieldName: string) => Validator

  /** Pre-validate field (while typing) */
  preValidateField: (fieldName: string, value: unknown) => Validator

  /** Get validators for field(s) */
  getValidations: (fieldName?: string) => Validator[]
}
