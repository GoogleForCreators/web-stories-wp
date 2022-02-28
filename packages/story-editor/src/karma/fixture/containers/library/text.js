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

export default class Text extends Container {
  constructor(node, path) {
    super(node, path);
  }

  preset(name) {
    return this.getByRole('button', { name });
  }

  get textSetList() {
    return this.getByRole('group', { name: /Text Set Options/ });
  }

  get textSets() {
    return this.getAllByRoleIn(this.textSetList, 'button');
  }

  textSetFilter(name) {
    return this.getByRole('option', { name });
  }

  get smartColorToggle() {
    return this.getByRole('checkbox', {
      name: 'Adaptive text colors',
    });
  }

  get addStyleButton() {
    return this.getByRole('button', { name: /Add style/ });
  }

  get addTextWithStyleButtons() {
    return this.getAllByRole('button', { name: /Add new text/ });
  }

  get applyStyleButtons() {
    return this.getAllByRole('button', { name: /Apply style/ });
  }
}
