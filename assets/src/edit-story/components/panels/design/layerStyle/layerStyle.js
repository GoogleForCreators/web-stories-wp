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
import { useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { __, _x } from '@web-stories-wp/i18n';
import { NumericInput } from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { Row } from '../../../form';
import { SimplePanel } from '../../panel';
import { getCommonValue, inputContainerStyleOverride } from '../../shared';
import { MULTIPLE_DISPLAY_VALUE, MULTIPLE_VALUE } from '../../../../constants';

const MIN_MAX = {
  OPACITY: {
    MIN: 0,
    MAX: 100,
  },
};

const ShortRow = styled(Row)`
  width: 128px;
`;

function defaultOpacity({ opacity }) {
  return typeof opacity !== 'undefined' ? opacity : MIN_MAX.OPACITY.MAX;
}

function LayerStylePanel({ selectedElements, pushUpdate }) {
  const opacity = getCommonValue(selectedElements, defaultOpacity);

  const handleChange = useCallback(
    (evt, value) => pushUpdate({ opacity: value ?? 100 }, true),
    [pushUpdate]
  );

  return (
    <SimplePanel name="layerStyle" title={__('Layer', 'web-stories')}>
      <ShortRow>
        <NumericInput
          suffix={__('Opacity', 'web-stories')}
          unit={_x('%', 'Percentage', 'web-stories')}
          value={opacity}
          onChange={handleChange}
          min={MIN_MAX.OPACITY.MIN}
          max={MIN_MAX.OPACITY.MAX}
          aria-label={__('Opacity in percent', 'web-stories')}
          placeholder={opacity === MULTIPLE_VALUE ? MULTIPLE_DISPLAY_VALUE : ''}
          isIndeterminate={opacity === MULTIPLE_VALUE}
          containerStyleOverride={inputContainerStyleOverride}
        />
      </ShortRow>
    </SimplePanel>
  );
}

LayerStylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default LayerStylePanel;
