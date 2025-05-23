import { mp4boxPlay } from "./mp4box-play.ts";
import { simpleMsePlay } from "./simple-mse-play.ts";
import { setupPlayButton } from "./play-button.ts";
import { byteRangePlay } from "./byterange-mse-play.ts";

setupPlayButton("Simple MSE Play", "simple", simpleMsePlay);
setupPlayButton("MP4Box Parse and Play", "mp4box", mp4boxPlay);
setupPlayButton("Byterange MSE Play", "byte", byteRangePlay);
