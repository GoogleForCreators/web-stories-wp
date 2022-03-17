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
import styled, { css } from 'styled-components';
import { useCallback, useMemo, useRef } from '@googleforcreators/react';
import { __, _x } from '@googleforcreators/i18n';
import stickers from '@googleforcreators/stickers';
import {
  calcRotatedObjectPositionAndSize,
  dataPixels,
} from '@googleforcreators/units';
import {
  Button,
  LockToggle,
  NumericInput,
  Icons,
  BUTTON_TYPES,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  TRACKING_EVENTS,
  Tooltip,
  usePerformanceTracking,
} from '@googleforcreators/design-system';
import { getDefinitionForType } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { SimplePanel } from '../../panel';
import FlipControls from '../../shared/flipControls';
import {
  focusStyle,
  getCommonValue,
  inputContainerStyleOverride,
  useCommonObjectValue,
} from '../../shared';
import useStory from '../../../../app/story/useStory';
import { MULTIPLE_VALUE, MULTIPLE_DISPLAY_VALUE } from '../../../../constants';
import usePresubmitHandlers from './usePresubmitHandlers';
import { getMultiSelectionMinMaxXY, isNum } from './utils';
import { MIN_MAX, DEFAULT_FLIP } from './constants';
import OpacityControls from './opacity';
import RadiusControls from './radius';

const StyledLockToggle = styled(LockToggle)`
  ${focusStyle};
`;

function getStickerAspectRatio(element) {
  return stickers?.[element?.sticker?.type].aspectRatio || 1;
}

const gridWithoutFlip = css`
  grid-template-areas:
    ${({ isSingleMedia }) => (isSingleMedia ? `'b b b b b . .'` : null)}
    'x . . . y . .'
    'w . d . h . l'
    'r . . . o . .'
    'c c c c c c c';
`;

const unlockedRadiusLines = `
  'o . . . . . .'
  'c c c c c c c'
`;
const gridWithFlip = css`
  grid-template-areas:
    ${({ isSingleMedia }) => (isSingleMedia ? `'b b b b b . .'` : null)}
    'x . . . y . .'
    'w . d . h . l'
    'r . . . f . .'
    ${({ unlockedRadius }) =>
      !unlockedRadius ? `'o . . . c c c'` : unlockedRadiusLines};
`;

const Grid = styled.div`
  display: grid;
  ${({ canFlip }) => (canFlip ? gridWithFlip : gridWithoutFlip)}
  grid-template-columns: 1fr 4px 8px 4px 1fr 8px 32px;
  grid-template-rows: repeat(4, 36px);
  row-gap: 16px;
  align-items: center;
  justify-items: start;
  margin-bottom: 16px;
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

const StyledButton = styled(Button)`
  padding: 10px 16px;
  width: 100%;

  ${focusStyle};
