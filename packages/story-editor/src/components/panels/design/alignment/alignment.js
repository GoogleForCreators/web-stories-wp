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
import { useRef, useCallback, useState } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import {
  useKeyDownEffect,
  Icons,
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  themeHelpers,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../../app';
import { Panel } from '../../panel';
import Tooltip from '../../../tooltip';
import useAlignment from './useAlignment';

const ElementRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px;
  overflow: auto;
  overflow: overlay;
`;

const alignmentButtonIds = [
  'distributeHorizontally',
  'distributeVertically',
  'alignLeft',
  'alignCenter',
  'alignRight',
  'alignTop',
  'alignMiddle',
  'alignBottom',
];

const AlignmentButton = styled(Button).attrs({
  variant: BUTTON_VARIANTS.SQUARE,
  type: BUTTON_TYPES.TERTIARY,
  size: BUTTON_SIZES.SMALL,
})`
  position: relative;

  :focus {
    z-index: 1;
  }

  ${({ theme }) =>
    themeHelpers.focusableOutlineCSS(theme.colors.border.focus, '#1d1f20')};
`;

const StyledPanel = styled(Panel)`
  background-color: ${({ theme }) => theme.colors.opacity.black24};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider.secondary};
`;

function ElementAlignmentPanel({ selectedElements, pushUpdate }) {
  const { isRTL } = useConfig();

  const updateElements = (callback) => pushUpdate(callback, true);

  const {
    isDistributionEnabled,
    handleAlignLeft,
    handleAlignCenter,
    handleAlignRight,
    handleAlignTop,
    handleAlignMiddle,
    handleAlignBottom,
    handleHorizontalDistribution,
    handleVerticalDistribution,
  } = useAlignment({ selectedElements, updateElements });

  const ref = useRef();
  const [currentButton, setCurrentButton] = useState(null);

  const handleNavigation = useCallback(
    (direction) => () => {
      const currentIndex = alignmentButtonIds.findIndex(
        (id) => id === currentButton
      );
      const nextButtonId = alignmentButtonIds[currentIndex + direction];
      if (!nextButtonId) {
        return;
      }
      setCurrentButton(nextButtonId);
      ref.current.querySelector(`#${nextButtonId}`).focus();
    },
    [currentButton, setCurrentButton]
  );

  const forward = isRTL ? -1 : 1;
  useKeyDownEffect(ref, 'left', () => handleNavigation(forward), [
    handleNavigation,
    forward,
  ]);
  useKeyDownEffect(ref, 'right', () => handleNavigation(-forward), [
    handleNavigation,
    forward,
  ]);

  return (
    <StyledPanel
      name="alignment"
      canCollapse={false}
      ariaLabel={__('Alignment', 'web-stories')}
    >
      <ElementRow ref={ref}>
        <Tooltip title={__('Distribute horizontally', 'web-stories')}>
          <AlignmentButton
            disabled={!isDistributionEnabled}
            onClick={handleHorizontalDistribution}
            aria-label={__('Distribute horizontally', 'web-stories')}
            id={alignmentButtonIds[0]}
            onFocus={() => setCurrentButton(alignmentButtonIds[0])}
          >
            <Icons.DistributeHorizontal />
          </AlignmentButton>
        </Tooltip>
        <Tooltip title={__('Distribute vertically', 'web-stories')}>
          <AlignmentButton
            disabled={!isDistributionEnabled}
            onClick={handleVerticalDistribution}
            aria-label={__('Distribute vertically', 'web-stories')}
            id={alignmentButtonIds[1]}
            onFocus={() => setCurrentButton(alignmentButtonIds[1])}
          >
            <Icons.DistributeVertical />
          </AlignmentButton>
        </Tooltip>
        <Tooltip title={__('Align left', 'web-stories')}>
          <AlignmentButton
            onClick={handleAlignLeft}
            aria-label={__('Align left', 'web-stories')}
            id={alignmentButtonIds[2]}
            onFocus={() => setCurrentButton(alignmentButtonIds[2])}
          >
            <Icons.AlignLeft />
          </AlignmentButton>
        </Tooltip>
        <Tooltip title={__('Align center', 'web-stories')}>
          <AlignmentButton
            onClick={handleAlignCenter}
            aria-label={__('Align center', 'web-stories')}
            id={alignmentButtonIds[3]}
            onFocus={() => setCurrentButton(alignmentButtonIds[3])}
          >
            <Icons.AlignCenter />
          </AlignmentButton>
        </Tooltip>
        <Tooltip title={__('Align right', 'web-stories')}>
          <AlignmentButton
            onClick={handleAlignRight}
            aria-label={__('Align right', 'web-stories')}
            id={alignmentButtonIds[4]}
            onFocus={() => setCurrentButton(alignmentButtonIds[4])}
          >
            <Icons.AlignRight />
          </AlignmentButton>
        </Tooltip>
        <Tooltip title={__('Align top', 'web-stories')}>
          <AlignmentButton
            onClick={handleAlignTop}
            aria-label={__('Align top', 'web-stories')}
            id={alignmentButtonIds[5]}
            onFocus={() => setCurrentButton(alignmentButtonIds[5])}
          >
            <Icons.AlignTop />
          </AlignmentButton>
        </Tooltip>
        <Tooltip title={__('Align vertical center', 'web-stories')}>
          <AlignmentButton
            onClick={handleAlignMiddle}
            aria-label={__('Align vertical center', 'web-stories')}
            id={alignmentButtonIds[6]}
            onFocus={() => setCurrentButton(alignmentButtonIds[6])}
          >
            <Icons.AlignMiddle />
          </AlignmentButton>
        </Tooltip>
        <Tooltip title={__('Align bottom', 'web-stories')}>
          <AlignmentButton
            onClick={handleAlignBottom}
            aria-label={__('Align bottom', 'web-stories')}
            id={alignmentButtonIds[7]}
            onFocus={() => setCurrentButton(alignmentButtonIds[7])}
          >
            <Icons.AlignBottom />
          </AlignmentButton>
        </Tooltip>
      </ElementRow>
    </StyledPanel>
  );
}

ElementAlignmentPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default ElementAlignmentPanel;
