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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Panel, PanelTitle, PanelContent } from '../panel';
import { DEFAULT_LAYERS_VISIBLE, LAYER_HEIGHT } from './constants';
import LayerList from './layerList';
import LayerProvider from './provider';

function LayerPanel() {
  return (
    <Panel name="layers" initialHeight={DEFAULT_LAYERS_VISIBLE * LAYER_HEIGHT}>
      <PanelTitle isSecondary isResizable>
        {__('Layers', 'web-stories')}
      </PanelTitle>

      <PanelContent isSecondary isScrollable padding={'0'}>
        <LayerProvider>
          <LayerList />
        </LayerProvider>
      </PanelContent>
    </Panel>
  );
}

export default LayerPanel;
