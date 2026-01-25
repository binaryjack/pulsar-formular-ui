/// <reference path="../../../pulsar.dev/pulsar.d.ts" />

/**
 * Portal component type definitions
 * For content projection and slot-based rendering
 */

/**
 * Props for PortalSlot component
 * Defines a target location where portal content can be rendered
 */
export interface IPortalSlotProps {
  /** Unique identifier for this slot (e.g., 'form-a', 'form-b') */
  readonly id: string
  
  /** Slot name/category (e.g., 'commands', 'actions', 'footer') */
  readonly name: string
  
  /** Additional CSS classes for the slot container */
  readonly className?: string
}

/**
 * Props for Portal component
 * Renders children at a matching PortalSlot location
 */
export interface IPortalProps {
  /** ID to match with PortalSlot (e.g., form.id) */
  readonly id: string
  
  /** Target slot name to render into (e.g., 'commands') */
  readonly target: string
  
  /** Content to render in the portal */
  readonly children: JSX.Children
}
