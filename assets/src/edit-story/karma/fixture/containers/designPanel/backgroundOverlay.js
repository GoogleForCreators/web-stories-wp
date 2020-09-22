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
import { Toggle } from '../common';
import { AbstractPanel } from './abstractPanel';

/**
 * The background overlay panel containing buttons for toggling which overlay
 * is shown for a given background plus options for manipulating said overlay.
 */
export class BackgroundOverlay extends AbstractPanel {
  constructor(node, path) {
    super(node, path);
  }

  get none() {
    return this._get(
      this.getByRole('checkbox', { name: /Set overlay: None/i }),
      'none',
      Toggle
    );
  }

  get solid() {
    return this._get(
      this.getByRole('checkbox', { name: /Set overlay: Solid/i }),
      'solid',
      Toggle
    );
  }

  get linear() {
    return this._get(
      this.getByRole('checkbox', { name: /Set overlay: Linear/i }),
      'linear',
      Toggle
    );
  }

  get radial() {
    return this._get(
      this.getByRole('checkbox', { name: /Set overlay: Radial/i }),
      'radial',
      Toggle
    );
  }
}
