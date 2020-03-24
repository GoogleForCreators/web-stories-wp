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
import { useMemo } from 'react';
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

function ElementAlignmentPanel({ selectedElements, pushUpdate }) {
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

  const handleAlign = (direction) => {
    pushUpdate((properties) => {
      const { x, y, width, height, rotationAngle } = properties;
      let offsetX = 0;
      if (rotationAngle) {
        const { width: frameWidth } = calcRotatedObjectPositionAndSize(
          rotationAngle,
          x,
          y,
          width,
          height
        );
        offsetX = (frameWidth - width) / 2;
      }
      return {
        x:
          direction === 'left'
            ? boundRect.startX + offsetX
            : boundRect.endX - width - offsetX,
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

  const handleAlignTop = () => {
    pushUpdate((properties) => {
      const { x, y, width, height, rotationAngle } = properties;
      let offsetY = 0;
      if (rotationAngle) {
        const { height: frameHeight } = calcRotatedObjectPositionAndSize(
          rotationAngle,
          x,
          y,
          width,
          height
        );
        offsetY = (frameHeight - height) / 2;
      }
      return {
        y: boundRect.startY + offsetY,
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

  const handleAlignBottom = () => {
    pushUpdate((properties) => {
      const { x, y, width, height, rotationAngle } = properties;
      let offsetY = 0;
      if (rotationAngle) {
        const { height: frameHeight } = calcRotatedObjectPositionAndSize(
          rotationAngle,
          x,
          y,
          width,
          height
        );
        offsetY = (frameHeight - height) / 2;
      }
      return {
        y: boundRect.endY - height - offsetY,
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
    <ElementRow>
      <WithTooltip title={__('Distribute horizontally', 'web-stories')}>
        <IconButton
          disabled={!isDistributionEnabled}
          onClick={handleHorizontalDistribution}
          aria-label={__('Horizontal Distribution', 'web-stories')}
        >
          <HorizontalDistribute />
        </IconButton>
      </WithTooltip>
      <WithTooltip title={__('Distribute vertically', 'web-stories')}>
        <IconButton
          disabled={!isDistributionEnabled}
          onClick={handleVerticalDistribution}
          aria-label={__('Vertical Distribution', 'web-stories')}
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
        >
          <AlignLeft />
        </IconButton>
      </WithTooltip>
      <WithTooltip title={__('Align center', 'web-stories')} shortcut="mod+H">
        <IconButton
          disabled={!isAlignEnabled}
          onClick={handleAlignCenter}
          aria-label={__('Justify Center', 'web-stories')}
        >
          <AlignCenter />
        </IconButton>
      </WithTooltip>
      <WithTooltip title={__('Align right', 'web-stories')} shortcut="mod+}">
        <IconButton
          disabled={!isAlignEnabled}
          onClick={() => handleAlign('right')}
          aria-label={__('Justify Right', 'web-stories')}
        >
          <AlignRight />
        </IconButton>
      </WithTooltip>
      <WithTooltip title={__('Align top', 'web-stories')}>
        <IconButton
          disabled={!isAlignEnabled}
          onClick={handleAlignTop}
          aria-label={__('Justify Top', 'web-stories')}
        >
          <AlignTop />
        </IconButton>
      </WithTooltip>
      <WithTooltip title={__('Align vertical center', 'web-stories')}>
        <IconButton
          disabled={!isAlignEnabled}
          onClick={handleAlignMiddle}
          aria-label={__('Justify Middle', 'web-stories')}
        >
          <AlignMiddle />
        </IconButton>
      </WithTooltip>
      <WithTooltip title={__('Align bottom', 'web-stories')}>
        <IconButton
          disabled={!isAlignEnabled}
          onClick={handleAlignBottom}
          aria-label={__('Justify Bottom', 'web-stories')}
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
