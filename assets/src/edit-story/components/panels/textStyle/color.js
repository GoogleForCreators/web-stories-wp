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
import { useCallback, useEffect, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Color, Label, Row, ToggleButton } from '../../form';
import getCommonValue from '../utils/getCommonValue';
import { ReactComponent as FillIcon } from '../../../icons/fill_icon.svg';
import { ReactComponent as HighlightIcon } from '../../../icons/highlight_icon.svg';

const Space = styled.div`
  flex: ${({ flex }) => flex};
`;

function ColorControls({ selectedElements, onSetProperties }) {
  const color = getCommonValue(selectedElements, 'color');
  const backgroundColor = getCommonValue(selectedElements, 'backgroundColor');
  const backgroundType = getCommonValue(selectedElements, 'backgroundType');

  const [state, setState] = useState({
    backgroundType,
    backgroundColor,
    color,
  });
  useEffect(() => {
    setState({
      backgroundType,
      backgroundColor,
      color,
    });
  }, [color, backgroundColor, backgroundType]);

  const updateProperties = useCallback(() => {
    onSetProperties(state);
  }, [onSetProperties, state]);

  useEffect(() => {
    updateProperties();
  }, [
    state.backgroundType,
    state.backgroundColor,
    state.color,
    updateProperties,
  ]);

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
      {backgroundColor && (
        <Row>
          <Space flex="1" />
          <ToggleButton
            icon={<FillIcon width={32} height={32} />}
            value={state.backgroundType === 'fill'}
            isMultiple={false}
            label={__('Fill', 'web-stories')}
            onChange={(value) =>
              setState({ ...state, backgroundType: value ? 'fill' : '' })
            }
          />
          <Space flex="0 0 10px" />
          <ToggleButton
            icon={<HighlightIcon width={32} height={32} />}
            label={__('Highlight', 'web-stories')}
            value={state.backgroundType === 'highlight'}
            isMultiple={false}
            onChange={(value) =>
              setState({ ...state, backgroundType: value ? 'highlight' : '' })
            }
          />
          <Space flex="2" />
        </Row>
      )}
    </>
  );
}

ColorControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default ColorControls;
