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
import PageTemplates from './pageTemplates';

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

  get media3p() {
    return this._get(
      this.getByRole('tabpanel', { name: /Explore Media/ }),
      'media3p',
      Media3P
    );
  }

  get textTab() {
    return this.getByRole('tab', { name: /Text library/ });
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

  get shoppingTab() {
    return this.getByRole('tab', { name: /Shopping library/ });
  }

  get pageTemplatesTab() {
    return this.getByRole('tab', { name: /Page templates library/ });
  }

  get pageTemplatesPane() {
    return this._get(
      this.getByRole('tabpanel', { name: /Page templates library/ }),
      'pageTemplates',
      PageTemplates
    );
  }
}

export class Shapes extends Container {
  constructor(node, path) {
    super(node, path);
  }

  shape(name) {
    return this.getByRole('button', {
      name,
    });
  }

  sticker(type) {
    return this.getByTestId(`library-sticker-${type}`);
  }
}

export class Media extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get mediaRecording() {
    return this.getByRole('button', {
      name: 'Record Video/Audio',
    });
  }

  get searchBar() {
    return this.getByRole('searchbox');
  }

  item(index) {
    return this.node.querySelectorAll('[data-testid^=mediaElement]')[index];
  }
}

export class Media3P extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get tabs() {
    return this.getAllByRole('tab');
  }

  get unsplashTab() {
    return this.getByRole('tab', { name: /^Images$/ });
  }

  get coverrTab() {
    return this.getByRole('tab', { name: /^Video$/ });
  }

  get tenorTab() {
    return this.getByRole('tab', { name: /^GIFs$/ });
  }

  get coverrSection() {
    return this.getByRole('tabpanel', { name: /^Video$/ });
  }

  get unsplashSection() {
    return this.getByRole('tabpanel', { name: /^Images$/ });
  }

  get tenorSection() {
    return this.getByRole('tabpanel', { name: /^GIFs$/ });
  }

  get filters() {
    return this.getAllByRoleIn(
      this.getByRole('listbox', { name: /List of filtering options/ }),
      'option'
    );
  }

  get expandFiltersButton() {
    return this.getByRole('button', { name: /Expand/ });
  }

  get mediaGallery() {
    return this.getByTestId('media-gallery-container');
  }

  get mediaElements() {
    return this.getAllByTestId(/^mediaElement/);
  }

  insertionBtnByIndex(index) {
    const buttons = this.getAllByRole('button', {
      name: /Open insertion menu/,
    });
    return buttons[index];
  }
}
