import { LANGUAGE_NAMES } from '../data/languages';

export function createAnswerOptions(
  options: string[],
  onSelect: (code: string) => void,
  disabled: boolean = false
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'answer-options';

  options.forEach((code) => {
    const button = document.createElement('button');
    button.className = 'option-button';
    button.textContent = LANGUAGE_NAMES[code] || code;
    button.disabled = disabled;
    button.dataset.code = code;
    button.addEventListener('click', () => {
      if (!button.disabled) {
        onSelect(code);
      }
    });
    container.appendChild(button);
  });

  return container;
}

export function revealAnswer(
  container: HTMLElement,
  correctCode: string,
  selectedCode: string
): void {
  const buttons = container.querySelectorAll('.option-button');
  buttons.forEach((btn) => {
    const button = btn as HTMLButtonElement;
    const code = button.dataset.code;

    if (code === correctCode) {
      button.classList.add('option-button--correct');
    } else if (code === selectedCode && code !== correctCode) {
      button.classList.add('option-button--incorrect');
    } else {
      button.classList.add('option-button--revealed');
    }

    button.disabled = true;
  });
}
