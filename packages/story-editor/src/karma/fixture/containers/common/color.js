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

  label = 'Unset';

  get button() {
    return this.getByRole('button', { name: this.label });
  }

  get opacity() {
    return this.getByRole('textbox', { name: /Opacity/i });
  }

  get hex() {
    return this.getByRole('textbox', { name: this.label });
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

  applySavedColor(pattern) {
    return this.getByRole('option', {
      name: pattern,
    });
  }

  addSavedColor(type) {
    return this.getByRole('button', { name: `Add ${type} color` });
  }

  get colorTypeSelect() {
    return this.getByRole('button', { name: 'Select color type' });
  }

  get eyedropper() {
    return this.getByRole('button', { name: /Pick a color from canvas/i });
  }

  get editButton() {
    return this.getByRole('button', { name: /Edit colors/ });
  }

  get exitEditButton() {
    return this.getByRole('button', { name: /Exit edit mode/ });
  }

  get deleteStoryColor() {
    return this.getByRole('option', {
      name: /Delete local color/,
    });
  }

  get deleteGlobalColor() {
    return this.getByRole('option', {
      name: /Delete global color/,
    });
  }

  get custom() {
    return this.getByRole('button', { name: /Custom/i });
  }

  defaultColor(name) {
    return this.getByRole('option', { name });
  }

  // @todo: add accessors for remaining options
}
