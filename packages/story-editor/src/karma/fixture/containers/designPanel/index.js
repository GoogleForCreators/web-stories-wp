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
import { Alignment } from './alignment';
import { Animation } from './animationPanel';
import { Filter } from './filter';
import { Border } from './border';
import { ColorPreset } from './colorPreset';
import { Link } from './link';
import { PageBackground } from './pageBackground';
import { SizePosition } from './sizePosition';
import { TextStyle } from './textStyle';
import { VideoPoster } from './videoPoster';
import { VideoOptions } from './videoOptions';
import { Captions } from './captions';
import { ShapeStyle } from './shapeStyle';

/**
 * The editor's canvas. Includes: display, frames, editor layers, carousel,
 * navigation buttons, page menu.
 */
export class DesignPanel extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get selectionSection() {
    return this.getByRole('tab', { name: /Selection/i });
  }

  get linkSection() {
    return this.getByRole('tab', { name: /Link/ });
  }

  get animationSection() {
    return this.getByRole('tab', { name: /Animation/ });
  }

  get textStyle() {
    return this._get(
      this.getByRole('region', { name: 'Text' }),
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

  get colorPreset() {
    return this._get(
      this.getByRole('region', { name: /Saved Colors/i }),
      'colorPreset',
      ColorPreset
    );
  }

  get imageAccessibility() {
    // @todo: implement
    return null;
  }

  get shapeStyle() {
    return this._get(
      this.getByRole('region', { name: /Shape style/i }),
      'shapeStyle',
      ShapeStyle
    );
  }

  get sizePosition() {
    return this._get(
      this.getByRole('region', { name: /Selection/i }),
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
    return this._get(
      this.getByRole('region', { name: /Video settings/i }),
      'videoOptions',
      VideoOptions
    );
  }

  get captions() {
    return this._get(
      this.getByRole('region', { name: /Caption and Subtitles/i }),
      'captions',
      Captions
    );
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
      this.getByRole('region', { name: /^Page Background$/i }),
      'pageBackground',
      PageBackground
    );
  }
}
