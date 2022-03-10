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
import { getByLabelText, getAllByTestId } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { AbstractPanel } from './abstractPanel';

/**
 * The layers panel.
 */
export class Layers extends AbstractPanel {
  constructor(node, path) {
    super(node, path);
  }

  get togglePanel() {
    return this._node;
  }

  get panelBadge() {
    return this.getByTestId('panel-badge');
  }

  get layersList() {
    return getByLabelText(this.node.ownerDocument, /layers list/i);
  }

  get layers() {
    return getAllByTestId(this.layersList, 'layer-option');
  }

  getLayerByInnerText(text) {
    return getAllByTestId(this.layersList, 'layer-option').find(
      (option) => option.innerText === text
    );
  }
}
