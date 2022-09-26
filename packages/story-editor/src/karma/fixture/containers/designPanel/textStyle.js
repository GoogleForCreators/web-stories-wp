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
import { ToggleButton, Select, Color } from '../common';
import { Container } from '../container';
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
      this.getByRole('button', { name: /Bold/ }),
      'bold',
      ToggleButton
    );
  }

  get italic() {
    return this._get(
      this.getByRole('button', { name: /Italic/ }),
      'italic',
      ToggleButton
    );
  }

  get underline() {
    return this._get(
      this.getByRole('button', { name: /Underline/ }),
      'underline',
      ToggleButton
    );
  }

  get uppercase() {
    return this._get(
      this.getByRole('button', { name: /Uppercase/ }),
      'uppercase',
      ToggleButton
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

  align(name) {
    return this.getByRole('button', { name });
  }

  get padding() {
    return this.getByRole('textbox', { name: /Padding/ });
  }

  get fontColor() {
    const color = this._get(
      this.getByRole('region', { name: /Color input: Text/ }),
      'fontColor',
      Color
    );
    color.label = 'Text color';
    return color;
  }

  get backgroundColor() {
    const bgColor = this._get(
      this.getByRole('region', { name: /Color input: Background color/ }),
      'backgroundColor',
      Color
    );
    bgColor.label = 'Background color';
    return bgColor;
  }

  get fontSize() {
    return this.getByRole('textbox', { name: /Font size/ });
  }

  get collapse() {
    return this.getByRole('button', { name: 'Text' });
  }

  get adaptiveColor() {
    return this.getByRole('button', { name: /Adaptive text colors/ });
  }

  get fill() {
    return this.getByRole('option', { name: /fill/i });
  }

  get addStyle() {
    return this.getByRole('button', { name: /Add style/ });
  }

  get applyStyle() {
    return this.getByRole('button', { name: /Apply style/ });
  }

  get presets() {
    return this.getAllByRole('button', { name: /Apply style/ });
  }

  get moreStyles() {
    return this.getByRole('button', { name: /More styles/ });
  }

  get styleManager() {
    return this._get(
      this.getByRoleIn(this.node.ownerDocument, 'dialog', {
        name: /Style presets manager/,
      }),
      'styleManager',
      StyleManager
    );
  }

  // @todo: add remaining input options:
  // * font family and size
  // * justify toggles
}

class StyleManager extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get apply() {
    return this.getByRole('button', { name: /Apply style/ });
  }

  get presets() {
    return this.getAllByRole('button', { name: /Apply style/ });
  }

  get delete() {
    return this.getByRole('button', { name: /Delete style/ });
  }

  get edit() {
    return this.getByRole('button', { name: /Edit style/ });
  }

  get exit() {
    return this.getByRole('button', { name: /Exit edit mode/ });
  }
}
