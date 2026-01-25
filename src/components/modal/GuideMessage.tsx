/**
 * GuideMessage component
 * Individual guide message for .map() usage
 */

interface IGuideMessageProps {
  readonly text: string;
  readonly key?: string | number;
}

/**
 * GuideMessage - Displays a single validation guide
 */
export const GuideMessage = ({ text }: IGuideMessageProps): HTMLElement => {
  return (
    <div className="text-blue-600 text-sm mt-1 flex items-start">
      <span className="mr-1">ℹ</span>
      <span>{text}</span>
    </div>
  );
};
