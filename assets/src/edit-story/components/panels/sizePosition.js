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
  usePresubmitHandler,
  MULTIPLE_VALUE,
} from '../form';
import { dataPixels } from '../../units';
import { PAGE_WIDTH, PAGE_HEIGHT } from '../../constants';
import { Lock as Locked, Unlock as Unlocked } from '../../icons';

import useStory from '../../app/story/useStory';
import { getDefinitionForType } from '../../elements';
import clamp from '../../utils/clamp';
import { SimplePanel } from './panel';
import { getCommonValue, useCommonObjectValue } from './utils';
import FlipControls from './shared/flipControls';

const DEFAULT_FLIP = { horizontal: false, vertical: false };
const MIN_MAX = {
  // TODO: with %360 logic this is not used, but can be utilized via keyboard arrows
  ROTATION: {
    MIN: -360,
    MAX: 360,
  },
  WIDTH: {
    MIN: 1,
    MAX: 1000,
  },
  HEIGHT: {
    MIN: 1,
    MAX: 1000,
  },
  X: {
    MIN: 0,
    MAX: PAGE_WIDTH,
  },
  Y: {
    MIN: 0,
    MAX: PAGE_HEIGHT,
  },
};

const StyledToggle = styled(Toggle)`
  margin: 0 10px;
`;

const Spacer = styled.span`
  display: block;
  width: 50px;
  flex-shrink: 0;
`;

function isNum(v) {
  return typeof v === 'number' && !isNaN(v);
}

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

  // Recalculate width/height if ratio locked.
  usePresubmitHandler(
    (
      newElement,
      { width: newWidth, height: newHeight },
      { width: oldWidth, height: oldHeight }
    ) => {
      const { type } = newElement;

      const isResizeWidth = Boolean(newWidth);
      const isResizeHeight = Boolean(newHeight);
      if (!isResizeWidth && !isResizeHeight) {
        return null;
      }

      // Use resize rules if available.
      const { updateForResizeEvent } = getDefinitionForType(type);
      if (updateForResizeEvent) {
        const direction = [isResizeWidth ? 1 : 0, isResizeHeight ? 1 : 0];
        return updateForResizeEvent(
          newElement,
          direction,
          clamp(newWidth, MIN_MAX.WIDTH),
          clamp(newHeight, MIN_MAX.HEIGHT)
        );
      }

      // Fallback to ratio.
      if (lockAspectRatio) {
        const ratio = oldWidth / oldHeight;
        if (!isResizeWidth) {
          return {
            width: clamp(dataPixels(newHeight * ratio), MIN_MAX.WIDTH),
          };
        }
        if (!isResizeHeight) {
          return {
            height: clamp(dataPixels(newWidth / ratio), MIN_MAX.HEIGHT),
          };
        }
      }

      return null;
    },
    [lockAspectRatio]
  );

  usePresubmitHandler(({ rotationAngle: newRotationAngle }) => {
    return {
      rotationAngle: newRotationAngle % 360,
    };
  }, []);

  usePresubmitHandler(
    ({ x: newX, y: newY, width: newWidth, height: newHeight }) => {
      return {
        x: clamp(newX, { ...MIN_MAX.X, MIN: MIN_MAX.X.MIN - newWidth }),
        y: clamp(newY, { ...MIN_MAX.Y, MIN: MIN_MAX.Y.MIN - newHeight }),
      };
    },
    []
  );

  const setDimensionMinMax = useCallback(
    (value, ratio, minmax) => {
      if (lockAspectRatio && value >= minmax.MAX) {
        return clamp(minmax.MAX * ratio, minmax);
      }

      return clamp(value, minmax);
    },
    [lockAspectRatio]
  );

  usePresubmitHandler(
    ({ height: newHeight }, { width: oldWidth, height: oldHeight }) => {
      const ratio = oldHeight / oldWidth;
      newHeight = clamp(newHeight, MIN_MAX.HEIGHT);
      if (isNum(ratio)) {
        return {
          height: setDimensionMinMax(
            dataPixels(newHeight),
            ratio,
            MIN_MAX.HEIGHT
          ),
        };
      }
      return {
        height: clamp(newHeight, MIN_MAX.HEIGHT),
      };
    },
    [height, lockAspectRatio]
  );

  usePresubmitHandler(
    ({ width: newWidth }, { width: oldWidth, height: oldHeight }) => {
      const ratio = oldWidth / oldHeight;
      newWidth = clamp(newWidth, MIN_MAX.WIDTH);
      if (isNum(ratio)) {
        return {
          width: setDimensionMinMax(dataPixels(newWidth), ratio, MIN_MAX.WIDTH),
        };
      }
      return {
        width: clamp(newWidth, MIN_MAX.WIDTH),
      };
    },
    [width, lockAspectRatio]
  );

  const handleSetBackground = useCallback(() => {
    combineElements({
      firstId: selectedElements[0].id,
      secondId: currentBackgroundId,
    });
  }, [selectedElements, combineElements, currentBackgroundId]);

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
          min={MIN_MAX.X.MIN - width}
          max={MIN_MAX.X.MAX}
          onChange={(value) => pushUpdate({ x: value })}
          aria-label={__('X position', 'web-stories')}
          canBeNegative
        />
        <Spacer />
        <BoxedNumeric
          suffix={_x('Y', 'Position on Y axis', 'web-stories')}
          value={y}
          min={MIN_MAX.Y.MIN - height}
          max={MIN_MAX.Y.MAX}
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
          value={height}
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
