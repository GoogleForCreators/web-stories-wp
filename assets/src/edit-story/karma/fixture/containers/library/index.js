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
import Text from './text';
import PageLayouts from './pageLayouts';

/**
 * The library wrapper - containing tabs and panes for media, text and shapes.
 */
export class Library extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get mediaTab() {
    return this.getByRole('tab', { name: /Media Gallery/ });
  }

  get media() {
    return this._get(
      this.getByRole('tabpanel', { name: /Media Gallery/ }),
      'media',
      Media
    );
  }

  get media3pTab() {
    return this.getByRole('tab', { name: /Explore Media/ });
  }

  get textTab() {
    return this.getByRole('tab', { name: /Text library/ });
  }

  get textAdd() {
    return this.getByRole('button', { name: /Add new text element/ });
  }

  get text() {
    return this._get(
      this.getByRole('tabpanel', { name: /Text library/ }),
      'text',
      Text
    );
  }

  get shapesTab() {
    return this.getByRole('tab', { name: /Shapes library/ });
  }

  get shapes() {
    return this._get(
      this.getByRole('tabpanel', { name: /Shapes library/ }),
      'shapes',
      Shapes
    );
  }

  get pageLayoutsTab() {
    return this.getByRole('tab', { name: /Page layouts library/ });
  }

  get pageLayoutsPane() {
    return this._get(
      this.getByRole('tabpanel', { name: /Page layouts library/ }),
      'pageLayouts',
      PageLayouts
    );
  }
}

export class Shapes extends Container {
  constructor(node, path) {
    super(node, path);
  }

  shape(name) {
    return this.getByRole('button', { name });
  }
}

export class Media extends Container {
  constructor(node, path) {
    super(node, path);
  }

  item(index) {
    return this.node.querySelectorAll('[data-testid^=mediaElement]')[index];
  }
}
