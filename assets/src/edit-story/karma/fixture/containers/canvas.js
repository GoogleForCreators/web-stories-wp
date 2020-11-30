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
 * The editor's canvas. Includes: display, frames, editor layers,
 * navigation buttons, page menu.
 */
export class Canvas extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get displayLayer() {
    return this._get(
      this.getByRole('region', { name: 'Display layer' }),
      'displayLayer',
      DisplayLayer
    );
  }

  get framesLayer() {
    return this._get(
      this.getByRole('region', { name: 'Frames layer' }),
      'framesLayer',
      FramesLayer
    );
  }

  get editLayer() {
    return this._get(
      this.getByRole('region', { name: 'Edit layer' }),
      'editLayer',
      EditLayer
    );
  }

  get fullbleed() {
    return this._get(
      this.getAllByRole('region', { name: 'Fullbleed area' })[0],
      'fullbleed',
      Fullbleed
    );
  }

  get header() {
    return this._get(
      this.getAllByRole('group', { name: 'Story canvas header' })[0],
      'header',
      Header
    );
  }
}

/**
 * Contains element displays.
 */
class DisplayLayer extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get displays() {
    return this._getAll(
      // @todo: improve query.
      this.node.querySelectorAll('[data-element-id]'),
      (node) => `displays[${node.getAttribute('data-element-id')}]`,
      Frame
    );
  }

  display(elementId) {
    return this._get(
      // @todo: improve query.
      this.node.querySelector(`[data-element-id="${elementId}"]`),
      `displays[${elementId}]`,
      Display
    );
  }
}

/**
 * An element's display.
 */
class Display extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get overlay() {
    return this.node.querySelector(
      '[class^="displayElement__BackgroundOverlay-sc-"]'
    );
  }
}

/**
 * Contains element frames.
 */
class FramesLayer extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get container() {
    return this.node;
  }

  get frames() {
    return this._getAll(
      // @todo: improve query.
      this.node.querySelectorAll('[data-element-id]'),
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

  controls(elementId) {
    return this._get(
      this.node.querySelector(`[data-controls-id="${elementId}"]`),
      `controls[${elementId}]`,
      Controls
    );
  }

  get addPage() {
    return this.getByRole('button', { name: 'Add New Page' });
  }

  get prevPage() {
    return this.getByRole('button', { name: 'Previous Page' });
  }
}

/**
 * Contains fullbleed.
 */
class Fullbleed extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get container() {
    return this.node;
  }
}

/**
 * Contains elements in edit-mode.
 */
class EditLayer extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get text() {
    return this.node.querySelector('[data-testid="textEditor"]');
  }

  get media() {
    return this.getByRole('img', { name: /move/i });
  }

  get sizeSlider() {
    return this.getByRole('slider');
  }
}

/**
 * An element's frame.
 */
class Frame extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get textContentHTML() {
    return this.node.querySelector('p')?.innerHTML;
  }
}

/**
 * An element's controls.
 */
class Controls extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get play() {
    return this.getByRole('button', { name: 'Click to play' });
  }

  get pause() {
    return this.getByRole('button', { name: 'Click to pause' });
  }
}

/**
 * The story header
 */
class Header extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get title() {
    return this.getByRole('textbox', { name: 'Story title' });
  }

  get saveDraft() {
    return this.getByRole('button', { name: 'Save draft' });
  }

  get switchToDraft() {
    return this.getByRole('button', { name: 'Switch to draft' });
  }

  get update() {
    return this.getByRole('button', { name: 'Update' });
  }

  get publish() {
    return this.getByRole('button', { name: 'Publish' });
  }

  get preview() {
    return this.getByRole('button', { name: 'Preview' });
  }

  get schedule() {
    return this.getByRole('button', { name: 'Schedule' });
  }
}
