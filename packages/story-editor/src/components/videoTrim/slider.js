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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useRef, useCallback } from '@web-stories-wp/react';
import { useKeyDownEffect } from '@web-stories-wp/design-system';

const Thumb = styled.button`
  position: absolute;
  padding: 0;
`;

function Slider({
  railWidth,
  min,
  max,
  step,
  minorStep = null,
  value = 0,
  onChange = () => {},
  getValueText = null,
  onPointerDown = () => {},
  onNudge = () => {},
  ...rest
}) {
  const ref = useRef();

  const handlePointerDown = useCallback(
    (downEvent) => {
      // Stop propagation, but manually set focus
      downEvent.preventDefault();
      downEvent.stopPropagation();
      ref.current.focus();

      onPointerDown?.();

      const handlePointerMove = function (event) {
        const deltaX = event.pageX - downEvent.pageX;
        const deltaRatio = deltaX / railWidth;
        const deltaValue = deltaRatio * (max - min);
        const newValue = value + deltaValue;
        onChange(newValue);

        event.preventDefault();
        event.stopPropagation();
      };

      const handlePointerUp = function () {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);

      return handlePointerUp;
    },
    [value, max, min, onChange, railWidth, onPointerDown]
  );

  const handleNudge = useCallback(
    (delta) => {
      onChange(value + delta);
      onNudge?.();
    },
    [onChange, onNudge, value]
  );

  useKeyDownEffect(ref, 'left', () => handleNudge(-step), [handleNudge, step]);
  useKeyDownEffect(ref, 'shift+left', () => handleNudge(-minorStep), [
    handleNudge,
    minorStep,
  ]);
  useKeyDownEffect(ref, 'right', () => handleNudge(step), [handleNudge, step]);
  useKeyDownEffect(ref, 'shift+right', () => handleNudge(minorStep), [
    handleNudge,
    minorStep,
  ]);

  const ratio = (value - min) / (max - min);
  const cssValue = `${(ratio * railWidth).toFixed(2)}px`;
  const sliderStyle = { left: cssValue };

  return (
    <Thumb
      ref={ref}
      onPointerDown={handlePointerDown}
      style={sliderStyle}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={getValueText?.(value)}
      {...rest}
    />
  );
}

Slider.propTypes = {
  railWidth: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  minorStep: PropTypes.number.isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func,
  getValueText: PropTypes.func,
  onPointerDown: PropTypes.func,
  onNudge: PropTypes.func,
};

export default Slider;
