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
import { useMemo } from '@googleforcreators/react';
import {
  PAGE_WIDTH,
  PAGE_HEIGHT,
  getBoundRect,
  calcRotatedObjectPositionAndSize,
  dataPixels,
} from '@googleforcreators/units';
import { trackEvent } from '@googleforcreators/tracking';

const PAGE_RECT = {
  startX: 0,
  startY: 0,
  endX: PAGE_WIDTH,
  endY: PAGE_HEIGHT,
  width: PAGE_WIDTH,
  height: PAGE_HEIGHT,
};

const ALIGNMENT = {
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top',
  BOTTOM: 'bottom',
};

function useAlignment({ selectedElements, updateElements, isFloatingMenu }) {
  const isDistributionEnabled = selectedElements.length > 2;
  const selectedElementsWithFrame = useMemo(
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
  // Set boundRect with pageSize when there is only one element selected
  const boundRect =
    selectedElements.length === 1 ? PAGE_RECT : getBoundRect(selectedElements);

  const handleTrackEvent = (direction) => {
    trackEvent(isFloatingMenu ? 'floating_menu' : 'design_panel', {
      name: `set_alignment_${direction}`,
      element: 'multiple',
    });
  };

  const handleAlign = (direction) => {
    handleTrackEvent(direction);
    updateElements((properties) => {
      const { id } = properties;

      const element = selectedElementsWithFrame.find((item) => item.id === id);
      const {
        width = 0,
        height = 0,
        frameWidth = 0,
        frameHeight = 0,
      } = element || {};
      const offset =
        direction === ALIGNMENT.LEFT || direction === ALIGNMENT.RIGHT
          ? (frameWidth - width) / 2
          : (frameHeight - height) / 2;

      if (direction === ALIGNMENT.LEFT || direction === ALIGNMENT.RIGHT) {
        return {
          x:
            direction === ALIGNMENT.LEFT
              ? boundRect.startX + offset
              : boundRect.endX - width - offset,
        };
      }
      return {
        y:
          direction === ALIGNMENT.TOP
            ? boundRect.startY + offset
            : boundRect.endY - height - offset,
      };
    });
  };

  const handleAlignCenter = () => {
    handleTrackEvent('center');
    const centerX = (boundRect.endX + boundRect.startX) / 2;
    updateElements((properties) => {
      const { width } = properties;
      return {
        x: centerX - width / 2,
      };
    });
  };

  const handleAlignMiddle = () => {
    handleTrackEvent('middle');
    const centerY = (boundRect.endY + boundRect.startY) / 2;
    updateElements((properties) => {
      const { height } = properties;
      return {
        y: centerY - height / 2,
      };
    });
  };

  const handleHorizontalDistribution = () => {
    handleTrackEvent('horizontal_distribution');
    const sortedElementsWithFrame = [...selectedElementsWithFrame];
    sortedElementsWithFrame.sort(
      (a, b) => (a.frameX + a.frameWidth) / 2 - (b.frameX + b.frameWidth) / 2
    );
    const elementWidthSum = sortedElementsWithFrame.reduce(
      (sum, element) => sum + element.frameWidth,
      0
    );
    const commonSpaceWidth = boundRect.width - elementWidthSum;
    const commonSpaceWidthPerElement = dataPixels(
      commonSpaceWidth / (sortedElementsWithFrame.length - 1)
    );
    const updatedX = {};
    let offsetX = 0;
    sortedElementsWithFrame.forEach((element, index) => {
      const { id, x, width, frameWidth } = element;
      if (index === 0 || index === sortedElementsWithFrame.length - 1) {
        updatedX[id] = { x };
        offsetX = x;
      } else {
        updatedX[id] = {
          x: offsetX + (frameWidth - width) / 2,
        };
      }
      offsetX += frameWidth + commonSpaceWidthPerElement;
    });
    updateElements(({ id }) => updatedX[id]);
  };

  const handleVerticalDistribution = () => {
    handleTrackEvent('vertical_distribution');
    const sortedElementsWithFrame = [...selectedElementsWithFrame];
    sortedElementsWithFrame.sort(
      (a, b) => (a.frameY + a.frameHeight) / 2 - (b.frameY + b.frameHeight) / 2
    );
    const elementHeightSum = sortedElementsWithFrame.reduce(
      (sum, element) => sum + element.frameHeight,
      0
    );
    const commonSpaceHeight = boundRect.height - elementHeightSum;
    const commonSpaceHeightPerElement = dataPixels(
      commonSpaceHeight / (sortedElementsWithFrame.length - 1)
    );
    const updatedY = {};
    let offsetY = 0;
    sortedElementsWithFrame.forEach((element, index) => {
      const { id, y, height, frameHeight } = element;
      if (index === 0 || index === sortedElementsWithFrame.length - 1) {
        updatedY[id] = { y };
        offsetY = y;
      } else {
        updatedY[id] = {
          y: offsetY + (frameHeight - height) / 2,
        };
      }
      offsetY += frameHeight + commonSpaceHeightPerElement;
    });
    updateElements(({ id }) => updatedY[id]);
  };

  return {
    isDistributionEnabled,
    handleAlignLeft: () => handleAlign(ALIGNMENT.LEFT),
    handleAlignCenter,
    handleAlignRight: () => handleAlign(ALIGNMENT.RIGHT),
    handleAlignTop: () => handleAlign(ALIGNMENT.TOP),
    handleAlignMiddle,
    handleAlignBottom: () => handleAlign(ALIGNMENT.BOTTOM),
    handleHorizontalDistribution,
    handleVerticalDistribution,
  };
}

export default useAlignment;
