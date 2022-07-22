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
import Tooltip from '../../../tooltip';
import { focusStyle } from '../../shared/styles';
import { useCommonObjectValue } from '../../shared';
import { MULTIPLE_VALUE, MULTIPLE_DISPLAY_VALUE } from '../../../../constants';
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
  padding-top: 2px;
  ${({ locked }) =>
    locked &&
    `
    padding-left: 8px;
  `}
  align-self: stretch;
`;

const BorderTop = styled(Icons.Border)`
  transform: rotate(90deg);
`;

const BorderBottom = styled(Icons.Border)`
  transform: rotate(-90deg);
`;

const BorderRight = styled(Icons.Border)`
  transform: scaleX(-1);
`;

function WidthControls({ selectedElements, pushUpdateForObject }) {
  const border = useCommonObjectValue(
    selectedElements,
    'border',
    DEFAULT_BORDER
  );

  // Some shapes i.e all non-rectangular shapes only support a single border width value
  const hasMultiBorderSupport = selectedElements.every(canSupportMultiBorder);

  // Only if true for all selected elements.
  const lockBorder = border.lockedWidth === true || !hasMultiBorderSupport;

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

  const getMixedValueProps = useCallback((value) => {
    return {
      isIndeterminate: MULTIPLE_VALUE === value,
      placeholder: MULTIPLE_VALUE === value ? MULTIPLE_DISPLAY_VALUE : null,
    };
  }, []);
  return (
    <BorderInputsFlexContainer>
      <StackableGroup locked={lockBorder}>
        <StackableInput
          value={border.left}
          onChange={handleChange('left')}
          aria-label={firstInputLabel}
          suffix={!lockBorder && <Icons.Border />}
          min={0}
          {...getMixedValueProps(border.left)}
        />

        {!lockBorder && (
          <>
            <StackableInput
              value={border.top}
              onChange={handleChange('top')}
              aria-label={__('Top border', 'web-stories')}
              labelText={__('Top', 'web-stories')}
              suffix={<BorderTop />}
              min={0}
              {...getMixedValueProps(border.top)}
            />

            <StackableInput
              value={border.right}
              onChange={handleChange('right')}
              aria-label={__('Right border', 'web-stories')}
              labelText={__('Right', 'web-stories')}
              suffix={<BorderRight />}
              min={0}
              {...getMixedValueProps(border.right)}
            />

            <StackableInput
              value={border.bottom}
              onChange={handleChange('bottom')}
              aria-label={__('Bottom border', 'web-stories')}
              labelText={__('Bottom', 'web-stories')}
              suffix={<BorderBottom />}
              min={0}
              {...getMixedValueProps(border.bottom)}
            />
          </>
        )}
      </StackableGroup>
      {hasMultiBorderSupport && (
        <ToggleWrapper locked={lockBorder}>
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
      )}
    </BorderInputsFlexContainer>
  );
}

WidthControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdateForObject: PropTypes.func.isRequired,
};

export default WidthControls;
