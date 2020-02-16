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
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { Fragment, useContext, useEffect } from '@wordpress/element';
import { speak } from '@wordpress/a11y';
import { sprintf, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Layer from './layer';
import LayerContext from './context';
import LayerSeparator from './separator';

const REORDER_MESSAGE = _x(
  'Reordering layers.. Press Escape to abort.. Release mouse to drop in position %d.',
  'Position to be inserted is the integer number of the new layer position.',
  'web-stories'
);

const LayerList = styled.div.attrs({ role: 'listbox' })`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: stretch;
`;

function LayerPanel() {
  const {
    state: { layers, isReordering, currentSeparator },
  } = useContext(LayerContext);

  const numLayers = layers && layers.length;

  useEffect(() => {
    if (isReordering && currentSeparator) {
      const position = numLayers - currentSeparator;
      const message = sprintf(REORDER_MESSAGE, position);
      speak(message, 'assertive');
    }
  }, [isReordering, currentSeparator, numLayers]);

  if (!numLayers) {
    return null;
  }

  return (
    <LayerList>
      {layers.map((layer) => (
        <Fragment key={layer.id}>
          {isReordering && <LayerSeparator position={layer.position + 1} />}
          <Layer layer={layer} />
        </Fragment>
      ))}
    </LayerList>
  );
}

export default LayerPanel;
