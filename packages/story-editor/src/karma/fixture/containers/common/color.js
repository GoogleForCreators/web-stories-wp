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
import { Container } from '../container';

/**
 * The color input containing both a button to open color picker, a hex input and an opacity input
 */
export class Color extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get button() {
    return this.getByRole('button', { name: 'Text color' });
  }

  get opacity() {
    return this.getByRole('textbox', { name: /Opacity/i });
  }

  get hex() {
    return this.getByRole('textbox', { name: 'Text color' });
  }

  get output() {
    return this.button.innerText;
  }

  get picker() {
    return this._get(
      this.getByRoleIn(this.node.ownerDocument, 'dialog', {
        name: /Color and gradient picker/,
      }),
      'picker',
      ColorPicker
    );
  }
}

class ColorPicker extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get hexButton() {
    return this.getByRole('button', { name: /Edit hex value/i });
  }

  get hexInput() {
    return this.getByRole('textbox', { name: /Edit hex value/i });
  }

  get opacityButton() {
    return this.getByRole('button', { name: /Edit opacity value/i });
  }

  get opacityInput() {
    return this.getByRole('textbox', { name: /Edit opacity value/i });
  }

  get saveColor() {
    return this.getByRole('button', { name: /Add color/i });
  }

  applySavedColor(type) {
    return this.getByRole('button', { name: `Apply ${type} color` });
  }

  get colorTypeSelect() {
    return this.getByRole('button', { name: 'Select color type' });
  }

  // @todo: add accessors for remaining options
}
