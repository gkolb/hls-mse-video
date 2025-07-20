import { mp4boxPlay } from './mp4box-play.ts';
import { simpleMsePlay } from './simple-mse-play.ts';
import { setupPlayButton } from './play-button.ts';
import { byteRangePlay } from './byterange-mse-play.ts';
import { byteRangePlay } from './byterange-mse-play.ts';
import { byteParse } from './byte-parse.js';

setupPlayButton('Simple MSE Play', 'simple', simpleMsePlay);
setupPlayButton('MP4Box Parse and Play', 'mp4box', mp4boxPlay);
setupPlayButton('Byterange MSE Play', 'byte', byteRangePlay);
setupPlayButton('Manual mp4 parse', 'parse', byteParse);
