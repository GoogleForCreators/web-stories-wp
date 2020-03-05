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
import { useEffect, useState } from 'react';
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
import getCommonValue from './utils/getCommonValue';

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

function LayerStylePanel({ selectedElements, onSetProperties }) {
  const opacity = getCommonValue(selectedElements, 'opacity');
  const [state, setState] = useState({ opacity });

  useEffect(() => {
    setState({ opacity });
  }, [opacity]);
  const handleSubmit = (evt) => {
    onSetProperties(state);
    evt.preventDefault();
  };
  return (
    <SimplePanel
      name="layerStyle"
      title={__('Layer', 'web-stories')}
      onSubmit={handleSubmit}
    >
      <Row expand={false} spaceBetween={true}>
        <BoxedNumeric
          suffix={__('Opacity', 'web-stories')}
          symbol={_x('%', 'Percentage', 'web-stories')}
          value={state.opacity}
          onChange={(value) =>
            setState({
              ...state,
              opacity: isNaN(value) || value === '' ? '' : parseFloat(value),
            })
          }
          min="1"
          max="100"
        />
      </Row>
    </SimplePanel>
  );
}

LayerStylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default LayerStylePanel;
