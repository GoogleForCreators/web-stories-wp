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
 * The text style panel containing inputs, toggles, dropdowns and other form elements
 * to view and manipulate the style of one or more currently selected text elements.
 */
export class TextStylePreset extends AbstractPanel {
  constructor(node, path) {
    super(node, path);
  }

  get add() {
    return this.getByRole('button', { name: /Add style/ });
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
