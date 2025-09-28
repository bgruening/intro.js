import { TooltipPosition } from "../../packages/tooltip";
import { HintItem, HintPosition } from "./hintItem";
import {
  Translator,
  Language,
  LanguageCode,
  getLanguageByCode,
} from "../../i18n/language";
import enUS from "../../i18n/en_US";

export interface HintOptions {
  /* List of all HintItems */
  hints: Partial<HintItem>[];
  /* True if the Hint instance is set to active */
  isActive: boolean;
  /* Default tooltip box position */
  tooltipPosition: string;
  /* Next CSS class for tooltip boxes */
  tooltipClass: string;
  /* Default hint position */
  hintPosition: HintPosition;
  /* Hint button label */
  hintButtonLabel: string;
  /* Display the "Got it" button? */
  hintShowButton: boolean;
  /* Hints auto-refresh interval in ms (set to -1 to disable) */
  hintAutoRefreshInterval: number;
  /* Adding animation to hints? */
  hintAnimation: boolean;
  /* additional classes to put on the buttons */
  buttonClass: string;
  /* Set how much padding to be used around helper element */
  helperElementPadding: number;
  /* To determine the tooltip position automatically based on the window.width/height */
  autoPosition: boolean;
  /* Precedence of positions, when auto is enabled */
  positionPrecedence: TooltipPosition[];
  /* Optional property to determine if content should be rendered as HTML */
  tooltipRenderAsHtml?: boolean;
  /* Optional property to set the language of the hint.
   Can be a Language object for custom languages or a language code string for built-in languages.
   Built-in language codes: "en_US", "es_ES", "fr_FR", "de_DE", "fa_IR"
   Defaults to the user's browser language if not provided. */
  language?: Language | LanguageCode;
}

export function getDefaultHintOptions(
  language: Language | LanguageCode = enUS
): HintOptions {
  // Convert language code to Language object if needed
  const languageObj =
    typeof language === "string" ? getLanguageByCode(language) : language;
  const translator = new Translator(languageObj);

  return {
    hints: [],
    isActive: true,
    tooltipPosition: "bottom",
    tooltipClass: "",
    hintPosition: "top-middle",
    hintButtonLabel: translator.translate("buttons.done"), // Use "Done" for hints
    hintShowButton: true,
    hintAutoRefreshInterval: 10,
    hintAnimation: true,
    buttonClass: "introjs-button",
    helperElementPadding: 10,
    autoPosition: true,
    positionPrecedence: ["bottom", "top", "right", "left"],
    tooltipRenderAsHtml: true,
    language: languageObj,
  };
}
