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
import { useCallback, useMemo } from 'react';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  BoxedNumeric,
  Button,
  Row,
  Toggle,
  MULTIPLE_VALUE,
} from '../../../form';
import { dataPixels } from '../../../../units';
import { Lock as Locked, Unlock as Unlocked } from '../../../../icons';
import useStory from '../../../../app/story/useStory';
import { getDefinitionForType } from '../../../../elements';
import { calcRotatedObjectPositionAndSize } from '../../../../utils/getBoundRect';
import { SimplePanel } from '../../panel';
import FlipControls from '../../shared/flipControls';
import { getMediaBaseColor } from '../../../../utils/getMediaBaseColor';
import { getCommonValue, useCommonObjectValue } from '../../shared';
import usePresubmitHandlers from './usePresubmitHandlers';
import { getMultiSelectionMinMaxXY, isNum } from './utils';
import { MIN_MAX, DEFAULT_FLIP } from './constants';

const StyledToggle = styled(Toggle)`
  margin: 0 10px;
`;

const Spacer = styled.span`
  display: block;
  width: 50px;
  flex-shrink: 0;
`;

function SizePositionPanel({
  selectedElements,
  submittedSelectedElements,
  pushUpdate,
  pushUpdateForObject,
}) {
  const x = getCommonValue(selectedElements, 'x');
  const y = getCommonValue(selectedElements, 'y');
  const width = getCommonValue(selectedElements, 'width');
  const height = getCommonValue(selectedElements, 'height');
  const rotationAngle = getCommonValue(selectedElements, 'rotationAngle');
  const flip = useCommonObjectValue(selectedElements, 'flip', DEFAULT_FLIP);

  const origRatio = useMemo(() => {
    const origWidth = getCommonValue(submittedSelectedElements, 'width');
    const origHeight = getCommonValue(submittedSelectedElements, 'height');
    return origWidth / origHeight;
  }, [submittedSelectedElements]);
  const rawLockAspectRatio = getCommonValue(
    selectedElements,
    'lockAspectRatio'
  );

  // When multiple element selected with aspect lock ratio value combined, it treated as true, reversed behavior with padding lock ratio.
  const lockAspectRatio =
    rawLockAspectRatio === MULTIPLE_VALUE ? true : rawLockAspectRatio;

  const { currentPage, combineElements } = useStory((state) => ({
    currentPage: state.state.currentPage,
    combineElements: state.actions.combineElements,
  }));
  const currentBackgroundId = currentPage?.elements[0].id;

  const isSingleElement = selectedElements.length === 1;
  const { isMedia } = getDefinitionForType(selectedElements[0].type);

  const canFlip = selectedElements.every(
    ({ type }) => getDefinitionForType(type).canFlip
  );

  const hasText = selectedElements.some(({ type }) => 'text' === type);

  const actualDimensions = useMemo(() => {
    if (isSingleElement) {
      return calcRotatedObjectPositionAndSize(
        rotationAngle,
        x,
        y,
        width,
        height
      );
    }
    return {};
  }, [rotationAngle, x, y, width, height, isSingleElement]);

  const xOffset = x - actualDimensions.x;
  const yOffset = y - actualDimensions.y;
  const minMaxXY = isSingleElement
    ? {
        minX: MIN_MAX.X.MIN + xOffset - actualDimensions.width,
        minY: MIN_MAX.Y.MIN + yOffset - actualDimensions.height,
        maxX: MIN_MAX.X.MAX + xOffset,
        maxY: MIN_MAX.Y.MAX + yOffset,
      }
    : getMultiSelectionMinMaxXY(selectedElements);

  const getUpdateObject = (nWidth, nHeight) =>
    rawLockAspectRatio === MULTIPLE_VALUE
      ? {
          lockAspectRatio,
          height: nHeight,
          width: nWidth,
        }
      : {
          height: nHeight,
          width: nWidth,
        };

  usePresubmitHandlers(lockAspectRatio, height, width);

  const handleSetBackground = useCallback(() => {
    const setBackground = (baseColor) => {
      if (!baseColor) {
        combineElements({
          firstElement: selectedElements[0],
          secondId: currentBackgroundId,
        });
      } else {
        combineElements({
          firstElement: {
            ...selectedElements[0],
            resource: {
              ...selectedElements[0].resource,
              baseColor,
            },
          },
          secondId: currentBackgroundId,
        });
      }
    };
    if (selectedElements[0].resource.baseColor) {
      setBackground();
    } else {
      getMediaBaseColor(selectedElements[0].resource, setBackground);
    }
  }, [selectedElements, combineElements, currentBackgroundId]);

  const disableHeight = !lockAspectRatio && hasText;
  return (
    <SimplePanel name="size" title={__('Size & position', 'web-stories')}>
      {isMedia && isSingleElement && (
        <Row expand>
          <Button onClick={handleSetBackground} fullWidth>
            {__('Set as background', 'web-stories')}
          </Button>
        </Row>
      )}
      {/** X/Y */}
      <Row expand>
        <BoxedNumeric
          suffix={_x('X', 'Position on X axis', 'web-stories')}
          value={x}
          min={minMaxXY.minX}
          max={minMaxXY.maxX}
          onChange={(value) => pushUpdate({ x: value })}
          aria-label={__('X position', 'web-stories')}
          canBeNegative
        />
        <Spacer />
        <BoxedNumeric
          suffix={_x('Y', 'Position on Y axis', 'web-stories')}
          value={y}
          min={minMaxXY.minY}
          max={minMaxXY.maxY}
          onChange={(value) => pushUpdate({ y: value })}
          aria-label={__('Y position', 'web-stories')}
          canBeNegative
        />
      </Row>
      {/** Width/height & lock ratio */}
      <Row expand>
        <BoxedNumeric
          suffix={_x('W', 'The Width dimension', 'web-stories')}
          value={width}
          min={MIN_MAX.WIDTH.MIN}
          max={MIN_MAX.WIDTH.MAX}
          onChange={(value) => {
            const newWidth = value;
            let newHeight = height;
            if (lockAspectRatio) {
              if (newWidth === '') {
                newHeight = '';
              } else if (isNum(newWidth / origRatio)) {
                newHeight = dataPixels(newWidth / origRatio);
              }
            }
            pushUpdate(getUpdateObject(newWidth, newHeight));
          }}
          aria-label={__('Width', 'web-stories')}
        />
        <StyledToggle
          aria-label={__('Aspect ratio lock', 'web-stories')}
          title={__('Constrain proportions', 'web-stories')}
          icon={<Locked />}
          uncheckedIcon={<Unlocked />}
          value={lockAspectRatio}
          onChange={() => pushUpdate({ lockAspectRatio: !lockAspectRatio })}
        />
        <BoxedNumeric
          suffix={_x('H', 'The Height dimension', 'web-stories')}
          value={disableHeight ? '' : height}
          placeholder={disableHeight ? __('AUTO', 'web-stories') : ''}
          disabled={disableHeight}
          min={MIN_MAX.HEIGHT.MIN}
          max={MIN_MAX.HEIGHT.MAX}
          onChange={(value) => {
            const newHeight = value;
            let newWidth = width;
            if (lockAspectRatio) {
              if (newHeight === '') {
                newWidth = '';
              } else if (isNum(newHeight * origRatio)) {
                newWidth = dataPixels(newHeight * origRatio);
              }
            }
            pushUpdate(getUpdateObject(newWidth, newHeight));
          }}
          aria-label={__('Height', 'web-stories')}
        />
      </Row>
      {/** Rotation and Flipping */}
      <Row expand={false} spaceBetween={true}>
        <BoxedNumeric
          suffix={__('Rotate', 'web-stories')}
          symbol={_x('°', 'Degrees, 0 - 360. ', 'web-stories')}
          value={rotationAngle}
          min={MIN_MAX.ROTATION.MIN}
          max={MIN_MAX.ROTATION.MAX}
          onChange={(value) => pushUpdate({ rotationAngle: value })}
          aria-label={__('Rotation', 'web-stories')}
          canBeNegative
        />
        {canFlip && (
          <FlipControls
            onChange={(value) =>
              pushUpdateForObject('flip', value, DEFAULT_FLIP, true)
            }
            value={flip}
          />
        )}
      </Row>
    </SimplePanel>
  );
}

SizePositionPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  submittedSelectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
  pushUpdateForObject: PropTypes.func.isRequired,
};

export default SizePositionPanel;
