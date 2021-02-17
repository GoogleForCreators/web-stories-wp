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
import { AbstractPanel } from './abstractPanel';

class ColorPresetType extends Container {
  constructor(node, path) {
    super(node, path);
    // Name is added as the last part of path after dot.
    this._type = /[^.]*$/.exec(path)[0];
  }
  get add() {
    return this.getByRole('button', { name: `Add ${this._type} color` });
  }
  get apply() {
    return this.getByRole('button', { name: `Apply ${this._type} color` });
  }
  get delete() {
    return this.getByRole('button', { name: `Delete ${this._type} color` });
  }
}

/**
 * The text style panel containing inputs, toggles, dropdowns and other form elements
 * to view and manipulate the style of one or more currently selected text elements.
 */
export class ColorPreset extends AbstractPanel {
  constructor(node, path) {
    super(node, path);
  }

  get local() {
    return this._get(this.node, 'local', ColorPresetType);
  }
  get global() {
    return this._get(this.node, 'global', ColorPresetType);
  }

  get edit() {
    return this.getByRole('button', { name: /Edit colors/ });
  }

  get exit() {
    return this.getByRole('button', { name: /Exit edit mode/ });
  }
}
