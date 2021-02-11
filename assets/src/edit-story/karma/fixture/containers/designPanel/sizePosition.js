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
import { Toggle } from '../common';
import { AbstractPanel } from './abstractPanel';

/**
 * The size position panel containing inputs for adding managing the size, position and rotationAngle.
 */
export class SizePosition extends AbstractPanel {
  constructor(node, path) {
    super(node, path);
  }

  get width() {
    return this.getByRole('textbox', { name: /Width/i });
  }

  get height() {
    return this.getByRole('textbox', { name: /Height/i });
  }

  get lockAspectRatio() {
    return this._get(
      this.getByRole('checkbox', { name: /Aspect ratio lock/ }),
      'italic',
      Toggle
    );
  }

  get rotate() {
    // @todo Implement.
    return null;
  }
}
