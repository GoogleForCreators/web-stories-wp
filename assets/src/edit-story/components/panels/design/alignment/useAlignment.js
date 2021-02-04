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
import { useState } from 'react';

/**
 * Internal dependencies
 */
import { dataPixels } from '../../../../units/dimensions';

function useAlignment() {
  const [
    updatedSelectedElementsWithFrame,
    setUpdatedSelectedElementsWithFrame,
  ] = useState([]);

  const handleAlign = (direction, boundRect, pushUpdate) => {
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
    }, true);
  };

  const handleAlignCenter = (boundRect, pushUpdate) => {
    const centerX = (boundRect.endX + boundRect.startX) / 2;
    pushUpdate((properties) => {
      const { width } = properties;
      return {
        x: centerX - width / 2,
      };
    }, true);
  };

  const handleAlignMiddle = (boundRect, pushUpdate) => {
    const centerY = (boundRect.endY + boundRect.startY) / 2;
    pushUpdate((properties) => {
      const { height } = properties;
      return {
        y: centerY - height / 2,
      };
    }, true);
  };

  const handleHorizontalDistribution = (boundRect, pushUpdate) => {
    const sortedElementsWithFrame = [...updatedSelectedElementsWithFrame];
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
    pushUpdate(({ id }) => updatedX[id], true);
  };

  const handleVerticalDistribution = (boundRect, pushUpdate) => {
    const sortedElementsWithFrame = [...updatedSelectedElementsWithFrame];
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
    pushUpdate(({ id }) => updatedY[id], true);
  };

  return {
    setUpdatedSelectedElementsWithFrame,
    handleAlign,
    handleAlignCenter,
    handleAlignMiddle,
    handleHorizontalDistribution,
    handleVerticalDistribution,
  };
}

export default useAlignment;
