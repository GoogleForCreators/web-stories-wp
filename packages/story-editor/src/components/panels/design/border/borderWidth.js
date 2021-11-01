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
import { useCallback } from '@web-stories-wp/react';
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';
import { LockToggle, Icons } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import Tooltip from '../../../tooltip';
import { focusStyle, useCommonObjectValue } from '../../shared';
import StackedInputs from '../../../form/stackedInputs';
import { DEFAULT_BORDER } from './shared';

const BorderInputsFlexContainer = styled.div`
  display: flex;
  gap: 7px;
  margin-bottom: 16px;
`;

const StyledLockToggle = styled(LockToggle)`
  ${focusStyle};
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

function WidthControls({ selectedElements, pushUpdateForObject }) {
  const border = useCommonObjectValue(
    selectedElements,
    'border',
    DEFAULT_BORDER
  );

  // Only if true for all selected elements.
  const lockBorder = border.lockedWidth === true;

  const handleChange = useCallback(
    (name) => (evt, value) => {
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

  return (
    <BorderInputsFlexContainer locked={lockBorder}>
      <StackedInputs
        lockInput={lockBorder}
        inputProps={border}
        handleChange={handleChange}
        suffix={<Icons.Border />}
        firstInputLabel={firstInputLabel}
      />
      <ToggleWrapper>
        <Tooltip title={__('Toggle consistent border', 'web-stories')}>
          <StyledLockToggle
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
            aria-label={__('Toggle consistent border', 'web-stories')}
          />
        </Tooltip>
      </ToggleWrapper>
    </BorderInputsFlexContainer>
  );
}

WidthControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdateForObject: PropTypes.func.isRequired,
};

export default WidthControls;
