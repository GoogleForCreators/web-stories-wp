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
import { useMemo, useRef, useCallback, useState } from 'react';
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
import WithTooltip from '../tooltip';
import { useConfig } from '../../app';
import { useKeyDownEffect } from '../keyboard';
import { ReactComponent as AlignBottom } from '../../icons/align_bottom.svg';
import { ReactComponent as AlignTop } from '../../icons/align_top.svg';
import { ReactComponent as AlignCenter } from '../../icons/align_center.svg';
import { ReactComponent as AlignMiddle } from '../../icons/align_middle.svg';
import { ReactComponent as AlignLeft } from '../../icons/align_left.svg';
import { ReactComponent as AlignRight } from '../../icons/align_right.svg';
import { ReactComponent as HorizontalDistribute } from '../../icons/horizontal_distribute.svg';
import { ReactComponent as VerticalDistribute } from '../../icons/vertical_distribute.svg';
import { dataPixels } from '../../units/dimensions';
import getCommonValue from './utils/getCommonValue';
import getBoundRect, {
  calcRotatedObjectPositionAndSize,
} from './utils/getBoundRect';

const ElementRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.bg.v9};
`;

const IconButton = styled.button`
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
    background-color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.1)};
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
  border-left: 1px dashed ${({ theme }) => rgba(theme.colors.bg.v0, 0.3)};
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

