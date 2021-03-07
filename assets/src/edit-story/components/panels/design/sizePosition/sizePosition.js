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
import { __, _x } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import {
  LockToggle,
  NumericInput,
  Tooltip,
  PLACEMENT,
  Icons,
} from '../../../../../design-system';
import { MULTIPLE_DISPLAY_VALUE, MULTIPLE_VALUE } from '../../../../constants';
import { dataPixels } from '../../../../units';
import { getDefinitionForType } from '../../../../elements';
import { calcRotatedObjectPositionAndSize } from '../../../../utils/getBoundRect';
import { SimplePanel } from '../../panel';
import FlipControls from '../../shared/flipControls';
import { getCommonValue, useCommonObjectValue } from '../../shared';
import usePresubmitHandlers from './usePresubmitHandlers';
import { getMultiSelectionMinMaxXY, isNum } from './utils';
import { MIN_MAX, DEFAULT_FLIP } from './constants';

const Grid = styled.div`
  display: grid;
  grid-template-areas:
    'x . . . y . .'
    'w . d . h . l'
    'r . . . f . .';
  grid-template-columns: 112px 1fr 8px 1fr 112px 1fr 32px;
  grid-template-rows: repeat(3, 36px);
  row-gap: 16px;
  align-items: center;
  justify-items: start;
`;

const Area = styled.div`
  grid-area: ${({ area }) => area};
  width: 100%;
`;

const Dash = styled.div`
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.colors.divider.primary};
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

  const isSingleElement = selectedElements.length === 1;

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

  const getMixedValueProps = useCallback((value) => {
    return {
      isIndeterminate: MULTIPLE_VALUE === value,
      placeholder: MULTIPLE_VALUE === value ? MULTIPLE_DISPLAY_VALUE : null,
    };
  }, []);

  const disableHeight = !lockAspectRatio && hasText;
  return (
    <SimplePanel name="size" title={__('Size & position', 'web-stories')}>
      <Grid>
        <Area area="x">
          <NumericInput
            suffix={_x('X', 'Position on X axis', 'web-stories')}
            value={x}
            min={minMaxXY.minX}
            max={minMaxXY.maxX}
            onChange={(evt) => {
              const value = Number(evt.target.value);
              pushUpdate({ x: value }, true);
            }}
            aria-label={__('X position', 'web-stories')}
            canBeNegative
            {...getMixedValueProps(x)}
          />
        </Area>
        <Area area="y">
          <NumericInput
            suffix={_x('Y', 'Position on Y axis', 'web-stories')}
            value={y}
            min={minMaxXY.minY}
            max={minMaxXY.maxY}
            onChange={(evt) => {
              const value = Number(evt.target.value);
              pushUpdate({ y: value }, true);
            }}
            aria-label={__('Y position', 'web-stories')}
            canBeNegative
            {...getMixedValueProps(y)}
          />
        </Area>
        {/** Width/height & lock ratio */}
        <Area area="w">
          <NumericInput
            suffix={_x('W', 'The Width dimension', 'web-stories')}
            value={width}
            min={MIN_MAX.WIDTH.MIN}
            max={MIN_MAX.WIDTH.MAX}
            onChange={(evt) => {
              const newWidth = Number(evt.target.value);
              let newHeight = height;
              if (lockAspectRatio) {
                if (newWidth === '') {
                  newHeight = '';
                } else if (isNum(newWidth / origRatio)) {
                  newHeight = dataPixels(newWidth / origRatio);
                }
              }
              pushUpdate(getUpdateObject(newWidth, newHeight), true);
            }}
            aria-label={__('Width', 'web-stories')}
            {...getMixedValueProps(width)}
          />
        </Area>
        <Area area="d">
          <Dash />
        </Area>
        <Area area="h">
          <NumericInput
            suffix={_x('H', 'The Height dimension', 'web-stories')}
            value={disableHeight ? '' : height}
            placeholder={disableHeight ? __('AUTO', 'web-stories') : ''}
            disabled={disableHeight}
            min={MIN_MAX.HEIGHT.MIN}
            max={MIN_MAX.HEIGHT.MAX}
            onChange={(evt) => {
              const newHeight = Number(evt.target.value);
              let newWidth = width;
              if (lockAspectRatio) {
                if (newHeight === '') {
                  newWidth = '';
                } else if (isNum(newHeight * origRatio)) {
                  newWidth = dataPixels(newHeight * origRatio);
                }
              }
              pushUpdate(getUpdateObject(newWidth, newHeight), true);
            }}
            aria-label={__('Height', 'web-stories')}
            {...getMixedValueProps(height)}
          />
        </Area>
        <Area area="l">
          <Tooltip
            placement={PLACEMENT.BOTTOM}
            title={__('Constrain proportions', 'web-stories')}
          >
            <LockToggle
              aria-label={__('Aspect ratio lock', 'web-stories')}
              title={__('Constrain proportions', 'web-stories')}
              isLocked={lockAspectRatio}
              onClick={() =>
                pushUpdate({ lockAspectRatio: !lockAspectRatio }, true)
              }
            />
          </Tooltip>
        </Area>
        <Area area="r">
          <NumericInput
            suffix={<Icons.Angle />}
            unit={_x('°', 'Degrees, 0 - 360. ', 'web-stories')}
            value={rotationAngle}
            min={MIN_MAX.ROTATION.MIN}
            max={MIN_MAX.ROTATION.MAX}
            onChange={(evt) => {
              const value = Number(evt.target.value);
              pushUpdate({ rotationAngle: value }, true);
            }}
            aria-label={__('Rotation', 'web-stories')}
            canBeNegative
            {...getMixedValueProps(rotationAngle)}
          />
        </Area>
        {canFlip && (
          <Area area="f">
            <FlipControls
              onChange={(value) =>
                pushUpdateForObject('flip', value, DEFAULT_FLIP, true)
              }
              value={flip}
            />
          </Area>
        )}
      </Grid>
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
