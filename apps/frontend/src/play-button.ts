export function setupPlayButton(name: string, id: string, play: () => void) {
  const element = document.querySelector<HTMLButtonElement>(`#${id}`);
  if (!element) {
    console.error(`Could not locate button name: ${name} id: ${id}`);
    return;
  }
  element.innerHTML = name;
  element.addEventListener("click", play);
}
