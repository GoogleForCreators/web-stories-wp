/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// See http://www.matthewflickinger.com/lab/whatsinagif/bits_and_bytes.asp.
const BLOCK_TERMINATOR = 0x00;
const EXTENSION_INTRODUCER = 0x21;
const GRAPHIC_CONTROL_LABEL = 0xf9;

/**
 *
 * Loosely based on https://www.npmjs.com/package/animated-gif-detector (MIT-compatible ISC license)
 *
 * See http://www.matthewflickinger.com/lab/whatsinagif/bits_and_bytes.asp for how GIFs are structured.
 *
 * @param {ArrayBuffer} buffer The GIF ArrayBuffer instance.
 * @return {boolean} Whether this is an animated GIF or not.
 */
function isAnimatedGif(buffer: ArrayBuffer): boolean {
  const arr = new Uint8Array(buffer);
  let frames = 0;

  // Make sure it's a GIF and skip early if it isn't.
  // 47="G", 49="I", 46="F", 38="8"
  if (
    arr[0] !== 0x47 ||
    arr[1] !== 0x49 ||
    arr[2] !== 0x46 ||
    arr[3] !== 0x38
  ) {
    return false;
  }

  for (let i = 4; i < arr.length; i++) {
    // We reached a new block, increase frame count.
    if (
      arr[i] === BLOCK_TERMINATOR &&
      arr[i + 1] === EXTENSION_INTRODUCER &&
      arr[i + 2] === GRAPHIC_CONTROL_LABEL
    ) {
      frames++;
    }
  }

  return frames > 1;
}

export default isAnimatedGif;
