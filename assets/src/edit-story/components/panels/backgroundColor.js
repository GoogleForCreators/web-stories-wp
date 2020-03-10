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
import { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Row, Color, Numeric } from '../form';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

function BackgroundColorPanel({ selectedElements, onSetProperties }) {
  const backgroundColor = getCommonValue(selectedElements, 'backgroundColor');
  const backgroundOpacity = getCommonValue(
    selectedElements,
    'backgroundOpacity'
  );
  const [state, setState] = useState({ backgroundOpacity });
  useEffect(() => {
    setState({ backgroundOpacity });
  }, [backgroundOpacity]);
  const handleSubmit = (evt) => {
    onSetProperties({ backgroundOpacity: state.backgroundOpacity });
    evt.preventDefault();
  };

  const handleChange = useCallback(
    (newColor) => {
      onSetProperties({ backgroundColor: newColor });
    },
    [onSetProperties]
  );

  return (
    <SimplePanel
      name="bgcolor"
      title={__('Background color', 'web-stories')}
      onSubmit={handleSubmit}
    >
      <Row>
        <Color
          hasGradient
          value={backgroundColor}
          isMultiple={backgroundColor === ''}
          onChange={handleChange}
          label={__('Background color', 'web-stories')}
        />
        <BoxedNumeric
          ariaLabel={__('Background Opacity', 'web-stories')}
          flexBasis={58}
          textCenter
          value={state.backgroundOpacity}
          onChange={(value) => setState({ ...state, backgroundOpacity: value })}
          postfix={_x('%', 'Percentage', 'web-stories')}
        />
      </Row>
    </SimplePanel>
  );
}

BackgroundColorPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default BackgroundColorPanel;
