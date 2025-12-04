export function createSplashScreen(onStart: () => void): HTMLElement {
  const container = document.createElement('div');
  container.className = 'splash';
  container.innerHTML = `
    <img src="/lokalise-logo.svg" alt="Lokalise" class="splash__logo" />
    <h1 class="splash__title">Translatle</h1>
    <p class="splash__subtitle">A daily emoji translation game</p>

    <div class="how-to-play">
      <h2 class="how-to-play__title">How to Play</h2>
      <ol class="how-to-play__list">
        <li class="how-to-play__item">
          <span class="how-to-play__number">1</span>
          <span>You'll see an emoji and its name in a foreign language</span>
        </li>
        <li class="how-to-play__item">
          <span class="how-to-play__number">2</span>
          <span>Guess which language the name is in from 4 options</span>
        </li>
        <li class="how-to-play__item">
          <span class="how-to-play__number">3</span>
          <span>Complete all 5 rounds as fast as you can!</span>
        </li>
      </ol>
    </div>

    <button class="start-button">Play</button>
  `;

  container.querySelector('.start-button')!.addEventListener('click', onStart);

  return container;
}
