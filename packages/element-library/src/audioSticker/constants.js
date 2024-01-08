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
/**
 * External dependencies
 */
import { PanelTypes } from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { SHARED_DEFAULT_ATTRIBUTES } from '../shared';
import headphoneCat from './sticker-images/headphone-cat/headphone-cat-pretap.png';
import tapePlayer from './sticker-images/tape-player/tape-player-pretap.png';
import loudSpeaker from './sticker-images/loud-speaker/loud-speaker-posttap.png';
import audioCloud from './sticker-images/audio-cloud/audio-cloud-posttap.png';

export const hasEditMode = false;
export const hasEditModeIfLocked = false;
export const hasEditModeMoveable = false;
export const editModeGrayout = false;

export const hasDesignMenu = true;

export const hasDuplicateMenu = false;

export const isMedia = false;

export const canFlip = true;

export const isMaskable = false;

export const isAspectAlwaysLocked = true;

export const resizeRules = {
  vertical: false,
  horizontal: false,
  diagonal: false,
};

export const AUDIO_STICKERS = {
  'headphone-cat': headphoneCat,
  'tape-player': tapePlayer,
  'loud-speaker': loudSpeaker,
  'audio-cloud': audioCloud,
};

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

export const defaultAttributes = {
  ...SHARED_DEFAULT_ATTRIBUTES,
  size: 'small',
  sticker: 'headphone-cat',
  style: 'none',
  lockDimensions: true,
};

export const panels = [PanelTypes.ElementAlignment, PanelTypes.AudioSticker];
