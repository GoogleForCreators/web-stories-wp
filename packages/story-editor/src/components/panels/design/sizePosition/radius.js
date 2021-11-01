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
import { canMaskHaveBorder } from '../../../../masks';
import Tooltip from '../../../tooltip';
import { useCommonObjectValue, focusStyle } from '../../shared';
import StackedInputs from '../../../form/stackedInputs';

const DEFAULT_BORDER_RADIUS = {
  topLeft: 0,
  topRight: 0,
  bottomRight: 0,
  bottomLeft: 0,
  locked: true,
};

const FlexContainer = styled.div`
  display: flex;
`;

const LockContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 32px;
  margin-left: 8px;
`;

const StyledLockToggle = styled(LockToggle)`
  ${focusStyle};
`;
function RadiusControls({ selectedElements, pushUpdateForObject }) {
  const borderRadius = useCommonObjectValue(
    selectedElements,
    'borderRadius',
    DEFAULT_BORDER_RADIUS
  );

  const allSupportBorder = selectedElements.every((el) =>
    canMaskHaveBorder(el)
  );

  const lockRadius = borderRadius.locked === true;

  const handleChange = useCallback(
    (name, value) => {
      const newRadius = !lockRadius
        ? {
            [name]: value,
          }
        : {
            topLeft: value,
            topRight: value,
            bottomRight: value,
            bottomLeft: value,
          };
      pushUpdateForObject(
        'borderRadius',
        newRadius,
        DEFAULT_BORDER_RADIUS,
        true
      );
    },
    [pushUpdateForObject, lockRadius]
  );

  const handleLockChange = useCallback(
    (locked) => {
      const newRadius = locked
        ? {
            locked,
            topLeft: borderRadius.topLeft,
            topRight: borderRadius.topLeft,
            bottomRight: borderRadius.topLeft,
            bottomLeft: borderRadius.topLeft,
          }
        : {
            locked,
          };
      pushUpdateForObject(
        'borderRadius',
        newRadius,
        DEFAULT_BORDER_RADIUS,
        true
      );
    },
    [pushUpdateForObject, borderRadius]
  );

  if (!allSupportBorder) {
    return null;
  }

  const firstInputLabel = lockRadius
    ? __('Corner Radius', 'web-stories')
    : __('Top left corner radius', 'web-stories');
  return (
    <FlexContainer>
      <StackedInputs
        lockInput={lockRadius}
        inputProps={borderRadius}
        handleChange={handleChange}
        suffix={<Icons.Corner />}
        firstInputLabel={firstInputLabel}
        showLockedSuffixIcon
      />
      <LockContainer>
        <Tooltip title={__('Toggle consistent corner radius', 'web-stories')}>
          <StyledLockToggle
            isLocked={borderRadius.locked}
            onClick={() => handleLockChange(!borderRadius.locked)}
            aria-label={__('Toggle consistent corner radius', 'web-stories')}
          />
        </Tooltip>
      </LockContainer>
    </FlexContainer>
  );
}

RadiusControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdateForObject: PropTypes.func.isRequired,
};

export default RadiusControls;
