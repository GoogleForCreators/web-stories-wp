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
import { Container } from './container';
import { Select } from './common';
import { Carousel } from './carousel';
import { Layers } from './designPanel/layers';

/**
 * The workspace footer.
 */
export class Footer extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get carousel() {
    return this._get(
      this.getByRole('region', { name: 'Page Carousel' }),
      'carousel',
      Carousel
    );
  }

  get gridViewToggle() {
    return this.getByRole('button', { name: 'Grid View' });
  }

  get helpCenterToggle() {
    return this.getByRole('button', { name: /^Help Center/ });
  }

  get checklistToggle() {
    return this.getByRole('button', { name: /^Checklist/ });
  }

  get keyboardShortcutsToggle() {
    return this.getByRole('button', { name: /^Keyboard Shortcuts$/ });
  }

  get zoomSelector() {
    return this._get(
      this.getByRole('button', { name: 'Zoom Level' }),
      'zoomSelector',
      Select
    );
  }

  get layerPanel() {
    return this._get(
      this.getByRole('button', { name: 'Layers' }),
      'layerPanel',
      Layers
    );
  }
}
