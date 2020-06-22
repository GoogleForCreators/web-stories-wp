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
 * The editor's canvas. Includes: display, frames, editor layers, carousel,
 * navigation buttons, page menu.
 */
export class Canvas extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get displayLayer() {
    // @todo: display layer.
    return null;
  }

  get framesLayer() {
    return this._get(
      this.getByRole('region', { name: 'Frames' }),
      'framesLayer',
      FramesLayer
    );
  }

  get editLayer() {
    return null;
  }
}

/**
 * Contains element frames.
 */
class FramesLayer extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get frames() {
    return this._getAll(
      // @todo: improve query.
      this.node.querySelectorAll('[data-testid="frameElement"]'),
      (node) => `frames[${node.getAttribute('data-element-id')}]`,
      Frame
    );
  }

  frame(elementId) {
    return this._get(
      // @todo: improve query.
      this.node.querySelector(
        `[data-testid="frameElement"][data-element-id="${elementId}"]`
      ),
      `frames[${elementId}]`,
      Frame
    );
  }
}

/**
 * An element's frame.
 */
class Frame extends Container {
  constructor(node, path) {
    super(node, path);
  }
}
