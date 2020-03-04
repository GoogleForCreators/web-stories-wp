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
import { Button, SelectMenu } from '../../form';
import { ReactComponent as FlipHorizontal } from '../../../icons/flip_horizontal.svg';
import { ReactComponent as FlipVertical } from '../../../icons/flip_vertical.svg';

const FlipButton = styled(Button)`
  background: transparent;
  border: none;
  padding: 8px;
  margin: 0;

  svg {
    color: ${({ theme }) => theme.colors.fg.v1};
    width: 16px;
    height: 16px;
  }
`;

function FlipControls({ properties, state, setState }) {
  const { flip } = properties;

  const FLIP_OFF = 'off';
  const FLIP_ON = 'on';
  const flipOptions = [
    { name: __('Off', 'web-stories'), value: FLIP_OFF },
    { name: __('On', 'web-stories'), value: FLIP_ON },
  ];

  const handleFlipChange = useCallback(
    (property) => (value) => {
      setState({
        ...state,
        flip: {
          ...state.flip,
          [property]: 'on' === value,
        },
      });
    },
    [setState, state]
  );
  return (
    <>
      {/** TODO: Implement flip horizontal mode */}
      <FlipButton>
        <FlipHorizontal />
      </FlipButton>
      {/** TODO: Implement flip vertical mode */}
      <FlipButton>
        <FlipVertical />
      </FlipButton>
      <SelectMenu
        label={__('Flip: vertical', 'web-stories')}
        options={flipOptions}
        isMultiple={flip === ''}
        value={state.flip?.vertical ? FLIP_ON : FLIP_OFF}
        onChange={handleFlipChange('vertical')}
      />
      <SelectMenu
        label={__('Flip: horizontal', 'web-stories')}
        options={flipOptions}
        isMultiple={flip === ''}
        value={state.flip?.horizontal ? FLIP_ON : FLIP_OFF}
        onChange={handleFlipChange('horizontal')}
      />
    </>
  );
}

FlipControls.propTypes = {
  properties: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
};

export default FlipControls;
