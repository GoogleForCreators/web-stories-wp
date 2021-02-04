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
 * The link panel containing inputs for adding links to elements.
 */
export class Link extends AbstractPanel {
  constructor(node, path) {
    super(node, path);
  }

  get address() {
    return this.getByRole('textbox', { name: 'Element link' });
  }

  get addressClear() {
    return this.queryByRole('button', { name: 'Clear input' });
  }

  get icon() {
    return this.queryByRole('button', { name: 'Edit link icon' });
  }

  get description() {
    return this.queryByRole('textbox', { name: 'Link description' });
  }
}
