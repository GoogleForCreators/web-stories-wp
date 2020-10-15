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
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Row, Numeric, Toggle } from '../../form';
import { Lock, Unlock } from '../../../icons';
import { useCommonObjectValue } from '../utils';
import { DEFAULT_BORDER } from './shared';

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

const Space = styled.div`
  flex: 0 0 10px;
`;

const Label = styled.label`
  height: 60px;
  span {
    color: ${({ theme }) => rgba(theme.colors.fg.white, 0.3)};
    font-family: ${({ theme }) => theme.fonts.body2.family};
    font-size: ${({ theme }) => theme.fonts.body2.size};
    line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
    letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
    text-align: center;
    width: 100%;
    display: inline-block;
    margin-top: 8px;
    cursor: pointer;
  }
`;

const ToggleWrapper = styled.div`
  height: 60px;
`;

function BorderWidthControls({ selectedElements, pushUpdateForObject }) {
  const border = useCommonObjectValue(
    selectedElements,
    'border',
    DEFAULT_BORDER
  );

  // Only if true for all selected elements.
  const lockBorder = border.lockedWidth === true;

  const handleChange = useCallback(
    (newBorder, submit = false) => {
      pushUpdateForObject('border', newBorder, DEFAULT_BORDER, submit);
    },
    [pushUpdateForObject]
  );

  return (
    <Row>
      <Label>
        <BoxedNumeric
          value={border.left}
          onChange={(value) =>
            handleChange({
              left: value,
            })
          }
          aria-label={__('Edit: Left border', 'web-stories')}
        />
        <span>{__('Left', 'web-stories')}</span>
      </Label>
      <Space />
      <Label>
        <BoxedNumeric
          value={border.top}
          onChange={(value) =>
            handleChange({
              top: value,
            })
          }
          aria-label={__('Edit: Top border', 'web-stories')}
        />
        <span>{__('Top', 'web-stories')}</span>
      </Label>
      <Space />
      <Label>
        <BoxedNumeric
          value={border.right}
          onChange={(value) =>
            handleChange({
              right: value,
            })
          }
          aria-label={__('Edit: Right border', 'web-stories')}
        />
        <span>{__('Right', 'web-stories')}</span>
      </Label>
      <Space />
      <Label>
        <BoxedNumeric
          value={border.bottom}
          onChange={(value) =>
            handleChange({
              bottom: value,
            })
          }
          aria-label={__('Edit: Bottom border', 'web-stories')}
        />
        <span>{__('Bottom', 'web-stories')}</span>
      </Label>
      <Space />
      <ToggleWrapper>
        <Toggle
          icon={<Lock />}
          uncheckedIcon={<Unlock />}
          value={lockBorder}
          onChange={() => handleChange({ lockedWidth: !lockBorder })}
          aria-label={__('Toggle border ratio lock', 'web-stories')}
        />
      </ToggleWrapper>
    </Row>
  );
}

BorderWidthControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdateForObject: PropTypes.func.isRequired,
};

export default BorderWidthControls;
