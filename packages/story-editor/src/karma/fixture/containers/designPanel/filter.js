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
 * The background filter panel containing buttons for toggling which filter
 * is shown for a given background plus options for manipulating said filter.
 */
export class Filter extends AbstractPanel {
  get none() {
    return this.getByRole('button', { name: /Filter: None/i });
  }

  get solid() {
    return this.getByRole('button', { name: /Filter: Tint/i });
  }

  get linear() {
    return this.getByRole('button', { name: /Filter: Linear/i });
  }

  get radial() {
    return this.getByRole('button', { name: /Filter: Vignette/i });
  }
}
