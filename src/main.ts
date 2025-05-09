import "./style.css";
import "/vite.svg";
import { setupCounter } from "./counter.ts";
import { playVideo } from "./video.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Vite + TypeScript + MSE</h1>
    <div class="card">
      <video id="video" controls/>
      <button id="counter" type="button"></button>
    </div>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
playVideo();
