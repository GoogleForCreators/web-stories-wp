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
import {
  useMemo,
  useRef,
  useCallback,
  useState,
  useEffect,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import {
  PAGE_WIDTH,
  PAGE_HEIGHT,
  getBoundRect,
  calcRotatedObjectPositionAndSize,
} from '@googleforcreators/units';
import {
  useKeyDownEffect,
  Icons,
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  themeHelpers,
  TOOLTIP_PLACEMENT,
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

const PAGE_RECT = {
  startX: 0,
  startY: 0,
  endX: PAGE_WIDTH,
  endY: PAGE_HEIGHT,
  width: PAGE_WIDTH,
  height: PAGE_HEIGHT,
};

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
  // Set boundRect with pageSize when there is only element selected
  const boundRect =
    selectedElements.length === 1 ? PAGE_RECT : getBoundRect(selectedElements);

  const updatedSelectedElementsWithFrame = useMemo(
    () =>
      selectedElements.map((item) => {
        const { id, x, y, width, height, rotationAngle } = item;
        let frameX = x;
        let frameY = y;
        let frameWidth = width;
        let frameHeight = height;
        if (rotationAngle) {
          const elementFrame = calcRotatedObjectPositionAndSize(
            rotationAngle,
            x,
            y,
            width,
            height
          );
          frameX = elementFrame.x;
          frameY = elementFrame.y;
          frameWidth = elementFrame.width;
          frameHeight = elementFrame.height;
        }
        return {
          id,
          x,
          y,
          width,
          height,
          frameX,
          frameY,
          frameWidth,
          frameHeight,
        };
      }),
    [selectedElements]
  );

  const {
    setUpdatedSelectedElementsWithFrame,
    handleAlign,
    handleAlignCenter,
    handleAlignMiddle,
    handleHorizontalDistribution,
    handleVerticalDistribution,
  } = useAlignment();
  useEffect(
    () => setUpdatedSelectedElementsWithFrame(updatedSelectedElementsWithFrame),
    [updatedSelectedElementsWithFrame, setUpdatedSelectedElementsWithFrame]
  );

  const isDistributionEnabled = selectedElements.length > 2;

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

  useKeyDownEffect(ref, 'left', () => handleNavigation(isRTL ? 1 : -1), [
    handleNavigation,
    isRTL,
  ]);
  useKeyDownEffect(ref, 'right', () => handleNavigation(isRTL ? -11 : 1), [
    handleNavigation,
    isRTL,
  ]);

  useKeyDownEffect(
    ref,
    { key: 'mod+{', shift: true },
    () => handleAlign('left'),
    [handleAlign]
  );

  useKeyDownEffect(ref, { key: 'mod+h', shift: true }, handleAlignCenter, [
    handleAlignCenter,
  ]);

  useKeyDownEffect(
    ref,
    { key: 'mod+}', shift: true },
    () => handleAlign('right'),
    [handleAlign]
  );

  return (
    <StyledPanel
      name="alignment"
      canCollapse={false}
      ariaLabel={__('Alignment', 'web-stories')}
    >
      <ElementRow ref={ref}>
        <Tooltip
          dock={!isRTL ? ref : null}
          placement={
            isRTL ? TOOLTIP_PLACEMENT.BOTTOM_START : TOOLTIP_PLACEMENT.BOTTOM
          }
          title={__('Distribute horizontally', 'web-stories')}
        >
          <AlignmentButton
            disabled={!isDistributionEnabled}
            onClick={() => handleHorizontalDistribution(boundRect, pushUpdate)}
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
            onClick={() => handleVerticalDistribution(boundRect, pushUpdate)}
            aria-label={__('Distribute vertically', 'web-stories')}
            id={alignmentButtonIds[1]}
            onFocus={() => setCurrentButton(alignmentButtonIds[1])}
          >
            <Icons.DistributeVertical />
          </AlignmentButton>
        </Tooltip>
        <Tooltip title={__('Align left', 'web-stories')} shortcut="mod+{">
          <AlignmentButton
            onClick={() => handleAlign('left', boundRect, pushUpdate)}
            aria-label={__('Align left', 'web-stories')}
            id={alignmentButtonIds[2]}
            onFocus={() => setCurrentButton(alignmentButtonIds[2])}
          >
            <Icons.AlignLeft />
          </AlignmentButton>
        </Tooltip>
        <Tooltip title={__('Align center', 'web-stories')} shortcut="mod+H">
          <AlignmentButton
            onClick={() => handleAlignCenter(boundRect, pushUpdate)}
            aria-label={__('Align center', 'web-stories')}
            id={alignmentButtonIds[3]}
            onFocus={() => setCurrentButton(alignmentButtonIds[3])}
          >
            <Icons.AlignCenter />
          </AlignmentButton>
        </Tooltip>
        <Tooltip title={__('Align right', 'web-stories')} shortcut="mod+}">
          <AlignmentButton
            onClick={() => handleAlign('right', boundRect, pushUpdate)}
            aria-label={__('Align right', 'web-stories')}
            id={alignmentButtonIds[4]}
            onFocus={() => setCurrentButton(alignmentButtonIds[4])}
          >
            <Icons.AlignRight />
          </AlignmentButton>
        </Tooltip>
        <Tooltip title={__('Align top', 'web-stories')}>
          <AlignmentButton
            onClick={() => handleAlign('top', boundRect, pushUpdate)}
            aria-label={__('Align top', 'web-stories')}
            id={alignmentButtonIds[5]}
            onFocus={() => setCurrentButton(alignmentButtonIds[5])}
          >
            <Icons.AlignTop />
          </AlignmentButton>
        </Tooltip>
        <Tooltip title={__('Align vertical center', 'web-stories')}>
          <AlignmentButton
            onClick={() => handleAlignMiddle(boundRect, pushUpdate)}
            aria-label={__('Align vertical center', 'web-stories')}
            id={alignmentButtonIds[6]}
            onFocus={() => setCurrentButton(alignmentButtonIds[6])}
          >
            <Icons.AlignMiddle />
          </AlignmentButton>
        </Tooltip>
        <Tooltip title={__('Align bottom', 'web-stories')}>
          <AlignmentButton
            onClick={() => handleAlign('bottom', boundRect, pushUpdate)}
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
