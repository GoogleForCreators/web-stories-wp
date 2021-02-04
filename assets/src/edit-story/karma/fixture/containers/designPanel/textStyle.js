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
import { Toggle, Select, Color } from '../common';
import { AbstractPanel } from './abstractPanel';

/**
 * The text style panel containing inputs, toggles, dropdowns and other form elements
 * to view and manipulate the style of one or more currently selected text elements.
 */
export class TextStyle extends AbstractPanel {
  constructor(node, path) {
    super(node, path);
  }

  get bold() {
    return this._get(
      this.getByRole('checkbox', { name: /Toggle: bold/ }),
      'bold',
      Toggle
    );
  }

  get italic() {
    return this._get(
      this.getByRole('checkbox', { name: /Toggle: italic/ }),
      'italic',
      Toggle
    );
  }

  get underline() {
    return this._get(
      this.getByRole('checkbox', { name: /Toggle: underline/ }),
      'underline',
      Toggle
    );
  }

  get fontWeight() {
    return this._get(
      this.getByRole('button', { name: /Font weight/ }),
      'fontWeight',
      Select
    );
  }

  get letterSpacing() {
    return this.getByRole('textbox', { name: /Letter-spacing/ });
  }

  get lineHeight() {
    return this.getByRole('textbox', { name: /Line-height/ });
  }

  get fontColor() {
    return this._get(
      this.getByRole('region', { name: /Color input: Text/ }),
      'fontColor',
      Color
    );
  }

  get fontSize() {
    return this.getByRole('textbox', { name: /Font size/ });
  }

  get collapse() {
    return this.getByRole('button', { name: 'Style' });
  }

  get fill() {
    return this._get(
      this.getByRole('checkbox', { name: /Set text background mode: Fill/i }),
      'fill',
      Toggle
    );
  }

  // @todo: add remaining input options:
  // * font family and size
  // * justify toggles
  // * fill style
  // * background color
  // * padding (lock ratio, combined padding and individual paddings)
}
