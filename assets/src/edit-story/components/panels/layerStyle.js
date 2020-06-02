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
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Row, Numeric } from '../form';
import { SimplePanel } from './panel';
import { getCommonValue } from './utils';

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

function defaultOpacity({ opacity }) {
  return opacity || 100;
}

function LayerStylePanel({ selectedElements, pushUpdate }) {
  const opacity = getCommonValue(selectedElements, defaultOpacity);
  return (
    <SimplePanel name="layerStyle" title={__('Layer', 'web-stories')}>
      <Row expand={false} spaceBetween={true}>
        <BoxedNumeric
          suffix={__('Opacity', 'web-stories')}
          symbol={_x('%', 'Percentage', 'web-stories')}
          value={opacity}
          onChange={(value) => pushUpdate({ opacity: value })}
          min="1"
          max="100"
          aria-label={__('Opacity in percentage', 'web-stories')}
        />
      </Row>
    </SimplePanel>
  );
}

LayerStylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default LayerStylePanel;
