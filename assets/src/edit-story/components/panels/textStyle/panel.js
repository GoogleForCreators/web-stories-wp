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
import PropTypes from 'prop-types';
import { useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { dataPixels } from '../../../units';
import { calculateTextHeight } from '../../../utils/textMeasurements';
import calcRotatedResizeOffset from '../../../utils/calcRotatedResizeOffset';
import { SimplePanel } from '../panel';
import TextStyleControls from './textStyle';
import ColorControls from './color';
import PaddingControls from './padding';
import FontControls from './font';

function StylePanel({ selectedElements, onSetProperties }) {
  const handleSubmit = useCallback(
    (evt) => {
      onSetProperties((properties) => {
        const { width, height: oldHeight, rotationAngle, x, y } = properties;
        const newProperties = { ...properties };
        const newHeight = dataPixels(calculateTextHeight(newProperties, width));
        const [dx, dy] = calcRotatedResizeOffset(
          rotationAngle,
          0,
          0,
          0,
          newHeight - oldHeight
        );
        return {
          height: newHeight,
          x: dataPixels(x + dx),
          y: dataPixels(y + dy),
        };
      });
      if (evt) {
        evt.preventDefault();
      }
    },
    [onSetProperties]
  );
  return (
    <SimplePanel
      name="style"
      title={__('Style', 'web-stories')}
      onSubmit={handleSubmit}
    >
      <FontControls
        selectedElements={selectedElements}
        onSetProperties={onSetProperties}
      />
      <TextStyleControls
        selectedElements={selectedElements}
        onSetProperties={onSetProperties}
      />
      <ColorControls
        selectedElements={selectedElements}
        onSetProperties={onSetProperties}
      />
      <PaddingControls
        selectedElements={selectedElements}
        onSetProperties={onSetProperties}
      />
    </SimplePanel>
  );
}

StylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default StylePanel;
