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
import { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import WithTooltip from '../../../tooltip';
import { useConfig } from '../../../../app';
import { useKeyDownEffect } from '../../../keyboard';
import {
  AlignBottom,
  AlignTop,
  AlignMiddle,
  AlignLeft,
  AlignRight,
  AlignCenter,
  DistributeHorizontal,
  DistributeVertical,
} from '../../../../icons';
import getBoundRect, {
  calcRotatedObjectPositionAndSize,
} from '../../../../utils/getBoundRect';
import { PAGE_WIDTH, PAGE_HEIGHT } from '../../../../constants';
import { Panel } from '../../panel';
import useAlignment from './useAlignment';

const ElementRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.bg.v9};
  overflow: auto;
  overflow: overlay;
`;

const Icon = styled.button.attrs({
  type: 'button',
})`
  display: flex;
  width: 28px;
  height: 28px;
  justify-content: center;
  align-items: center;
  background-color: unset;
  cursor: pointer;
  padding: 0;
  border: 0;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => rgba(theme.colors.fg.white, 0.1)};
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.2;
  }

  svg {
    color: ${({ theme }) => theme.colors.mg.v2};
    width: 28px;
    height: 28px;
  }
`;

const SeparateBorder = styled.div`
  border-left: 1px dashed ${({ theme }) => rgba(theme.colors.bg.black, 0.3)};
  height: 12px;
  margin-left: 4px;
  margin-right: 4px;
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
    <Panel
      name="alignment"
      canCollapse={false}
      ariaLabel={__('Alignment', 'web-stories')}
    >
      <ElementRow ref={ref}>
        <WithTooltip title={__('Distribute horizontally', 'web-stories')}>
          <Icon
            disabled={!isDistributionEnabled}
            onClick={() => handleHorizontalDistribution(boundRect, pushUpdate)}
            aria-label={__('Horizontal Distribution', 'web-stories')}
            id={alignmentButtonIds[0]}
            onFocus={() => setCurrentButton(alignmentButtonIds[0])}
          >
            <DistributeHorizontal />
          </Icon>
        </WithTooltip>
        <WithTooltip title={__('Distribute vertically', 'web-stories')}>
          <Icon
            disabled={!isDistributionEnabled}
            onClick={() => handleVerticalDistribution(boundRect, pushUpdate)}
            aria-label={__('Vertical Distribution', 'web-stories')}
            id={alignmentButtonIds[1]}
            onFocus={() => setCurrentButton(alignmentButtonIds[1])}
          >
            <DistributeVertical />
          </Icon>
        </WithTooltip>
        <SeparateBorder />
        <WithTooltip title={__('Align left', 'web-stories')} shortcut="mod+{">
          <Icon
            onClick={() => handleAlign('left', boundRect, pushUpdate)}
            aria-label={__('Justify Left', 'web-stories')}
            id={alignmentButtonIds[2]}
            onFocus={() => setCurrentButton(alignmentButtonIds[2])}
          >
            <AlignLeft />
          </Icon>
        </WithTooltip>
        <WithTooltip title={__('Align center', 'web-stories')} shortcut="mod+H">
          <Icon
            onClick={() => handleAlignCenter(boundRect, pushUpdate)}
            aria-label={__('Justify Center', 'web-stories')}
            id={alignmentButtonIds[3]}
            onFocus={() => setCurrentButton(alignmentButtonIds[3])}
          >
            <AlignCenter />
          </Icon>
        </WithTooltip>
        <WithTooltip title={__('Align right', 'web-stories')} shortcut="mod+}">
          <Icon
            onClick={() => handleAlign('right', boundRect, pushUpdate)}
            aria-label={__('Justify Right', 'web-stories')}
            id={alignmentButtonIds[4]}
            onFocus={() => setCurrentButton(alignmentButtonIds[4])}
          >
            <AlignRight />
          </Icon>
        </WithTooltip>
        <WithTooltip title={__('Align top', 'web-stories')}>
          <Icon
            onClick={() => handleAlign('top', boundRect, pushUpdate)}
            aria-label={__('Justify Top', 'web-stories')}
            id={alignmentButtonIds[5]}
            onFocus={() => setCurrentButton(alignmentButtonIds[5])}
          >
            <AlignTop />
          </Icon>
        </WithTooltip>
        <WithTooltip title={__('Align vertical center', 'web-stories')}>
          <Icon
            onClick={() => handleAlignMiddle(boundRect, pushUpdate)}
            aria-label={__('Justify Middle', 'web-stories')}
            id={alignmentButtonIds[6]}
            onFocus={() => setCurrentButton(alignmentButtonIds[6])}
          >
            <AlignMiddle />
          </Icon>
        </WithTooltip>
        <WithTooltip title={__('Align bottom', 'web-stories')}>
          <Icon
            onClick={() => handleAlign('bottom', boundRect, pushUpdate)}
            aria-label={__('Justify Bottom', 'web-stories')}
            id={alignmentButtonIds[7]}
            onFocus={() => setCurrentButton(alignmentButtonIds[7])}
          >
            <AlignBottom />
          </Icon>
        </WithTooltip>
      </ElementRow>
    </Panel>
  );
}

ElementAlignmentPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default ElementAlignmentPanel;
