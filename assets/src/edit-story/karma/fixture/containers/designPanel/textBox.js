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
 * The text box panel.
 */
export class TextBox extends AbstractPanel {
  constructor(node, path) {
    super(node, path);
  }

  get collapse() {
    return this.getByRole('button', { name: 'Text box' });
  }

  get fill() {
    return this._get(
      this.getByRole('checkbox', { name: /Set text background mode: Fill/i }),
      'fill',
      Toggle
    );
  }

  // @todo: add remaining input options:
  // * fill style
  // * background color
  // * padding (lock ratio, combined padding and individual paddings)
}
