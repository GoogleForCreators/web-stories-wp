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
import { TextStyle } from './textStyle';
import { Alignment } from './alignment';
import { BackgroundOverlay } from './backgroundOverlay';
import { Link } from './link';
import { VideoAccessibility } from './videoAccessibility';

/**
 * The editor's canvas. Includes: display, frames, editor layers, carousel,
 * navigation buttons, page menu.
 */
export class DesignPanel extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get textStyle() {
    return this._get(
      this.getByRole('region', { name: /Style/ }),
      'textStyle',
      TextStyle
    );
  }

  get alignment() {
    return this._get(
      this.getByRole('region', { name: /Alignment/ }),
      'alignment',
      Alignment
    );
  }

  get backgroundOverlay() {
    return this._get(
      this.getByRole('region', { name: /Overlay/ }),
      'backgroundOverlay',
      BackgroundOverlay
    );
  }

  get link() {
    return this._get(this.getByRole('region', { name: /Link/ }), 'link', Link);
  }

  get videoAccessibility() {
    return this._get(
      this.getByRole('region', { name: /accessibility/i }),
      'videoAccessibility',
      VideoAccessibility
    );
  }

  get stylePreset() {
    // @todo: implement
    return null;
  }

  get backgroundSizePosition() {
    // @todo: implement
    return null;
  }

  get imageAccessibility() {
    // @todo: implement
    return null;
  }

  get layerStyle() {
    // @todo: implement
    return null;
  }

  get noSelection() {
    // @todo: implement
    return null;
  }

  get pageStyle() {
    // @todo: implement
    return null;
  }

  get shapeStyle() {
    // @todo: implement
    return null;
  }

  get sizePosition() {
    // @todo: implement
    return null;
  }

  get videoOptions() {
    // @todo: implement
    return null;
  }
}
