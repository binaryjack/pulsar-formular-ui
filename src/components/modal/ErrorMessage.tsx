/**
 * ErrorMessage component
 * Individual error message for .map() usage
 */

interface IErrorMessageProps {
  readonly text: string;
  readonly key?: string | number;
}

/**
 * ErrorMessage - Displays a single validation error
 */
export const ErrorMessage = ({ text }: IErrorMessageProps): HTMLElement => {
  return (
    <div className="text-red-600 text-sm mt-1 flex items-start">
      <span className="mr-1">✕</span>
      <span>{text}</span>
    </div>
  );
};
