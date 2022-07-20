/*
 * Copyright 2020 Google LLC
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

/**
 * The page background panel containing inputs flipping and detaching images as well as setting bg color.
 */
export class PageBackgroundAudio extends AbstractPanel {
  constructor(node, path) {
    super(node, path);
  }

  get uploadButton() {
    return this.getByRole('button', {
      name: /upload an audio file/i,
    });
  }

  get hotlinkButton() {
    return this.getByRole('button', {
      name: /link to audio file/i,
    });
  }
}
