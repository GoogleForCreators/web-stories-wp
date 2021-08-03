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
 * External dependencies
 */
import { isPlatformMacOS } from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { Container } from './container';

const isMacOs = isPlatformMacOS();

const commandOrControl = isMacOs ? 'Command' : 'Control';

export class RightClickMenu extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get copy() {
    return this.queryByRole('button', {
      name: `Copy, or use ${commandOrControl} C on a keyboard`,
    });
  }

  get paste() {
    return this.queryByRole('button', {
      name: `Paste, or use ${commandOrControl} V on a keyboard`,
    });
  }

  get delete() {
    return this.queryByRole('button', {
      name: 'Delete, or use Delete on a keyboard',
    });
  }

  get duplicatePage() {
    return this.queryByRole('button', {
      name: 'Duplicate Page',
    });
  }

  get deletePage() {
    return this.queryByRole('button', {
      name: 'Delete Page',
    });
  }
}
