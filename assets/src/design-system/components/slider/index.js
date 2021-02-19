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
import { useRef, useCallback } from 'react';
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

const focusedRangeThumb = css`
  border: 2px solid ${({ theme }) => theme.colors.accent.secondary};
  padding: 2px;
  background-clip: content-box;
  width: ${({ thumbSize = DEFAULT_SIZE }) => thumbSize + 8}px;
  height: ${({ thumbSize = DEFAULT_SIZE }) => thumbSize + 8}px;
  margin-left: -1px;
`;

const Input = styled.input.attrs({
  type: 'range',
})`
  min-width: 100px;
  cursor: pointer;
  outline: none;
  background: ${({ theme }) => theme.colors.bg.quaternary};
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

  &:focus {
    &::-webkit-slider-thumb {
      ${focusedRangeThumb}
    }

    &::-moz-range-thumb {
      ${focusedRangeThumb}
    }

    &::-ms-thumb {
      ${focusedRangeThumb}
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
  min,
  max,
  ...rest
}) {
  const ref = useRef();
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

  useKeyDownEffect(ref, ['left'], () => update(-1, true), [update]);
  useKeyDownEffect(ref, ['right'], () => update(1, true), [update]);
  useKeyDownEffect(ref, ['shift+left'], () => update(-1, false), [update]);
  useKeyDownEffect(ref, ['shift+right'], () => update(1, false), [update]);
  return (
    <Wrapper>
      <Input
        ref={ref}
        onChange={() => {}}
        step={minorStep}
        value={value}
        min={min}
        max={max}
        {...rest}
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
