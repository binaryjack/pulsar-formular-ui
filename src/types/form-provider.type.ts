/// <reference path="../../../pulsar.dev/pulsar.d.ts" />

/**
 * FormProvider component prop types
 */

import type { IFormular } from '@pulsar-framework/formular.dev';

/**
 * Props for the FormProvider component
 *
 * @template T - The shape of the form data
 */
export interface IFormProviderProps<T extends object> {
  /** The form instance to provide context for */
  readonly form?: IFormular<T>;

  /** Initial data to populate the form with */
  readonly data?: T;

  /** Callback when form is saved (after validation) */
  readonly onSaveCallback: () => void;

  /** Callback when user quits/cancels the form */
  readonly onQuitCallback: () => void;

  /** Child components that will be rendered within the form (or a thunk returning children) */
  readonly children: JSX.Children;
}

/**
 * Modal command types for FormProvider
 */
export enum ModaleCommands {
  YesCancel = 'yes-cancel',
  OkCancel = 'ok-cancel',
  Ok = 'ok',
}

/**
 * Modal style types
 */
export enum ModaleStyle {
  Primary = 'primary',
  Secondary = 'secondary',
  Warning = 'warning',
  Danger = 'danger',
  Info = 'info',
}

/**
 * Modal result interface
 */
export interface IModaleResult {
  readonly Yes?: boolean;
  readonly No?: boolean;
  readonly Ok?: boolean;
  readonly Cancel?: boolean;
}

/**
 * Translation keys for form messages
 */
export enum FormModaleMessagesTranslationKeyEnum {
  OnQuitMessageKey = 'form.quit.confirm',
  OnResetMessageKey = 'form.reset.confirm',
}
