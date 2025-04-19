import dom from "../dom";

const { div } = dom.tags;

export type tooltipContentProps = {
  text: string;
  tooltipRenderAsHtml?: boolean;
  className?: string;
};

export const TooltipContent = ({
  text,
  tooltipRenderAsHtml,
  className,
}: tooltipContentProps) => {
  const container = div({
    className: className || "introjs-tooltiptext",
  });

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
