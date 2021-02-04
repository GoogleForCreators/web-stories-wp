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
import { Panel, PanelTitle, PanelContent } from '../../panel';
import { LAYER_HEIGHT, DEFAULT_LAYERS_VISIBLE } from './constants';
import LayerList from './layerList';
import useLayers from './useLayers';

function LayerPanel() {
  const layers = useLayers();
  const numLayersVisible = layers?.length
    ? Math.min(layers.length, DEFAULT_LAYERS_VISIBLE)
    : DEFAULT_LAYERS_VISIBLE;

  return (
    <Panel
      name="layers"
      initialHeight={Math.min(
        numLayersVisible * LAYER_HEIGHT,
        window.innerHeight / 3
      )}
      resizeable
      ariaHidden
      collapsedByDefault={false}
    >
      <PanelTitle isSecondary isResizable>
        {__('Layers', 'web-stories')}
      </PanelTitle>

      <PanelContent isSecondary padding={'0'}>
        <LayerList layers={layers} />
      </PanelContent>
    </Panel>
  );
}

export default LayerPanel;
