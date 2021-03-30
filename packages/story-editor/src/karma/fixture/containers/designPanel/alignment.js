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
 * The alignment panel containing buttons for aligning elements to each other
 * or the page depending on whether one or more elements are selected.
 */
export class Alignment extends AbstractPanel {
  constructor(node, path) {
    super(node, path);
  }

  get distributeHorizontally() {
    return this.getByRole('button', { name: /horizontal distribution/i });
  }

  get distributeVertically() {
    return this.getByRole('button', { name: /vertical distribution/i });
  }

  get left() {
    return this.getByRole('button', { name: /justify left/i });
  }

  get center() {
    return this.getByRole('button', { name: /justify center/i });
  }

  get right() {
    return this.getByRole('button', { name: /justify right/i });
  }

  get top() {
    return this.getByRole('button', { name: /justify top/i });
  }

  get middle() {
    return this.getByRole('button', { name: /justify middle/i });
  }

  get bottom() {
    return this.getByRole('button', { name: /justify bottom/i });
  }
}
