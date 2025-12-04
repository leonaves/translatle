import { App } from './app';

async function main() {
  const container = document.getElementById('app');
  if (!container) {
    throw new Error('App container not found');
  }

  const app = new App(container);
  await app.initialize();
}

main().catch((error) => {
  console.error('Failed to initialize app:', error);
  const container = document.getElementById('app');
  if (container) {
    container.innerHTML = `
      <div class="splash">
        <h1 class="splash__title">Oops!</h1>
        <p>Something went wrong loading the game.</p>
        <button class="start-button" onclick="location.reload()">Try Again</button>
      </div>
    `;
  }
});
