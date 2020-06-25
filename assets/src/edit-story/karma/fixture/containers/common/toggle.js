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

/**
 * An icon-based toggle, that is either on or off and is surrounded by a label
 * acting as the button to trigger it. The actual toggle element (the
 * `<input type="checkbox" />`) is visually hidden so any mouse-user would
 * click the surrounding label rather than the input.
 */
export class Toggle extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get checked() {
    return this.node.checked;
  }

  get button() {
    return this.node.closest('label');
  }
}
