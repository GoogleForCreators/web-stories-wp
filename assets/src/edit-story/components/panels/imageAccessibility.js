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
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Row, TextInput } from '../form';
import { SimplePanel } from './panel';
import getCommonObjectValue from './utils/getCommonObjectValue';
import getCommonValue from './utils/getCommonValue';

const BoxedTextInput = styled(TextInput)`
  padding: 6px 6px;
  border-radius: 4px;
`;

const ExpandedTextInput = styled(BoxedTextInput)`
  flex-grow: 1;
`;

function ImageAccessibilityPanel({ selectedElements, onSetProperties }) {
  const resource = getCommonValue(selectedElements, 'resource');
  const { alt } = getCommonObjectValue(
    selectedElements,
    'resource',
    ['alt'],
    false
  );
  const [state, setState] = useState({ alt });
  useEffect(() => {
    setState({ alt });
  }, [alt]);

  const handleSubmit = (evt) => {
    onSetProperties(state);
    evt.preventDefault();
  };

  const handleChange = useCallback(
    (property) => (value) => {
      const newState = {
        [property]: value,
      };
      setState({ ...state, ...newState });
      onSetProperties({ resource: { ...resource, ...newState } });
    },
    [state, onSetProperties, resource]
  );

  return (
    <SimplePanel
      name="imageAccessibility"
      title={__('Accessibility', 'web-stories')}
      onSubmit={handleSubmit}
    >
      <Row>
        <ExpandedTextInput
          placeholder={__('Assistive text', 'web-stories')}
          value={state.alt || ''}
          onChange={handleChange('alt')}
          clear
        />
      </Row>
    </SimplePanel>
  );
}

ImageAccessibilityPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default ImageAccessibilityPanel;
