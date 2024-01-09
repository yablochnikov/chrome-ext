import { SuggestionsHandler } from "./../classes/Suggestions";

const suggestionsHandler = new SuggestionsHandler();
document.addEventListener(
  "focus",
  suggestionsHandler.handleFocusedElement.bind(suggestionsHandler),
  true
);
