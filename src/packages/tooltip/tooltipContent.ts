import dom from "../dom";

export type TooltipContentProps = {
  /**
   * The text content to be displayed in the tooltip.
   */
  text: string;
  /**
   * The container element where the tooltip content will be rendered.
   */
  container: HTMLElement;
  /**
   * If true, the text will be rendered as HTML.
   */
  tooltipRenderAsHtml?: boolean;
};

/**
 * TooltipContent component renders the content of a tooltip.
 * It can render plain text or HTML based on the `tooltipRenderAsHtml` flag.
 */
export const TooltipContent = ({
  text,
  container,
  tooltipRenderAsHtml,
}: TooltipContentProps) => {
  dom.derive(() => {
    const el = container as HTMLElement;
    if (!el) return;

    // Clear existing content
    el.innerHTML = "";

    if (tooltipRenderAsHtml && text) {
      const fragment = document.createRange().createContextualFragment(text);
      el.appendChild(fragment);
    } else {
      el.textContent = text;
    }
  });

  return container;
};
