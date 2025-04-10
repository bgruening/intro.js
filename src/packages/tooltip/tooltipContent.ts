import dom from "../dom";

const { div } = dom.tags;

export type tooltipContentProps = {
    text: string;
    tooltipRenderAsHtml: boolean;
 };

export const tooltipContetnt = ({ text, tooltipRenderAsHtml }: tooltipContentProps) => {
  const container = div({});

  dom.derive(() => {
    const el = container as HTMLElement;
    if (!el) return;

    // Clear existing content
    el.innerHTML = '';

    if (tooltipRenderAsHtml && text) {
      const fragment = document.createRange().createContextualFragment(text);
      el.appendChild(fragment);
    } else {
      el.textContent = text;
    }
  });

  return container;
};
