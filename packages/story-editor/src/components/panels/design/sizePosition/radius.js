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
import { useCallback } from '@googleforcreators/react';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import { LockToggle, Icons } from '@googleforcreators/design-system';
import { canSupportMultiBorder } from '@googleforcreators/masks';

/**
 * Internal dependencies
 */
import { StackableGroup, StackableInput } from '../../../form/stackable';
import { useCommonObjectValue, focusStyle } from '../../shared';
import Tooltip from '../../../tooltip';
import { MULTIPLE_VALUE, MULTIPLE_DISPLAY_VALUE } from '../../../../constants';

export const DEFAULT_BORDER_RADIUS = {
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

const TopLeft = styled(Icons.Corner)`
  transform: rotate(90deg);
`;

const TopRight = styled(Icons.Corner)`
  transform: rotate(180deg);
`;

const BottomRight = styled(Icons.Corner)`
  transform: rotate(270deg);
`;

function RadiusControls({ selectedElements, pushUpdateForObject }) {
  const borderRadius = useCommonObjectValue(
    selectedElements,
    'borderRadius',
    DEFAULT_BORDER_RADIUS
  );

  const allSupportBorder = selectedElements.every((el) =>
    canSupportMultiBorder(el)
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
      <StackableGroup locked={lockRadius}>
        <StackableInput
          suffix={<TopLeft />}
          value={
            borderRadius.topLeft === MULTIPLE_VALUE ? '' : borderRadius.topLeft
          }
          aria-label={firstInputLabel}
          onChange={(_, value) => handleChange('topLeft', value)}
          placeholder={
            borderRadius.topLeft === MULTIPLE_VALUE
              ? MULTIPLE_DISPLAY_VALUE
              : ''
          }
          isIndeterminate={borderRadius.topLeft === MULTIPLE_VALUE}
        />

        {!lockRadius && (
          <>
            <StackableInput
              suffix={<TopRight />}
              value={
                borderRadius.topRight === MULTIPLE_VALUE
                  ? ''
                  : borderRadius.topRight
              }
              aria-label={__('Top right corner radius', 'web-stories')}
              onChange={(_, value) => handleChange('topRight', value)}
              placeholder={
                borderRadius.topRight === MULTIPLE_VALUE
                  ? MULTIPLE_DISPLAY_VALUE
                  : ''
              }
              isIndeterminate={borderRadius.topRight === MULTIPLE_VALUE}
            />
            <StackableInput
              value={
                borderRadius.bottomLeft === MULTIPLE_VALUE
                  ? ''
                  : borderRadius.bottomLeft
              }
              aria-label={__('Bottom left corner radius', 'web-stories')}
              onChange={(_, value) => handleChange('bottomLeft', value)}
              placeholder={
                borderRadius.bottomLeft === MULTIPLE_VALUE
                  ? MULTIPLE_DISPLAY_VALUE
                  : ''
              }
              suffix={<Icons.Corner />}
              isIndeterminate={borderRadius.bottomLeft === MULTIPLE_VALUE}
            />
            <StackableInput
              value={
                borderRadius.bottomRight === MULTIPLE_VALUE
                  ? ''
                  : borderRadius.bottomRight
              }
              aria-label={__('Bottom right corner radius', 'web-stories')}
              onChange={(_, value) => handleChange('bottomRight', value)}
              placeholder={
                borderRadius.bottomRight === MULTIPLE_VALUE
                  ? MULTIPLE_DISPLAY_VALUE
                  : ''
              }
              suffix={<BottomRight />}
              isIndeterminate={borderRadius.bottomRight === MULTIPLE_VALUE}
            />
          </>
        )}
      </StackableGroup>

      <LockContainer>
        <Tooltip
          title={__('Toggle consistent corner radius', 'web-stories')}
          // Key is needed to remount the component when `borderRadius.locked` changes. Otherwise when toggle is open,
          // tooltip may cover content.
          key={borderRadius.locked.toString()}
        >
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
