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
import { useCallback, useMemo, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Button, Row, Numeric, Toggle, usePresubmitHandler } from '../form';
import { dataPixels } from '../../units';
import { ReactComponent as Locked } from '../../icons/lock.svg';
import { ReactComponent as Unlocked } from '../../icons/unlock.svg';
import { ReactComponent as Fullbleed } from '../../icons/fullbleed.svg';
import useStory from '../../app/story/useStory';
import { getDefinitionForType } from '../../elements';
import { SimplePanel } from './panel';
import { getCommonValue, useCommonObjectValue } from './utils';
import FlipControls from './shared/flipControls';

const DEFAULT_FLIP = { horizontal: false, vertical: false };

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
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
  const width = getCommonValue(selectedElements, 'width');
  const height = getCommonValue(selectedElements, 'height');
  const isFill = getCommonValue(selectedElements, 'isFill', false);
  const rotationAngle = getCommonValue(selectedElements, 'rotationAngle');
  const flip = useCommonObjectValue(selectedElements, 'flip', DEFAULT_FLIP);

  const origRatio = useMemo(() => {
    const origWidth = getCommonValue(submittedSelectedElements, 'width');
    const origHeight = getCommonValue(submittedSelectedElements, 'height');
    return origWidth / origHeight;
  }, [submittedSelectedElements]);
  const [lockRatio, setLockRatio] = useState(true);

  const {
    actions: { setBackgroundElement },
  } = useStory();

  const isSingleElement = selectedElements.length === 1;
  const { isMedia, canFill } = getDefinitionForType(selectedElements[0].type);

  const canFlip = selectedElements.every(
    ({ type }) => getDefinitionForType(type).canFlip
  );

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
        return updateForResizeEvent(newElement, direction, newWidth, newHeight);
      }

      // Fallback to ratio.
      if (lockRatio) {
        const ratio = oldWidth / oldHeight;
        if (!isResizeWidth) {
          return { width: dataPixels(newHeight * ratio) };
        }
        if (!isResizeHeight) {
          return { height: dataPixels(newWidth / ratio) };
        }
      }

      return null;
    },
    [lockRatio]
  );

  const handleSetBackground = useCallback(() => {
    pushUpdate(
      {
        isBackground: true,
        opacity: 100,
        overlay: null,
      },
      true
    );
    setBackgroundElement({ elementId: selectedElements[0].id });
  }, [selectedElements, pushUpdate, setBackgroundElement]);

  return (
    <SimplePanel name="size" title={__('Size & position', 'web-stories')}>
      {isMedia && isSingleElement && (
        <Row expand>
          <Button onClick={handleSetBackground} fullWidth>
            {__('Set as background', 'web-stories')}
          </Button>
        </Row>
      )}
      {/** Width/height & lock ratio */}
      <Row expand>
        <BoxedNumeric
          data-testid="width"
          suffix={_x('W', 'The Width dimension', 'web-stories')}
          value={width}
          onChange={(value) => {
            const newWidth = value;
            let newHeight = height;
            if (lockRatio) {
              if (newWidth === '') {
                newHeight = '';
              } else if (isNum(newWidth / origRatio)) {
                newHeight = dataPixels(newWidth / origRatio);
              }
            }
            pushUpdate({
              width: newWidth,
              height: newHeight,
            });
          }}
          disabled={isFill}
        />
        <Toggle
          data-testid="lockRatio"
          icon={<Locked />}
          uncheckedIcon={<Unlocked />}
          value={lockRatio}
          onChange={setLockRatio}
          disabled={isFill}
        />
        <BoxedNumeric
          data-testid="height"
          suffix={_x('H', 'The Height dimension', 'web-stories')}
          value={height}
          onChange={(value) => {
            const newHeight = value;
            let newWidth = width;
            if (lockRatio) {
              if (newHeight === '') {
                newWidth = '';
              } else if (isNum(newHeight * origRatio)) {
                newWidth = dataPixels(newHeight * origRatio);
              }
            }
            pushUpdate({
              height: newHeight,
              width: newWidth,
            });
          }}
          disabled={isFill}
        />
      </Row>
      {/** Rotation and Flipping */}
      <Row expand={false} spaceBetween={true}>
        <BoxedNumeric
          suffix={__('Rotate', 'web-stories')}
          symbol={_x('°', 'Degrees, 0 - 360. ', 'web-stories')}
          value={rotationAngle}
          onChange={(value) => pushUpdate({ rotationAngle: value })}
          disabled={isFill}
        />
        {canFlip && (
          <FlipControls
            onChange={(value) =>
              pushUpdateForObject('flip', value, DEFAULT_FLIP, true)
            }
            value={flip}
          />
        )}
        {canFill && isSingleElement && (
          <Toggle
            icon={<Fullbleed />}
            value={isFill}
            onChange={(value) => pushUpdate({ isFill: value }, true)}
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
