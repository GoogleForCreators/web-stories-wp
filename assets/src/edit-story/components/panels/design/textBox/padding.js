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
import { TurningLine } from '../../../../icons';
import clamp from '../../../../utils/clamp';
import { Row as DefaultRow, usePresubmitHandler } from '../../../form';
import { useCommonObjectValue } from '../../shared';
import { metricsForTextPadding } from '../../utils/metricsForTextPadding';
import {
  LockToggle as DefaultLockToggle,
  NumericInput,
} from '../../../../../design-system';
import { MULTIPLE_DISPLAY_VALUE, MULTIPLE_VALUE } from '../../../../constants';
import { getHiddenPadding, removeHiddenPadding } from './utils';

const DEFAULT_PADDING = {
  horizontal: 0,
  vertical: 0,
  locked: true,
  hasHiddenPadding: false,
};

const MIN_MAX = {
  PADDING: {
    MIN: 0,
    MAX: 300,
  },
};

const Space = styled.div`
  flex: 0 0 8px;
`;

const LockToggle = styled(DefaultLockToggle)`
  ${({ isLocked }) =>
    !isLocked &&
    `
    position: absolute;
    right: 0;
    top: calc(100% - 8px);
  `}
`;

const Row = styled(DefaultRow)`
  position: relative;
`;

const IconWrapper = styled.div`
  width: 44px;
  margin-left: 6px;
  color: ${({ theme }) => theme.colors.divider.primary};
  ${({ reverse }) => reverse && 'transform: scaleY(-1);'}
  svg {
    width: 22px;
  }
`;

function PaddingControls({
  selectedElements,
  pushUpdateForObject,
  pushUpdate,
}) {
  const displayedPadding = useCommonObjectValue(
    // Map over all elements and update display
    // values to not include hidden padding
    // if hidden padding is present
    selectedElements.map((el) => ({
      ...el,
      padding: removeHiddenPadding(el),
    })),
    'padding',
    DEFAULT_PADDING
  );

  // Only if true for all selected elements, will the toggle be true
  // (Note that this behavior is different from aspect lock ratio)
  const lockPadding = displayedPadding.locked === true;

  const handleChange = useCallback(
    (updater) => {
      pushUpdate((el) => {
        const { x, y, width, height } = el;
        const newPadding = updater(el);
        return metricsForTextPadding({
          x,
          y,
          height,
          width,
          currentPadding: el.padding,
          newPadding,
        });
      });
      pushUpdateForObject(
        'padding',
        (v) => updater({ padding: v }),
        DEFAULT_PADDING,
        true
      );
    },
    [pushUpdate, pushUpdateForObject]
  );

  usePresubmitHandler(
    ({ padding: { horizontal, vertical, ...rest } }) => ({
      padding: {
        ...rest,
        horizontal: clamp(horizontal, MIN_MAX.PADDING),
        vertical: clamp(vertical, MIN_MAX.PADDING),
      },
    }),
    []
  );

  const firstInputProperties = lockPadding
    ? {
        suffix: __('Padding', 'web-stories'),
        'aria-label': __('Padding', 'web-stories'),
        onChange: (evt, value) => {
          handleChange((el) => {
            return {
              horizontal: value + getHiddenPadding(el, 'horizontal'),
              vertical: value + getHiddenPadding(el, 'vertical'),
            };
          });
        },
        stretch: true,
      }
    : {
        suffix: __('Horizontal padding', 'web-stories'),
        'aria-label': __('Horizontal padding', 'web-stories'),
        onChange: (evt, value) => {
          handleChange((el) => ({
            horizontal: value + getHiddenPadding(el, 'horizontal'),
          }));
        },
      };

  return (
    <>
      <Row>
        <NumericInput
          value={displayedPadding.horizontal}
          isIndeterminate={displayedPadding.horizontal === MULTIPLE_VALUE}
          placeholder={
            displayedPadding.horizontal === MULTIPLE_VALUE
              ? MULTIPLE_DISPLAY_VALUE
              : null
          }
          {...firstInputProperties}
        />
        {lockPadding && <Space />}
        <LockToggle
          isLocked={lockPadding}
          onClick={() =>
            handleChange((el) =>
              lockPadding
                ? {
                    locked: false,
                  }
                : {
                    locked: true,
                    // When setting the lock, set both dimensions to the value of horizontal
                    horizontal: el.padding.horizontal,
                    vertical:
                      el.padding.horizontal +
                      getHiddenPadding(el, 'vertical') -
                      getHiddenPadding(el, 'horizontal'),
                  }
            )
          }
          aria-label={__('Toggle padding ratio lock', 'web-stories')}
        />
        {!lockPadding && (
          <IconWrapper reverse>
            <TurningLine />
          </IconWrapper>
        )}
      </Row>
      {!lockPadding && (
        <Row>
          <NumericInput
            isIndeterminate={displayedPadding.vertical === MULTIPLE_VALUE}
            placeholder={
              displayedPadding.vertical === MULTIPLE_VALUE
                ? MULTIPLE_DISPLAY_VALUE
                : null
            }
            suffix={__('Vertical padding', 'web-stories')}
            value={displayedPadding.vertical}
            onChange={(evt, value) => {
              handleChange((el) => ({
                vertical: Number(value) + getHiddenPadding(el, 'vertical'),
              }));
            }}
            aria-label={__('Vertical padding', 'web-stories')}
          />
          <IconWrapper>
            <TurningLine />
          </IconWrapper>
        </Row>
      )}
    </>
  );
}

PaddingControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdateForObject: PropTypes.func.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default PaddingControls;
