/*
 * Copyright 2021 Google LLC
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
import { Container } from './container';
import { ToggleButton, Color } from './common';

export class DesignMenu extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get flipVertical() {
    return this._get(
      this.getByRole('menuitem', { name: 'Flip vertically' }),
      'flipVertical',
      ToggleButton
    );
  }

  get flipHorizontal() {
    return this._get(
      this.getByRole('menuitem', { name: 'Flip horizontally' }),
      'flipHorizontal',
      ToggleButton
    );
  }

  get borderRadius() {
    return this.queryByRole('textbox', { name: 'Corner Radius' });
  }

  get borderWidth() {
    return this.queryByRole('textbox', { name: 'Border width' });
  }

  get borderColor() {
    const region = this.queryByRole('region', {
      name: 'Color input (floating menu): Border color',
    });
    if (!region) {
      return null;
    }
    const element = this._get(region, 'borderColor', Color);
    element.label = 'Border color';
    return element;
  }

  get swapMedia() {
    return this.getByRole('menuitem', { name: 'Replace media' });
  }

  get loop() {
    return this.getByRole('checkbox', { name: 'Loop' });
  }

  get textAlign() {
    return this.getByRole('menuitem', { name: 'Change text alignment' });
  }

  textAlignIcon(name) {
    return this.getByRoleIn(this.textAlign, 'img', { name });
  }

  textAlignOption(name) {
    const dialog = this.getByRole('dialog', { name: 'Text alignment options' });
    return this.getByRoleIn(dialog, 'menuitem', { name });
  }

  get fontSize() {
    return this.getByRole('textbox', { name: /Font size/ });
  }

  get fontColor() {
    const region = this.queryByRole('region', {
      name: 'Color input (floating menu): Text color',
    });
    if (!region) {
      return null;
    }
    const element = this._get(region, 'textColor', Color);
    element.label = 'Text color';
    return element;
  }

  get opacity() {
    return this.getByRole('textbox', { name: /^Opacity in percent$/ });
  }

  get bold() {
    return this._get(
      this.getByRole('menuitem', { name: /Toggle bold/ }),
      'toggleBold',
      ToggleButton
    );
  }

  get italic() {
    return this._get(
      this.getByRole('menuitem', { name: /Toggle italic/ }),
      'toggleItalic',
      ToggleButton
    );
  }

  get underline() {
    return this._get(
      this.getByRole('menuitem', { name: /Toggle underline/ }),
      'toggleUnderline',
      ToggleButton
    );
  }

  get more() {
    return this.getByRole('menuitem', { name: /^More$/ });
  }
}
