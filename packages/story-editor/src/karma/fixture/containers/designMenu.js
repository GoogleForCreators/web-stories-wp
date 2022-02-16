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
import { Toggle } from './common';

export class DesignMenu extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get flipVertical() {
    return this._get(
      this.getByRole('menuitem', { name: 'Flip vertically' }),
      'flipVertical',
      Toggle
    );
  }

  get flipHorizontal() {
    return this._get(
      this.getByRole('menuitem', { name: 'Flip horizontally' }),
      'flipHorizontal',
      Toggle
    );
  }
}
