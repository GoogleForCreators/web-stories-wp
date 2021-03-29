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
 * External dependencies
 */
import { getByLabelText } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Container } from '../container';
import { Alignment } from './alignment';
import { Animation } from './animationPanel';
import { Filter } from './filter';
import { Border } from './border';
import { BorderRadius } from './borderRadius';
import { ColorPreset } from './colorPreset';
import { Layers } from './layers';
import { Link } from './link';
import { PageBackground } from './pageBackground';
import { SizePosition } from './sizePosition';
import { TextStyle } from './textStyle';
import { TextStylePreset } from './textStylePreset';
import { VideoPoster } from './videoPoster';
import { TextBox } from './textBox';
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
      this.getByRole('region', { name: 'Text' }),
      'textStyle',
      TextStyle
    );
  }

  get textBox() {
    return this._get(
      this.getByRole('region', { name: /Text box/ }),
      'textBox',
      TextBox
    );
  }

  get alignment() {
    return this._get(
      this.getByRole('region', { name: /Alignment/ }),
      'alignment',
      Alignment
    );
  }

  get filters() {
    return this._get(
      this.getByRole('region', { name: /Filters/ }),
      'filters',
      Filter
    );
  }

  get link() {
    return this._get(this.getByRole('region', { name: /Link/ }), 'link', Link);
  }

  get videoAccessibility() {
    return this._get(
      this.getByRole('region', { name: /Accessibility/ }),
      'poster',
      VideoPoster
    );
  }

  get textStylePreset() {
    return this._get(
      this.getByRole('region', { name: /Saved styles/ }),
      'textStylePreset',
      TextStylePreset
    );
  }

  get colorPreset() {
    return this._get(
      this.getByRole('region', { name: /Saved colors/ }),
      'colorPreset',
      ColorPreset
    );
  }

  get borderRadius() {
    return this._get(
      this.getByRole('region', { name: /Corner radius/ }),
      'borderRadius',
      BorderRadius
    );
  }

  get imageAccessibility() {
    // @todo: implement
    return null;
  }

  get layerStyle() {
    // @todo: implement
    return null;
  }

  get shapeStyle() {
    // @todo: implement
    return null;
  }

  get sizePosition() {
    return this._get(
      this.getByRole('region', { name: /Size & position/i }),
      'sizePosition',
      SizePosition
    );
  }

  get border() {
    return this._get(
      this.getByRole('region', { name: /Border/i }),
      'borderStyle',
      Border
    );
  }

  get videoOptions() {
    // @todo: implement
    return null;
  }

  get animation() {
    return this._get(
      this.getByRole('region', { name: /Animation/ }),
      'animation',
      Animation
    );
  }

  get pageBackground() {
    return this._get(
      this.getByRole('region', { name: /Page background/ }),
      'pageBackground',
      PageBackground
    );
  }

  get layerPanel() {
    // The whole panel is aria-hidden now for accessibility reasons
    // thus it cannot be accessed by role:
    return this._get(
      getByLabelText(this._node, 'Layers'),
      'layerPanel',
      Layers
    );
  }
}
