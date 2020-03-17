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
import styled from 'styled-components';
import { rgba } from 'polished';
import { useEffect, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Numeric, Row } from '../form';
import { calculateTextHeight } from '../../utils/textMeasurements';
import { ReactComponent as AlignBottom } from '../../icons/align_bottom.svg';
import { ReactComponent as AlignTop } from '../../icons/align_top.svg';
import { ReactComponent as AlignCenter } from '../../icons/align_center.svg';
import { ReactComponent as AlignMiddle } from '../../icons/align_middle.svg';
import { ReactComponent as AlignLeft } from '../../icons/align_left.svg';
import { ReactComponent as AlignRight } from '../../icons/align_right.svg';
import { ReactComponent as HorizontalDistribute } from '../../icons/horizontal_distribute.svg';
import { ReactComponent as VerticalDistribute } from '../../icons/vertical_distribute.svg';
import { dataPixels } from '../../units/dimensions';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';
import getBoundRect, { calcRotatedObjectPositionAndSize } from './utils/getBoundRect';
import removeUnsetValues from './utils/removeUnsetValues';

const IconButton = styled.button`
  display: flex;
  width: 32px;
  height: 32px;
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

  ${({ disabled }) =>
    disabled &&
    `
    pointer-events: none;
		opacity: .2;
	`}

  svg {
    color: ${({ theme }) => theme.colors.mg.v2};
    width: 28px;
    height: 28px;
  }
`;

function ElementAlignmentPanel({ selectedElements, onSetProperties }) {
  const boundRect = getBoundRect(selectedElements);
  const isFill = getCommonValue(selectedElements, 'isFill');

  const isJustifyEnabled = selectedElements.length < 2;
  const isDistributionEnabled = selectedElements.length < 3;

  const handleAlignLeft = () => {
    onSetProperties((properties) => {
      const { x, y, width, height, rotationAngle } = properties;
      let offSetX = 0;
      if (rotationAngle) {
        const { width: newWidth } = calcRotatedObjectPositionAndSize(
          rotationAngle,
          x,
          y,
          width,
          height
        );
        offSetX = (newWidth - width) / 2;
      }
      return {
        x: boundRect.startX + offSetX,
      };
    });
  };

  const handleAlignCenter = () => {
    const centerX = (boundRect.endX + boundRect.startX) / 2;
    onSetProperties((properties) => {
      const { x, y, width, height, rotationAngle } = properties;
      let offSetX = 0;
      if (rotationAngle) {
        const { width: newWidth } = calcRotatedObjectPositionAndSize(
          rotationAngle,
          x,
          y,
          width,
          height
        );
        offSetX = (newWidth - width) / 2;
      }
      return {
        x: centerX - width / 2 + offSetX,
      };
    });
  };

  const handleAlignRight = () => {
    onSetProperties((properties) => {
      const { x, y, width, height, rotationAngle } = properties;
      let offSetX = 0;
      if (rotationAngle) {
        const { width: newWidth } = calcRotatedObjectPositionAndSize(
          rotationAngle,
          x,
          y,
          width,
          height
        );
        offSetX = (newWidth - width) / 2;
      }
      return {
        x: boundRect.endX - width + offSetX,
      };
    });
  };

  const handleAlignTop = () => {
    onSetProperties((properties) => {
      const { x, y, width, height, rotationAngle } = properties;
      let offSetY = 0;
      if (rotationAngle) {
        const { height: newHeight } = calcRotatedObjectPositionAndSize(
          rotationAngle,
          x,
          y,
          width,
          height
        );
        offSetY = (newHeight - height) / 2;
      }
      return {
        y: boundRect.startY - offSetY,
      };
    });
  };

  const handleAlignMiddle = () => {
    const centerY = (boundRect.endY + boundRect.startY) / 2;
    onSetProperties((properties) => {
      const { x, y, width, height, rotationAngle } = properties;
      let offSetY = 0;
      if (rotationAngle) {
        const { height: newHeight } = calcRotatedObjectPositionAndSize(
          rotationAngle,
          x,
          y,
          width,
          height
        );
        offSetY = (newHeight - height) / 2;
      }
      return {
        y: centerY - height / 2 - offSetY,
      };
    });
  };

  const handleAlignBottom = () => {
    onSetProperties((properties) => {
      const { x, y, width, height, rotationAngle } = properties;
      let offSetY = 0;
      if (rotationAngle) {
        const { height: newHeight } = calcRotatedObjectPositionAndSize(
          rotationAngle,
          x,
          y,
          width,
          height
        );
        offSetY = (newHeight - height) / 2;
      }
      return {
        y: boundRect.endY - height - offSetY,
      };
    });
  };

  return (
    <SimplePanel name="style" title={__('Element Alignment', 'web-stories')}>
      <Row>
        <IconButton disabled={isDistributionEnabled}>
          <HorizontalDistribute />
        </IconButton>
        <IconButton disabled={isDistributionEnabled}>
          <VerticalDistribute />
        </IconButton>
        <IconButton disabled={isJustifyEnabled} onClick={handleAlignLeft}>
          <AlignLeft />
        </IconButton>
        <IconButton disabled={isJustifyEnabled} onClick={handleAlignCenter}>
          <AlignCenter />
        </IconButton>
        <IconButton disabled={isJustifyEnabled} onClick={handleAlignRight}>
          <AlignRight />
        </IconButton>
        <IconButton disabled={isJustifyEnabled} onClick={handleAlignTop}>
          <AlignTop />
        </IconButton>
        <IconButton disabled={isJustifyEnabled} onClick={handleAlignMiddle}>
          <AlignMiddle />
        </IconButton>
        <IconButton disabled={isJustifyEnabled} onClick={handleAlignBottom}>
          <AlignBottom />
        </IconButton>
      </Row>
    </SimplePanel>
  );
}

ElementAlignmentPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default ElementAlignmentPanel;
