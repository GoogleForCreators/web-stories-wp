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
import { useEffect, useState, useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Button, Row, Numeric } from '../form';
import { dataPixels } from '../../units';
import { ReactComponent as Locked } from '../../icons/lock.svg';
import { ReactComponent as Unlocked } from '../../icons/unlock.svg';
import { ReactComponent as Fullbleed } from '../../icons/fullbleed.svg';
import Toggle from '../form/toggle';
import useStory from '../../app/story/useStory';
import { getDefinitionForType } from '../../elements';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';
import FlipControls from './shared/flipControls';

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

function SizePositionPanel({ selectedElements, onSetProperties }) {
  const width = getCommonValue(selectedElements, 'width');
  const height = getCommonValue(selectedElements, 'height');
  const isFill = getCommonValue(selectedElements, 'isFill');
  const rotationAngle = getCommonValue(selectedElements, 'rotationAngle');
  const flip = getCommonValue(selectedElements, 'flip');
  const [state, setState] = useState({
    width,
    height,
    flip,
    isFill,
    rotationAngle,
  });
  const [lockRatio, setLockRatio] = useState(true);

  const {
    actions: { setBackgroundElement },
  } = useStory();

  useEffect(() => {
    setState({ width, height, flip, isFill, rotationAngle });
  }, [width, height, isFill, rotationAngle, flip]);

  const updateProperties = useCallback(
    (evt) => {
      onSetProperties(({ width: oldWidth, height: oldHeight }) => {
        const { height: newHeight, width: newWidth } = state;
        const update = { ...state };
        const hasHeightOrWidth = newHeight !== '' || newWidth !== '';

        if (lockRatio && hasHeightOrWidth) {
          const ratio = oldWidth / oldHeight;
          if (newWidth === '') {
            update.width = dataPixels(newHeight * ratio);
          } else {
            update.height = dataPixels(newWidth / ratio);
          }
        }
        return update;
      });
      if (evt) {
        evt.preventDefault();
        evt.stopPropagation();
      }
    },
    [lockRatio, onSetProperties, state]
  );

  useEffect(() => {
    updateProperties();
  }, [state.isFill, updateProperties]);

  const isSingleElement = selectedElements.length === 1;
  const isMedia =
    isSingleElement && getDefinitionForType(selectedElements[0].type).isMedia;

  const canFlip =
    (isMedia || 'square' === selectedElements[0].type) && isSingleElement;

  const handleNumberChange = useCallback(
    (property) => (value) =>
      setState((originalState) => ({
        ...originalState,
        [property]: isNaN(value) || value === '' ? '' : parseFloat(value),
      })),
    [setState]
  );

  const handleFlipChange = useCallback(
    (property) => (value) => {
      setState({
        ...state,
        flip: {
          ...state.flip,
          [property]: value,
        },
      });
    },
    [setState, state]
  );

  const handleSetBackground = () => {
    const newState = {
      ...state,
      isBackground: true,
      opacity: 100,
      overlay: null,
    };
    setState(newState);
    const backgroundId = selectedElements[0].id;
    setBackgroundElement({ elementId: backgroundId });
  };

  return (
    <SimplePanel
      name="size"
      title={__('Size & position', 'web-stories')}
      onSubmit={updateProperties}
    >
      {isMedia && (
        <Row expand>
          <Button onClick={handleSetBackground}>
            {__('Set as background', 'web-stories')}
          </Button>
        </Row>
      )}
      {/** Width/height & lock ratio */}
      <Row expand>
        <BoxedNumeric
          suffix={_x('W', 'The Width dimension', 'web-stories')}
          value={state.width}
          isMultiple={width === ''}
          onChange={(value) => {
            const ratio = width / height;
            const newWidth =
              isNaN(value) || value === '' ? '' : parseFloat(value);
            setState({
              ...state,
              width: newWidth,
              height:
                height !== '' && typeof newWidth === 'number' && lockRatio
                  ? dataPixels(newWidth / ratio)
                  : height,
            });
          }}
          disabled={isFill}
        />
        <Toggle
          icon={<Locked />}
          uncheckedIcon={<Unlocked />}
          value={lockRatio}
          isMultiple={false}
          onChange={(value) => {
            setLockRatio(value);
          }}
          disabled={isFill}
        />
        <BoxedNumeric
          suffix={_x('H', 'The Height dimension', 'web-stories')}
          value={state.height}
          isMultiple={height === ''}
          onChange={(value) => {
            const ratio = width / height;
            const newHeight =
              isNaN(value) || value === '' ? '' : parseFloat(value);
            setState({
              ...state,
              height: newHeight,
              width:
                width !== '' && typeof newHeight === 'number' && lockRatio
                  ? dataPixels(newHeight * ratio)
                  : width,
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
          value={state.rotationAngle}
          isMultiple={rotationAngle === ''}
          onChange={handleNumberChange('rotationAngle')}
          disabled={isFill}
        />
        {canFlip && (
          <>
            <FlipControls onChange={handleFlipChange} value={state.flip} />
            <Toggle
              icon={<Fullbleed />}
              value={state.isFill}
              isMultiple={false}
              onChange={(value) => {
                setState({
                  ...state,
                  isFill: value,
                });
              }}
            />
          </>
        )}
      </Row>
    </SimplePanel>
  );
}

SizePositionPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default SizePositionPanel;
