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
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SimplePanel } from '../panel';
import { Color, Numeric, Row } from '../../form';
import { useCommonObjectValue } from '../utils';
import { MaskTypes } from '../../../masks';
import { DEFAULT_BORDER } from './shared';
import WidthControls from './borderWidth';
import Position from './position';

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

const Space = styled.div`
  flex: 0 0 10px;
`;

function BorderStylePanel(props) {
  const { selectedElements, pushUpdate } = props;
  const border = useCommonObjectValue(
    selectedElements,
    'border',
    DEFAULT_BORDER
  );
  const { color, gap, dash, left, top, right, bottom } = border;

  const notAllRectangle = selectedElements.some(
    ({ mask }) => mask?.type && mask?.type !== MaskTypes.RECTANGLE
  );

  const handleChange = useCallback(
    (value, name) =>
      pushUpdate(
        {
          border: {
            ...border,
            [name]: value,
          },
        },
        true
      ),
    [border, pushUpdate]
  );

  // If any of the elements doesn't have rectangle mask, don't display.
  if (notAllRectangle) {
    return null;
  }

  const hasBorder = [left, top, right, bottom].some((value) => value > 0);
  return (
    <SimplePanel name="borderStyle" title={__('Border', 'web-stories')}>
      <WidthControls {...props} />
      {hasBorder && (
        <>
          <Position {...props} />
          <Row>
            <Color
              value={color}
              onChange={(value) => {
                handleChange(value, 'color');
              }}
              label={__('Border color', 'web-stories')}
              labelId="border-color-label"
            />
          </Row>
          <Row>
            <BoxedNumeric
              aria-label={__('Border dash', 'web-stories')}
              value={dash}
              min={0}
              max={100}
              suffix={__('Dash', 'web-stories')}
              onChange={(value) => {
                handleChange(value, 'dash');
              }}
              canBeEmpty
            />
            <Space />
            <BoxedNumeric
              aria-label={__('Border gap', 'web-stories')}
              value={gap}
              min={0}
              max={100}
              suffix={__('Gap', 'web-stories')}
              onChange={(value) => {
                handleChange(value, 'gap');
              }}
              canBeEmpty
            />
          </Row>
        </>
      )}
    </SimplePanel>
  );
}

BorderStylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default BorderStylePanel;
