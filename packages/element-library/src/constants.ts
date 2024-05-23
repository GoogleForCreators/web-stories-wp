/*
 * Copyright 2022 Google LLC
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

/**
 * External dependencies
 */
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import headphoneCat from './audioSticker/images/headphone-cat/headphone-cat-pretap.png';
import tapePlayer from './audioSticker/images/tape-player/tape-player-pretap.png';
import loudSpeaker from './audioSticker/images/loud-speaker/loud-speaker-posttap.png';
import audioCloud from './audioSticker/images/audio-cloud/audio-cloud-posttap.png';

// TODO: Move to audioSticker folder once TypeScript conversion is complete.
// See https://github.com/GoogleForCreators/web-stories-wp/pull/13503.
export const AUDIO_STICKERS: Record<string, string> = {
  'headphone-cat': headphoneCat,
  'tape-player': tapePlayer,
  'loud-speaker': loudSpeaker,
  'audio-cloud': audioCloud,
} as const;

export const AUDIO_STICKER_STYLES = {
  none: '',
  outline: 'border: 4px solid white; border-radius: 20px',
  dropshadow: 'filter: drop-shadow(2px 2px 10px white)',
};

export const AUDIO_STICKER_LABELS = {
  'headphone-cat': {
    label: __('Headphone Cat', 'web-stories'),
  },
  'tape-player': {
    label: __('Tape Player', 'web-stories'),
  },
  'loud-speaker': {
    label: __('Loud Speaker', 'web-stories'),
  },
  'audio-cloud': {
    label: __('Audio Cloud', 'web-stories'),
  },
};

export const DEFAULT_ATTRIBUTES_FOR_MEDIA = {
  scale: 100,
  focalX: 50,
  focalY: 50,
};
