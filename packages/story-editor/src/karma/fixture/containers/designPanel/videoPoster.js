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
 * The poster panel containing inputs for adding poster.
 */
export class VideoPoster extends AbstractPanel {
  constructor(node, path) {
    super(node, path);
  }

  get posterImage() {
    return this.getByRole('img', { alt: 'Preview poster image' });
  }

  get posterMenuButton() {
    return this.getByRole('button', {
      name: /video poster/i,
    });
  }

  get posterMenuEdit() {
    return this.getByRoleIn(this.node.ownerDocument, 'menuitem', {
      name: /upload a file/i,
    });
  }

  get posterMenuHotlink() {
    return this.getByRoleIn(this.node.ownerDocument, 'menuitem', {
      name: /link to a file/i,
    });
  }

  get posterMenuReset() {
    return this.getByRoleIn(this.node.ownerDocument, 'menuitem', {
      name: /reset/i,
    });
  }

  get panelTitle() {
    return this.getByRole('button', { name: 'Accessibility' });
  }
}
