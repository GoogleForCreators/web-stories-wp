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

/**
 * WordPress dependencies
 */
import { useEffect, useState, useCallback } from '@wordpress/element';
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Spacer, Button, Row, Numeric } from '../form';
import { dataPixels } from '../../units';
import Locked from '../../icons/lock.svg';
import Unlocked from '../../icons/unlock.svg';
import Fullbleed from '../../icons/fullbleed.svg';
import FlipVertical from '../../icons/flip_vertical.svg';
import FlipHorizontal from '../../icons/flip_horizontal.svg';
import Toggle from '../form/toggle';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';

function SizePanel({ selectedElements, onSetProperties }) {
  const x = getCommonValue(selectedElements, 'x');
  const y = getCommonValue(selectedElements, 'y');
  const width = getCommonValue(selectedElements, 'width');
  const height = getCommonValue(selectedElements, 'height');
  const isFill = getCommonValue(selectedElements, 'isFill');
  const rotationAngle = getCommonValue(selectedElements, 'rotationAngle');
  const [state, setState] = useState({
    x,
    y,
    width,
    height,
    isFill,
    rotationAngle,
  });
  const [lockRatio, setLockRatio] = useState(true);
  useEffect(() => {
    setState({ x, y, width, height, isFill, rotationAngle });
  }, [x, y, width, height, isFill, rotationAngle]);
  useEffect(() => {
    updateProperties();
  }, [state.isFill, updateProperties]);
  const updateProperties = useCallback(
    (evt) => {
      onSetProperties(({ width: oldWidth, height: oldHeight }) => {
        const { height: newHeight, width: newWidth, ...rest } = state;
        const update = { width: newWidth, height: newHeight, ...rest };
        if (
          lockRatio &&
          (newHeight === '' || newWidth === '') &&
          !(newHeight === '' && newWidth === '')
        ) {
          const ratio = oldWidth / oldHeight;
          if (newWidth === '') {
            update.width = dataPixels(newHeight * ratio);
          } else if (newHeight === '') {
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
  return (
    <SimplePanel
      name="size"
      title={__('Size & position', 'web-stories')}
      onSubmit={updateProperties}
    >
      {/** Position */}
      <Row expand>
        <Numeric
          prefix={_x('X', 'The X axis', 'web-stories')}
          value={state.x}
          isMultiple={x === ''}
          onChange={(value) =>
            setState({
              ...state,
              x: isNaN(value) || value === '' ? '' : parseFloat(value),
            })
          }
          disabled={isFill}
          expand
          boxed
        />
        <Numeric
          prefix={_x('Y', 'The Y axis', 'web-stories')}
          value={state.y}
          isMultiple={y === ''}
          onChange={(value) =>
            setState({
              ...state,
              y: isNaN(value) || value === '' ? '' : parseFloat(value),
            })
          }
          disabled={isFill}
          expand
          boxed
        />
      </Row>
      {/** Width/height & lock ratio */}
      <Row expand>
        <Numeric
          prefix={__('W', 'web-stories')}
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
          expand
          boxed
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
        <Numeric
          prefix={__('H', 'web-stories')}
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
          expand
          boxed
        />
      </Row>
      {/** Fill & Reset size */}
      <Row expand={false} spaceBetween={false}>
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
        {/** TODO: Implement size resetting */}
        <Button onClick={() => {}} expand={false}>
          {__('Reset size', 'web-stories')}
        </Button>
      </Row>
      {/** Rotation and Flipping */}
      <Row expand={false} spaceBetween={false}>
        <Numeric
          label={__('Rotate', 'web-stories')}
          suffix={_x('°', 'Degrees, 0 - 360. ', 'web-stories')}
          value={state.rotationAngle}
          isMultiple={rotationAngle === ''}
          onChange={(value) => {
            setState({
              ...state,
              rotationAngle:
                isNaN(value) || value === '' ? '' : parseFloat(value),
            });
          }}
          disabled={isFill}
          expand={true}
          boxed={false}
        />
        <Toggle
          icon={<FlipHorizontal />}
          value={/** TODO */ false}
          isMultiple={false}
          onChange={() => {}}
        />
        <Toggle
          icon={<FlipVertical />}
          value={/** TODO */ false}
          isMultiple={false}
          onChange={() => {}}
        />
        <Spacer />
      </Row>
    </SimplePanel>
  );
}

SizePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default SizePanel;
