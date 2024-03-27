/*
 * Copyright 2023 Google LLC
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

export const AUDIO_STICKER_WIDTH_PRESETS = {
  SMALL: 120,
  LARGE: 180,
};

export const AUDIO_STICKER_ASPECT_RATIOS = {
  'headphone-cat': 1.24,
  'tape-player': 1.18,
  'loud-speaker': 1,
  'audio-cloud': 1.54,
};

export const AUDIO_STICKER_DEFAULT_PRESET = {
  x: 100,
  y: 100,
  width:
    AUDIO_STICKER_WIDTH_PRESETS.SMALL *
    AUDIO_STICKER_ASPECT_RATIOS['headphone-cat'],
  height: AUDIO_STICKER_WIDTH_PRESETS.SMALL,
  sticker: 'headphone-cat',
  size: 'small',
};
