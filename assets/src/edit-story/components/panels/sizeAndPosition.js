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
import { useEffect, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Button, InputGroup } from '../form';
import { dataPixels } from '../../units';
import useStory from '../../app/story/useStory';
import { getDefinitionForType } from '../../elements';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';
import FlipControls from './shared/flipControls';

function SizeAndPositionPanel({ selectedElements, onSetProperties }) {
  const rotationAngle = getCommonValue(selectedElements, 'rotationAngle');
  // Size
  const width = getCommonValue(selectedElements, 'width');
  const height = getCommonValue(selectedElements, 'height');
  // The x/y/w/h/r are kept unchanged so that toggling fill will return
  // the element to the previous non-fill position/size.
  const isFill = getCommonValue(selectedElements, 'isFill');

  // Flipping.
  const flip = getCommonValue(selectedElements, 'flip');

  const [state, setState] = useState({
    width,
    height,
    isFill,
    flip,
    rotationAngle,
  });
  const [lockRatio, setLockRatio] = useState(true);

  let { isMedia } = getDefinitionForType(selectedElements[0].type);
  if (selectedElements.length > 1) {
    isMedia = false;
  }

  const {
    actions: { setBackgroundElement },
  } = useStory();

  useEffect(() => {
    setState({ width, height, isFill, rotationAngle, flip });
  }, [width, height, isFill, rotationAngle, flip]);
  const handleSubmit = (evt) => {
    onSetProperties(({ width: oldWidth, height: oldHeight }) => {
      let { width: newWidth, height: newHeight } = state;
      if (lockRatio && (newHeight === '' || newWidth === '')) {
        const ratio = oldWidth / oldHeight;
        if (newWidth === '') {
          newWidth = dataPixels(newHeight * ratio);
        } else {
          newHeight = dataPixels(newWidth / ratio);
        }
      }
      return { ...state, width: newWidth, height: newHeight };
    });
    evt.preventDefault();
  };

  const handleClick = () => {
    const newState = { ...state, isFill: !state.isFill };
    setState(newState);
    onSetProperties(newState);
  };
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
    onSetProperties(newState);
  };

  return (
    <SimplePanel
      name="size"
      title={__('Size and Position', 'web-stories')}
      onSubmit={handleSubmit}
    >
      {isMedia && (
        <Button onClick={handleSetBackground}>
          {__('Set as background', 'web-stories')}
        </Button>
      )}
      <InputGroup
        label={__('Width', 'web-stories')}
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
        postfix={_x('px', 'pixels, the measurement of size', 'web-stories')}
        disabled={isFill}
      />
      <InputGroup
        label={__('Height', 'web-stories')}
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
        postfix={_x('px', 'pixels, the measurement of size', 'web-stories')}
        disabled={isFill}
      />
      <InputGroup
        type="checkbox"
        label={__('Keep ratio', 'web-stories')}
        value={lockRatio}
        onChange={setLockRatio}
        disabled={isFill}
      />
      {isMedia && (
        <Button onClick={handleClick}>
          {state.isFill
            ? __('Unset as fill', 'web-stories')
            : __('Set as fill', 'web-stories')}
        </Button>
      )}
      <InputGroup
        label={__('Rotation angle', 'web-stories')}
        value={state.rotationAngle}
        isMultiple={rotationAngle === ''}
        onChange={(value) =>
          setState({
            ...state,
            rotationAngle:
              isNaN(value) || value === '' ? '' : parseFloat(value),
          })
        }
        postfix={_x('deg', 'Degrees, 0 - 360. ', 'web-stories')}
        disabled={isFill}
      />
      {isMedia && (
        <FlipControls properties={{ flip }} setState={setState} state={state} />
      )}
    </SimplePanel>
  );
}

SizeAndPositionPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default SizeAndPositionPanel;
