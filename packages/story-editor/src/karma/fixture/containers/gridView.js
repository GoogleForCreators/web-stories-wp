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

/**
 * The gid view dialog.
 */
export class GridView extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get pages() {
    const pageList = this.getByRole('listbox', {
      name: 'Grid View Pages List',
    });
    if (!pageList) {
      return [];
    }
    return this._getAll(
      // @todo: improve query.
      pageList.querySelectorAll('button[role="option"]'),
      (node) => `pages[${node.getAttribute('data-page-id')}]`,
      PageThumb
    );
  }

  page(pageName) {
    return this.getByRole('option', { name: new RegExp(`${pageName}`) });
  }

  get currentPage() {
    return this.getByRole('option', { name: /current page/ });
  }

  get close() {
    return this.getByRole('button', { name: 'Close' });
  }

  get size() {
    return this.getByRole('slider', { name: 'Pages per row' });
  }
}

/**
 * A page thumbnail.
 */
class PageThumb extends Container {
  constructor(node, path) {
    super(node, path);
  }
}
