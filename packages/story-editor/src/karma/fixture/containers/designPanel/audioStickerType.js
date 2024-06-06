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
 * Internal dependencies
 */
import { AbstractPanel } from './abstractPanel';

export class AudioStickerType extends AbstractPanel {
  constructor(node, path) {
    super(node, path);
  }

  get sectionHeading() {
    return this.getByRole('button', { name: /Type/i });
  }

  get headphoneCat() {
    return this.getByRole('button', { name: /Sticker Type: Headphone Cat/i });
  }

  get tapePlayer() {
    return this.getByRole('button', { name: /Sticker Type: Tape Player/i });
  }

  get loudSpeaker() {
    return this.getByRole('button', { name: /Sticker Type: Loud Speaker/i });
  }

  get audioCloud() {
    return this.getByRole('button', { name: /Sticker Type: Audio Cloud/i });
  }
}
