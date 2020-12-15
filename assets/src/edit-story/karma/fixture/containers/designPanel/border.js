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
import { Color, Radio, Toggle } from '../common';
import { AbstractPanel } from './abstractPanel';

/**
 * The size position panel containing inputs for adding managing the size, position and rotationAngle.
 */
export class Border extends AbstractPanel {
  constructor(node, path) {
    super(node, path);
  }

  width(side = null) {
    return this.getByRole('textbox', {
      name: side ? `${side} border` : 'Border',
    });
  }

  position(mode) {
    return this._get(
      this.getByRole('radio', { name: `Border position mode: ${mode}` }),
      'borderPosition',
      Radio
    );
  }

  get lockBorderWidth() {
    return this._get(
      this.getByRole('checkbox', { name: /Toggle border ratio lock/ }),
      'borderLock',
      Toggle
    );
  }

  get borderColor() {
    return this._get(
      this.getByRole('region', { name: /Color input: Border color/ }),
      'borderColor',
      Color
    );
  }
}
