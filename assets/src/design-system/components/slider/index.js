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
import styled, { css } from 'styled-components';
import { useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useKeyDownEffect } from '../keyboard';

const DEFAULT_SIZE = 24;
const rangeThumb = css`
  appearance: none;
  width: ${({ thumbSize = DEFAULT_SIZE }) => thumbSize}px;
  height: ${({ thumbSize = DEFAULT_SIZE }) => thumbSize}px;
  background-color: ${({ theme }) => theme.colors.interactiveBg.primaryHover};
  cursor: pointer;
  border-radius: 50px;
`;

const Input = styled.input.attrs({
  type: 'range',
})`
  position: relative;
  min-width: 100px;
  cursor: pointer;
  outline: none;
  background: ${({ theme, percentage }) =>
    `linear-gradient(to right, ${theme.colors.interactiveBg.primaryHover} 0%, ${theme.colors.interactiveBg.primaryHover} ${percentage}%, ${theme.colors.bg.quaternary} ${percentage}%, ${theme.colors.bg.quaternary} 100%)`};
  border-radius: 100px;
  height: 4px;
  appearance: none;
  flex: 1;

  &::-webkit-slider-thumb {
    ${rangeThumb}
  }

  &::-moz-range-thumb {
    ${rangeThumb}
  }

  &::-ms-thumb {
    ${rangeThumb}
  }

  &:before {
    position: absolute;
    content: ' ';
    height: 6px;
    top: calc(50% - 3px);
    left: -calc(
      ${({ percentage = 0, thumbSize, width = 1 }) =>
          ((width - thumbSize) / width) * percentage}% - 4px
    );
    width: ${({ percentage = 0 }) => percentage}%;
    background-color: ${({ theme }) => theme.colors.interactiveBg.primaryHover};
    border-radius: 50px;
  }

  &:focus {
    &:after {
      position: absolute;
      content: ' ';
      width: ${({ thumbSize = DEFAULT_SIZE }) => thumbSize + 4}px;
      height: ${({ thumbSize = DEFAULT_SIZE }) => thumbSize + 4}px;
      border: 2px solid ${({ theme }) => theme.colors.accent.secondary};
      top: -14px;
      left: calc(
        ${({ percentage = 0, thumbSize, width = 1 }) =>
            ((width - thumbSize) / width) * percentage}% - 4px
      );
      border-radius: 100%;
    }
  }
`;

const Wrapper = styled.div`
  position: relative;
`;

/**
 * A styled range input component.
 *
 * This component must be initialized with two step values - one value (`majorStep`)
 * is the coarse value, that simply pressing arrow-left and arrow-right will move
 * between (e.g. 1) and the other (`minorStep`) is the more fine-grained value (e.g. 0.1)
 * which can be used by pressing shift+arrow.
 *
 * When using the mouse, only `minorStep` is considered and this is the resolution the
 * range has.
 *
 * @param {Object} props Properties
 * @param {number} props.value Current value
 * @param {Function} props.handleChange Callback when updated
 * @param {number} props.majorStep Major step as described
 * @param {number} props.minorStep Minor step as described
 * @param {number} props.min Minimum value
 * @param {number} props.max Maximum value
 * @return {Node} Range input component
 */
function Slider({
  minorStep,
  majorStep,
  handleChange,
  value,
  min = 0,
  max = 500,
  ...rest
}) {
  const ref = useRef();
  const widthTracker = useRef(0);
  const update = useCallback(
    (direction, isMajor) => {
      const diff = direction * (isMajor ? majorStep : minorStep);
      let val = value + diff;
      val = typeof min === 'number' ? Math.max(min, val) : val;
      val = typeof max === 'number' ? Math.min(max, val) : val;
      handleChange(val);
    },
    [minorStep, majorStep, handleChange, min, max, value]
  );

  const percentageVal = ((value - min) / (max - min)) * 100;

  useEffect(() => {
    if (ref.current && !widthTracker.current) {
      const { width } = ref.current.getBoundingClientRect();
      widthTracker.current = width;
    }
  }, [ref]);

  useKeyDownEffect(ref, ['left'], () => update(-1, true), [update]);
  useKeyDownEffect(ref, ['right'], () => update(1, true), [update]);
  useKeyDownEffect(ref, ['shift+left'], () => update(-1, false), [update]);
  useKeyDownEffect(ref, ['shift+right'], () => update(1, false), [update]);
  return (
    <Wrapper>
      <Input
        percentage={percentageVal}
        ref={ref}
        onChange={(evt) => handleChange(evt.target.valueAsNumber)}
        step={minorStep}
        value={value}
        min={min}
        max={max}
        {...rest}
        width={widthTracker.current}
      />
    </Wrapper>
  );
}

Slider.propTypes = {
  minorStep: PropTypes.number.isRequired,
  majorStep: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
};

export { Slider };