`;

function SizePositionPanel(props) {
  const {
    selectedElements,
    submittedSelectedElements,
    pushUpdate,
    pushUpdateForObject,
  } = props;

  const x = getCommonValue(selectedElements, 'x');
  const y = getCommonValue(selectedElements, 'y');
  const width = getCommonValue(selectedElements, 'width');
  const height = getCommonValue(selectedElements, 'height');
  const rotationAngle = getCommonValue(selectedElements, 'rotationAngle');
  const flip = useCommonObjectValue(selectedElements, 'flip', DEFAULT_FLIP);
  const borderRadius = useCommonObjectValue(selectedElements, 'borderRadius', {
    locked: true,
  });

  const origRatio = useMemo(() => {
    const origWidth = getCommonValue(submittedSelectedElements, 'width');
    const origHeight = getCommonValue(submittedSelectedElements, 'height');
    return origWidth / origHeight;
  }, [submittedSelectedElements]);
  const rawLockAspectRatio = getCommonValue(
    selectedElements,
    'lockAspectRatio'
  );

  const bgButtonRef = useRef(null);
  usePerformanceTracking({
    node: bgButtonRef.current,
    eventData: TRACKING_EVENTS.SET_BACKGROUND_MEDIA,
  });

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

  const isAspectAlwaysLocked = selectedElements.some(
    ({ type }) => getDefinitionForType(type).isAspectAlwaysLocked
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
    combineElements({
      firstElement: selectedElements[0],
      secondId: currentBackgroundId,
    });
  }, [selectedElements, combineElements, currentBackgroundId]);

  const disableHeight = !lockAspectRatio && hasText;
  const enabledHeightPlaceholder =
    MULTIPLE_VALUE === height ? MULTIPLE_DISPLAY_VALUE : null;
  const heightPlaceholder = disableHeight
    ? __('Auto', 'web-stories')
    : enabledHeightPlaceholder;

  const getMixedValueProps = useCallback((value) => {
    return {
      isIndeterminate: MULTIPLE_VALUE === value,
      placeholder: MULTIPLE_VALUE === value ? MULTIPLE_DISPLAY_VALUE : null,
    };
  }, []);
  return (
    <SimplePanel name="size" title={__('Selection', 'web-stories')}>
      <Grid
        isSingleMedia={isMedia && isSingleElement}
        canFlip={canFlip}
        unlockedRadius={!borderRadius.locked}
      >
        {isMedia && isSingleElement && (
          <Area area="b">
            <StyledButton
              ref={bgButtonRef}
              onClick={handleSetBackground}
              type={BUTTON_TYPES.SECONDARY}
              size={BUTTON_SIZES.SMALL}
              variant={BUTTON_VARIANTS.RECTANGLE}
            >
              {__('Set as background', 'web-stories')}
            </StyledButton>
          </Area>
        )}
        <Area area="x">
          <NumericInput
            suffix={_x('X', 'Position on X axis', 'web-stories')}
            value={x}
            min={minMaxXY.minX}
            max={minMaxXY.maxX}
            onChange={(evt, value) => pushUpdate({ x: value }, true)}
            aria-label={__('X position', 'web-stories')}
            canBeNegative
            {...getMixedValueProps(x)}
            containerStyleOverride={inputContainerStyleOverride}
          />
        </Area>
        <Area area="y">
          <NumericInput
            suffix={_x('Y', 'Position on Y axis', 'web-stories')}
            value={y}
            min={minMaxXY.minY}
            max={minMaxXY.maxY}
            onChange={(evt, value) => pushUpdate({ y: value }, true)}
            aria-label={__('Y position', 'web-stories')}
            canBeNegative
            {...getMixedValueProps(y)}
            containerStyleOverride={inputContainerStyleOverride}
          />
        </Area>
        {/** Width/height & lock ratio */}
        <Area area="w">
          <NumericInput
            suffix={_x('W', 'The Width dimension', 'web-stories')}
            value={width}
            min={MIN_MAX.WIDTH.MIN}
            max={MIN_MAX.WIDTH.MAX}
            onChange={(evt, value) => {
              const newWidth = value;
              let newHeight = height;
              if (lockAspectRatio) {
                if (newWidth === '') {
                  newHeight = '';
                } else if (isNum(newWidth / origRatio)) {
                  newHeight = dataPixels(newWidth / origRatio);
                }
              }
              pushUpdate((element) => {
                // For stickers, we maintain aspect ratio of the sticker
                // regardless of input and selected elements.
                if (element?.type === 'sticker') {
                  const aspectRatio = getStickerAspectRatio(element);
                  return getUpdateObject(
                    newWidth,
                    Math.floor(newWidth / aspectRatio)
                  );
                }
                return getUpdateObject(newWidth, newHeight);
              }, true);
            }}
            aria-label={__('Width', 'web-stories')}
            {...getMixedValueProps(width)}
            containerStyleOverride={inputContainerStyleOverride}
          />
        </Area>
        <Area area="d">
          <Dash />
        </Area>
        <Area area="h">
          <NumericInput
            suffix={_x('H', 'The Height dimension', 'web-stories')}
            value={disableHeight ? '' : height}
            disabled={disableHeight}
            min={MIN_MAX.HEIGHT.MIN}
            max={MIN_MAX.HEIGHT.MAX}
            onChange={(evt, value) => {
              const newHeight = value;
              let newWidth = width;
              if (lockAspectRatio) {
                if (newHeight === '') {
                  newWidth = '';
                } else if (isNum(newHeight * origRatio)) {
                  newWidth = dataPixels(newHeight * origRatio);
                }
              }
              pushUpdate((element) => {
                // For stickers, we maintain aspect ratio of the sticker
                // regardless of input and selected elements.
                if (element?.type === 'sticker') {
                  const aspectRatio = getStickerAspectRatio(element);
                  return getUpdateObject(
                    Math.floor(newHeight * aspectRatio),
                    newHeight
                  );
                }
                return getUpdateObject(newWidth, newHeight);
              }, true);
            }}
            aria-label={__('Height', 'web-stories')}
            isIndeterminate={MULTIPLE_VALUE === height}
            placeholder={heightPlaceholder}
            containerStyleOverride={inputContainerStyleOverride}
          />
        </Area>
        <Area area="l">
          <Tooltip title={__('Lock aspect ratio', 'web-stories')}>
            <StyledLockToggle
              aria-label={__('Lock aspect ratio', 'web-stories')}
              title={__('Lock aspect ratio', 'web-stories')}
              isLocked={lockAspectRatio || isAspectAlwaysLocked}
              disabled={isAspectAlwaysLocked}
              onClick={() =>
                !isAspectAlwaysLocked &&
                pushUpdate({ lockAspectRatio: !lockAspectRatio }, true)
              }
            />
          </Tooltip>
        </Area>
        <Area area="r">
          <NumericInput
            suffix={<Icons.Angle />}
            unit={_x('°', 'Degrees, 0 - 360.', 'web-stories')}
            value={rotationAngle}
            min={MIN_MAX.ROTATION.MIN}
            max={MIN_MAX.ROTATION.MAX}
            onChange={(evt, value) =>
              pushUpdate({ rotationAngle: value }, true)
            }
            aria-label={__('Rotation', 'web-stories')}
            canBeNegative
            {...getMixedValueProps(rotationAngle)}
            containerStyleOverride={inputContainerStyleOverride}
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
        <Area area="o">
          <OpacityControls {...props} />
        </Area>
        <Area area="c">
          <RadiusControls {...props} />
        </Area>
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
