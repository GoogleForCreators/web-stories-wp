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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Color, Label, Row } from '../../form';
import getCommonValue from '../utils/getCommonValue';

function ColorControls({ selectedElements, onSetProperties }) {
  const color = getCommonValue(selectedElements, 'color');
  const backgroundColor = getCommonValue(selectedElements, 'backgroundColor');

  const [state, setState] = useState({
    backgroundColor,
    color,
  });
  useEffect(() => {
    setState({
      backgroundColor,
      color,
    });
  }, [color, backgroundColor]);

  const updateProperties = useCallback(() => {
    onSetProperties(state);
  }, [onSetProperties, state]);

  useEffect(() => {
    updateProperties();
  }, [state.backgroundColor, state.color, updateProperties]);

  return (
    <>
      <Row>
        <Label>{__('Text', 'web-stories')}</Label>
        <Color
          isMultiple={'' === color}
          value={state.color}
          onChange={(value) => setState({ ...state, color: value })}
        />
      </Row>
      <Row>
        <Label>{__('Textbox', 'web-stories')}</Label>
        <Color
          hasGradient
          value={state.backgroundColor}
          isMultiple={backgroundColor === ''}
          onChange={(value) => setState({ ...state, backgroundColor: value })}
          label={__('Background color', 'web-stories')}
        />
      </Row>
    </>
  );
}

ColorControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default ColorControls;
