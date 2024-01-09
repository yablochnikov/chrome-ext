import {
  getWordToReplace,
  createSuggestionsPopup,
  updateSuggestionsUI,
  hideSuggestions,
} from "../utils/helpers";
import { replaceDictionary } from "../utils/constants";

export class SuggestionsHandler {
  private focusedInput: HTMLInputElement | null = null;
  private replaceDictionary: { [key: string]: string[] };

  constructor() {
    this.replaceDictionary = replaceDictionary;
  }

  isInputElement(element: HTMLElement): boolean {
    return (
      element.tagName === "INPUT" &&
      (element as HTMLInputElement).type !== "hidden"
    );
  }

  isTextAreaElement(element: HTMLElement): boolean {
    return element.tagName === "TEXTAREA";
  }

  isContentEditableElement(element: HTMLElement): boolean {
    return element.isContentEditable;
  }

  getSuggestions(currentWord: string): string[] {
    const lowercaseWord = currentWord.toLowerCase();
    return this.replaceDictionary[lowercaseWord] || [];
  }

  handleFocusedElement(event: Event) {
    const focusedElement = event.target as HTMLElement;

    if (
      this.isInputElement(focusedElement) ||
      this.isTextAreaElement(focusedElement) ||
      this.isContentEditableElement(focusedElement)
    ) {
      this.focusedInput = focusedElement as HTMLInputElement;

      focusedElement.removeEventListener("keydown", this.handleKeyDown);
      focusedElement.addEventListener("keydown", this.handleKeyDown.bind(this));
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    let suggestions: string[] = [];

    if (event.key === " ") {
      const currentWord = getWordToReplace(target);
      suggestions = this.getSuggestions(currentWord);

      if (suggestions.length > 0) {
        this.showSuggestions(suggestions, target);
      }
    } else if (event.key === "Enter") {
      const popupDiv = document.querySelector(
        ".suggestions-popup"
      ) as HTMLElement;
      const selectedIndex = popupDiv?.dataset.selectedIndex;

      if (selectedIndex !== undefined && this.focusedInput) {
        hideSuggestions(popupDiv);
      }
    }
  }

  showSuggestions(suggestions: string[], target: HTMLElement): void {
    let popupDiv = document.querySelector(".suggestions-popup") as HTMLElement;

    if (!popupDiv) {
      popupDiv = createSuggestionsPopup(suggestions, target);

      const ul = popupDiv.querySelector("ul");
      let selectedIndex = -1;

      const handleSuggestionSelect = (index: number) => {
        selectedIndex = index;
        const selectedSuggestion = suggestions[selectedIndex];
        if (this.focusedInput?.isContentEditable) {
          const currentText = this.focusedInput.innerHTML;
          const words = currentText.split(" ");
          words[words.length - 1] = selectedSuggestion;
          this.focusedInput.textContent = words.join(" ");
        } else if (this.focusedInput) {
          const currentValue = this.focusedInput.value;
          const words = currentValue.split(" ");
          words[words.length - 1] = selectedSuggestion;
          this.focusedInput.value = words.join(" ");
        }

        hideSuggestions(popupDiv);
        this.focusedInput?.focus();
      };

      if (ul) {
        ul.setAttribute("tabindex", "0");
        ul.focus();

        ul.addEventListener("keydown", (event) => {
          if (event.key === "ArrowUp") {
            selectedIndex = Math.max(selectedIndex - 1, 0);
            updateSuggestionsUI(ul, suggestions, selectedIndex);
          } else if (event.key === "ArrowDown") {
            selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
            updateSuggestionsUI(ul, suggestions, selectedIndex);
          } else if (event.key === "Enter") {
            handleSuggestionSelect(selectedIndex);
          }
        });

        ul.addEventListener("click", (event) => {
          const clickedIndex = Array.from(ul.children).indexOf(
            event.target as HTMLElement
          );
          handleSuggestionSelect(clickedIndex);
        });
      }
    } else {
      updateSuggestionsUI(
        popupDiv.querySelector("ul") as HTMLUListElement,
        suggestions,
        -1
      );
    }
  }
}
