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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Row } from '../../../form';
import { useCommonObjectValue } from '../../shared';
import {
  LockToggle,
  NumericInput,
  Text,
  THEME_CONSTANTS,
} from '../../../../../design-system';
import { MULTIPLE_DISPLAY_VALUE, MULTIPLE_VALUE } from '../../../../constants';
import { DEFAULT_BORDER } from './shared';

const INPUT_TOTAL_HEIGHT = 64;
const INPUT_WIDTH = 44;

const BorderRow = styled(Row)`
  ${({ locked }) => locked && 'justify-content: normal'};
`;

const Separator = styled.div`
  width: 8px;
  margin: -20px 0 6px;
  height: 1px;
  background: ${({ theme }) => theme.colors.divider.primary};
`;

const Label = styled.label`
  flex-shrink: 0;
  height: ${({ locked }) => !locked && `${INPUT_TOTAL_HEIGHT}px`};
  width: ${({ locked }) => (locked ? '50%' : `${INPUT_WIDTH}px`)};
`;

const LabelText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
  as: 'span',
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
  text-align: center;
  width: 100%;
  display: inline-block;
  margin-top: 8px;
  cursor: pointer;
`;

const ToggleWrapper = styled.div`
  height: ${({ locked }) => !locked && `${INPUT_TOTAL_HEIGHT - 4}px`};
`;

function UnLockedInput({ labelText, ...rest }) {
  return (
    <>
      <Separator />
      <Label>
        <NumericInput {...rest} />
        <LabelText>{labelText}</LabelText>
      </Label>
    </>
  );
}

UnLockedInput.propTypes = {
  labelText: PropTypes.string.isRequired,
};

function WidthControls({ selectedElements, pushUpdateForObject }) {
  const border = useCommonObjectValue(
    selectedElements,
    'border',
    DEFAULT_BORDER
  );

  // Only if true for all selected elements.
  const lockBorder = border.lockedWidth === true;

  const handleChange = useCallback(
    (name) => (evt) => {
      const value = Number(evt?.target?.value);
      if (value) {
        const newBorder = !lockBorder
          ? {
              [name]: value,
            }
          : {
              left: value,
              top: value,
              right: value,
              bottom: value,
            };
        pushUpdateForObject('border', newBorder, DEFAULT_BORDER, true);
      }
    },
    [pushUpdateForObject, lockBorder]
  );

  const handleLockChange = useCallback(
    (newBorder) => {
      pushUpdateForObject('border', newBorder, DEFAULT_BORDER, true);
    },
    [pushUpdateForObject]
  );

  const firstInputLabel = lockBorder
    ? __('Border', 'web-stories')
    : __('Left border', 'web-stories');

  const getMixedValueProps = useCallback((value) => {
    return {
      isIndeterminate: MULTIPLE_VALUE === value,
      placeholder: MULTIPLE_VALUE === value ? MULTIPLE_DISPLAY_VALUE : null,
    };
  }, []);
  return (
    <BorderRow locked={lockBorder}>
      <Label locked={lockBorder}>
        <NumericInput
          locked={lockBorder}
          value={border.left}
          onChange={handleChange('left')}
          aria-label={firstInputLabel}
          {...getMixedValueProps(border.left)}
        />
        {!lockBorder && <LabelText>{__('Left', 'web-stories')}</LabelText>}
      </Label>
      {!lockBorder && (
        <>
          <UnLockedInput
            value={border.top}
            onChange={handleChange('top')}
            aria-label={__('Top border', 'web-stories')}
            labelText={__('Top', 'web-stories')}
            {...getMixedValueProps(border.top)}
          />
          <UnLockedInput
            value={border.right}
            onChange={handleChange('right')}
            aria-label={__('Right border', 'web-stories')}
            labelText={__('Right', 'web-stories')}
            {...getMixedValueProps(border.right)}
          />
          <UnLockedInput
            value={border.bottom}
            onChange={handleChange('bottom')}
            aria-label={__('Bottom border', 'web-stories')}
            labelText={__('Bottom', 'web-stories')}
            {...getMixedValueProps(border.bottom)}
          />
        </>
      )}
      <ToggleWrapper locked={lockBorder}>
        <LockToggle
          isLocked={lockBorder}
          onClick={() => {
            let args = {
              lockedWidth: !lockBorder,
            };
            // If the border width wasn't locked before (and is now), unify all the values.
            if (!lockBorder) {
              args = {
                ...args,
                top: border.left,
                right: border.left,
                bottom: border.left,
              };
            }
            handleLockChange(args);
          }}
          aria-label={__('Toggle border ratio lock', 'web-stories')}
        />
      </ToggleWrapper>
    </BorderRow>
  );
}

WidthControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdateForObject: PropTypes.func.isRequired,
};

export default WidthControls;
