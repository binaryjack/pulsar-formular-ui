/**
 * Field component prop types
 * Shared interfaces for field components
 */

/**
 * Field options for integrated components
 * Controls debugging and loading states
 */
export interface IFieldOptions {
  /** Enable debug mode to show field state information */
  readonly debug: boolean;

  /** Show skeleton loader instead of field */
  readonly loading: boolean;
}

/**
 * Default field options factory
 */
export const fieldOptions: IFieldOptions = {
  debug: false,
  loading: false,
};

/**
 * Base props for primitive field components (F-prefixed)
 * These components bind directly to Formular fields via context
 */
export interface IFieldComponentProps {
  /** Name of the field (must match field descriptor name) */
  readonly name: string;

  /** Show skeleton loader */
  readonly loading?: boolean;

  /** Additional CSS classes */
  readonly className?: string;
}

/**
 * Props for integrated field components (Field-suffixed wrappers)
 * These wrap primitives with Label + ValidationResults + Debug
 */
export interface IFieldSetProps {
  /** Name of the field (must match field descriptor name) */
  readonly name: string;

  /** Field options for debug and loading */
  readonly options?: IFieldOptions;
}

/**
 * Props for select field components
 */
export interface ISelectFieldProps extends IFieldComponentProps {
  /** Placeholder text for the select */
  readonly placeholder?: string;
}

/**
 * Props for radio button components
 */
export interface IRadioButtonProps extends IFieldComponentProps {
  /** Value of this specific radio button */
  readonly value: any;

  /** Label for this radio button */
  readonly label?: string;
}

/**
 * Props for checkbox field components
 */
export interface ICheckboxFieldProps extends IFieldComponentProps {
  /** Label for the checkbox */
  readonly label?: string;
}