function ElementAlignmentPanel({ selectedElements, pushUpdate }) {
  const { isRTL } = useConfig();
  const boundRect = getBoundRect(selectedElements);
  const isFill = getCommonValue(selectedElements, 'isFill');

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

  const isAlignEnabled = !isFill && selectedElements.length > 1;
  const isDistributionEnabled = !isFill && selectedElements.length > 2;

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

  const backwardDirection = isRTL ? 1 : -1;
  const forwardDirection = isRTL ? -1 : 1;

  useKeyDownEffect(ref, 'left', handleNavigation(backwardDirection), [
    handleNavigation,
  ]);
  useKeyDownEffect(ref, 'right', handleNavigation(forwardDirection), [
    handleNavigation,
  ]);

  useKeyDownEffect(
    ref,
    { key: 'mod+{', shift: true },
    () => handleAlign('left'),
    []
  );

  useKeyDownEffect(ref, { key: 'mod+h', shift: true }, handleAlignCenter, []);

  useKeyDownEffect(
    ref,
    { key: 'mod+}', shift: true },
    () => handleAlign('right'),
    []
  );

  const handleAlign = (direction) => {
    pushUpdate((properties) => {
      const { id } = properties;
      let offset = 0;
      const {
        width,
        height,
        frameWidth,
        frameHeight,
      } = updatedSelectedElementsWithFrame.find((item) => item.id === id);
      offset =
        direction === 'left' || direction === 'right'
          ? (frameWidth - width) / 2
          : (frameHeight - height) / 2;

      if (direction === 'left' || direction === 'right') {
        return {
          x:
            direction === 'left'
              ? boundRect.startX + offset
              : boundRect.endX - width - offset,
        };
      }
      return {
        y:
          direction === 'top'
            ? boundRect.startY + offset
            : boundRect.endY - height - offset,
      };
    });
  };

  const handleAlignCenter = () => {
    const centerX = (boundRect.endX + boundRect.startX) / 2;
    pushUpdate((properties) => {
      const { width } = properties;
      return {
        x: centerX - width / 2,
      };
    });
  };

  const handleAlignMiddle = () => {
    const centerY = (boundRect.endY + boundRect.startY) / 2;
    pushUpdate((properties) => {
      const { height } = properties;
      return {
        y: centerY - height / 2,
      };
    });
  };

  const handleHorizontalDistribution = () => {
    updatedSelectedElementsWithFrame.sort(
      (a, b) => (a.frameX + a.frameWidth) / 2 - (b.frameX + b.frameWidth) / 2
    );
    const commonSpaceWidth = dataPixels(
      (boundRect.width -
        updatedSelectedElementsWithFrame.reduce(
          (sum, element) => sum + element.frameWidth,
          0
        )) /
        (updatedSelectedElementsWithFrame.length - 1)
    );
    const updatedX = {};
    let offsetX = 0;
    updatedSelectedElementsWithFrame.forEach((element, index) => {
      const { id, x, width, frameWidth } = element;
      if (
        index === 0 ||
        index === updatedSelectedElementsWithFrame.length - 1
      ) {
        updatedX[id] = { x };
        offsetX = x;
      } else {
        updatedX[id] = {
          x: offsetX + (frameWidth - width) / 2,
        };
      }
      offsetX += frameWidth + commonSpaceWidth;
    });
    pushUpdate(({ id }) => updatedX[id]);
  };

  const handleVerticalDistribution = () => {
    updatedSelectedElementsWithFrame.sort(
      (a, b) => (a.frameY + a.frameHeight) / 2 - (b.frameY + b.frameHeight) / 2
    );
    const commonSpaceHeight = dataPixels(
      (boundRect.height -
        updatedSelectedElementsWithFrame.reduce(
          (sum, element) => sum + element.frameHeight,
          0
        )) /
        (updatedSelectedElementsWithFrame.length - 1)
    );
    const updatedY = {};
    let offsetY = 0;
    updatedSelectedElementsWithFrame.forEach((element, index) => {
      const { id, y, height, frameHeight } = element;
      if (
        index === 0 ||
        index === updatedSelectedElementsWithFrame.length - 1
      ) {
        updatedY[id] = { y };
        offsetY = y;
      } else {
        updatedY[id] = {
          y: offsetY + (frameHeight - height) / 2,
        };
      }
      offsetY += frameHeight + commonSpaceHeight;
    });
    pushUpdate(({ id }) => updatedY[id]);
  };

  return (
    <ElementRow ref={ref}>
      <WithTooltip title={__('Distribute horizontally', 'web-stories')}>
        <IconButton
          disabled={!isDistributionEnabled}
          onClick={handleHorizontalDistribution}
          aria-label={__('Horizontal Distribution', 'web-stories')}
          id={alignmentButtonIds[0]}
          onFocus={() => setCurrentButton(alignmentButtonIds[0])}
        >
          <HorizontalDistribute />
        </IconButton>
      </WithTooltip>
      <WithTooltip title={__('Distribute vertically', 'web-stories')}>
        <IconButton
          disabled={!isDistributionEnabled}
          onClick={handleVerticalDistribution}
          aria-label={__('Vertical Distribution', 'web-stories')}
          id={alignmentButtonIds[1]}
          onFocus={() => setCurrentButton(alignmentButtonIds[1])}
        >
          <VerticalDistribute />
        </IconButton>
      </WithTooltip>
      <SeparateBorder />
      <WithTooltip title={__('Align left', 'web-stories')} shortcut="mod+{">
        <IconButton
          disabled={!isAlignEnabled}
          onClick={() => handleAlign('left')}
          aria-label={__('Justify Left', 'web-stories')}
          id={alignmentButtonIds[2]}
          onFocus={() => setCurrentButton(alignmentButtonIds[2])}
        >
          <AlignLeft />
        </IconButton>
      </WithTooltip>
      <WithTooltip title={__('Align center', 'web-stories')} shortcut="mod+H">
        <IconButton
          disabled={!isAlignEnabled}
          onClick={handleAlignCenter}
          aria-label={__('Justify Center', 'web-stories')}
          id={alignmentButtonIds[3]}
          onFocus={() => setCurrentButton(alignmentButtonIds[3])}
        >
          <AlignCenter />
        </IconButton>
      </WithTooltip>
      <WithTooltip title={__('Align right', 'web-stories')} shortcut="mod+}">
        <IconButton
          disabled={!isAlignEnabled}
          onClick={() => handleAlign('right')}
          aria-label={__('Justify Right', 'web-stories')}
          id={alignmentButtonIds[4]}
          onFocus={() => setCurrentButton(alignmentButtonIds[4])}
        >
          <AlignRight />
        </IconButton>
      </WithTooltip>
      <WithTooltip title={__('Align top', 'web-stories')}>
        <IconButton
          disabled={!isAlignEnabled}
          onClick={() => handleAlign('top')}
          aria-label={__('Justify Top', 'web-stories')}
          id={alignmentButtonIds[5]}
          onFocus={() => setCurrentButton(alignmentButtonIds[5])}
        >
          <AlignTop />
        </IconButton>
      </WithTooltip>
      <WithTooltip title={__('Align vertical center', 'web-stories')}>
        <IconButton
          disabled={!isAlignEnabled}
          onClick={handleAlignMiddle}
          aria-label={__('Justify Middle', 'web-stories')}
          id={alignmentButtonIds[6]}
          onFocus={() => setCurrentButton(alignmentButtonIds[6])}
        >
          <AlignMiddle />
        </IconButton>
      </WithTooltip>
      <WithTooltip title={__('Align bottom', 'web-stories')}>
        <IconButton
          disabled={!isAlignEnabled}
          onClick={() => handleAlign('bottom')}
          aria-label={__('Justify Bottom', 'web-stories')}
          id={alignmentButtonIds[7]}
          onFocus={() => setCurrentButton(alignmentButtonIds[7])}
        >
          <AlignBottom />
        </IconButton>
      </WithTooltip>
    </ElementRow>
  );
}

ElementAlignmentPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default ElementAlignmentPanel;
