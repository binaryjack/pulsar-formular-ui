/**
 * Form context implementation
 * Provides form operations and field access throughout the component tree
 */

import { createContext } from '@pulsar-framework/pulsar.dev';
import type { IFormContext } from '../../types';

/**
 * Form context
 * Must be provided by FormProvider
 *
 * @template T - The shape of the form data
 */
export const FormContext = createContext<IFormContext<any> | undefined>(undefined);
