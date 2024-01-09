export function getWordToReplace(element: HTMLElement): string {
  let word = "";

  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    word = (element as HTMLInputElement | HTMLTextAreaElement).value;
  } else if (element.isContentEditable) {
    word = element.innerText;
  }

  const words = word.split(/\s+/);
  return words[words.length - 1];
}

export function createSuggestionsPopup(
  suggestions: string[],
  target: HTMLElement
): HTMLElement {
  const popupDiv = document.createElement("div");
  popupDiv.className = "suggestions-popup";
  popupDiv.style.position = "absolute";

  const rect = target.getBoundingClientRect();
  popupDiv.style.top = `${rect.bottom}px`;
  popupDiv.style.left = `${rect.left}px`;

  const ul = document.createElement("ul");
  ul.style.listStyleType = "none";
  ul.style.padding = "0";

  suggestions.forEach((suggestion, index) => {
    const li = document.createElement("li");
    li.style.cursor = "pointer";
    li.textContent = suggestion;
    li.style.padding = "10px 15px";
    li.style.borderBottom = "1px solid #ccc";
    li.style.backgroundColor = "#f8f8f8";

    li.style.transition = "background-color 0.3s ease";
    li.addEventListener("mouseenter", () => {
      li.style.backgroundColor = "#f0f0f0";
    });

    li.addEventListener("mouseleave", () => {
      li.style.backgroundColor = "";
    });

    ul.appendChild(li);
  });

  popupDiv.appendChild(ul);

  popupDiv.style.backgroundColor = "#fff";
  popupDiv.style.border = "1px solid #ccc";
  popupDiv.style.borderRadius = "5px";
  popupDiv.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
  popupDiv.style.maxHeight = "250px";
  popupDiv.style.overflowY = "auto";
  popupDiv.style.zIndex = "1000";
  document.body.appendChild(popupDiv);

  return popupDiv;
}

export function updateSuggestionsUI(
  ul: HTMLUListElement,
  suggestions: string[],
  selectedIndex: number
): void {
  const lis = ul.querySelectorAll("li");
  lis.forEach((li, index) => {
    if (index === selectedIndex) {
      li.style.backgroundColor = "#f0f0f0";
    } else {
      li.style.backgroundColor = "";
    }
  });
}

export function hideSuggestions(popupDiv: HTMLElement): void {
  if (popupDiv && popupDiv.parentNode === document.body) {
    document.body.removeChild(popupDiv);
  }
}
