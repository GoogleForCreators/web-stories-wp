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
import {
  useRef,
  useCallback,
  useLayoutEffect,
  useState,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useKeyDownEffect } from '../keyboard';
import { BaseTooltip } from '../tooltip';
import { PLACEMENT } from '../popup';
import { noop } from '../../utils';

const DEFAULT_SIZE = 24;
const rangeThumb = css`
  appearance: none;
  width: ${({ thumbSize }) => thumbSize}px;
  height: ${({ thumbSize }) => thumbSize}px;
  background-color: ${({ theme }) => theme.colors.interactiveBg.primaryNormal};
  cursor: pointer;
  border-radius: 50px;
`;
const rangeThumbHover = css`
  background-color: ${({ theme }) => theme.colors.interactiveBg.primaryHover};
`;

const rangeThumbFocus = css`
  z-index: 2;
  border: 2px solid ${({ theme }) => theme.colors.accent.secondary};
  padding: 2px;
  background-clip: content-box;
  width: ${({ thumbSize }) => thumbSize + 8}px;
  height: ${({ thumbSize }) => thumbSize + 8}px;
  margin-left: ${({ thumbSize, width, percentage }) =>
    getFocusedThumbMargin(percentage, thumbSize, width)}px;
`;

const Input = styled.input.attrs({
  type: 'range',
})`
  z-index: 1;
  position: relative;
  min-width: 100px;
  cursor: pointer;
  outline: none;
  background: ${({ theme }) => theme.colors.bg.quaternary};
  border-radius: 100px;
  height: 4px;
  appearance: none;
  flex: 1;
  margin: 0;

  ::-webkit-slider-thumb {
    ${rangeThumb}
  }

  ::-moz-range-thumb {
    ${rangeThumb}
  }

  ::-ms-thumb {
    ${rangeThumb}
  }

  ::before {
    z-index: -1;
    position: absolute;
    content: ' ';
    height: 6px;
    top: calc(50% - 3px);
    left: -calc(
      ${({ percentage, thumbSize, width }) =>
          getAdjustedWidthValue(percentage, thumbSize, width)}% - 4px
    );
    width: ${({ percentage = 0 }) => percentage}%;
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.primaryNormal};
    border-radius: 50px;
  }

  :hover {
    ::before {
      background-color: ${({ theme }) =>
        theme.colors.interactiveBg.primaryHover};
    }
    ::-webkit-slider-thumb {
      ${rangeThumbHover}
    }

    ::-moz-range-thumb {
      ${rangeThumbHover}
    }

    ::-ms-thumb {
      ${rangeThumbHover}
    }
  }

  &:focus {
    &::-webkit-slider-thumb {
      ${rangeThumbFocus}
    }

    &::-moz-range-thumb {
      ${rangeThumbFocus}
    }

    &::-ms-thumb {
      ${rangeThumbFocus}
    }
  }
`;

/**
 * Gets a value adjusted by the "real" absolute available width on the slider.
 * The available width for the slider is the total width - the thumb size
 * since otherwise values like left: 100% etc. would already go out of the slider.
 *
 * @param {number} value Value to adjust.
 * @param {number} thumbSize Thumb size.
 * @param {number} width Width in px in DOM.
 * @return {number} The adjusted value.
 */
function getAdjustedWidthValue(value = 0, thumbSize, width) {
  if (!width) {
    // Avoid dividing by 0 issues.
    width = 1;
  }
  return ((width - thumbSize) / width) * value;
}

/**
 *
 * @param {number} percentage Current value percentage of the slider.
 * @param {number} thumbSize Thumb size.
 * @param {number} width Width in px in DOM.
 * @return {number} The margin to be applied to a focused thumb.
 */
function getFocusedThumbMargin(percentage, thumbSize, width) {
  // 4 comes from 2px borer + 2px gap between the border and thumb
  const leftMargin = Math.ceil(getAdjustedWidthValue(4, thumbSize, width));
  // After 50% the left margin becomes positive so we take 50% as the 100%, thus multiplying by 2.
  return -leftMargin + percentage * 2 * 0.01 * leftMargin;
}

const Wrapper = styled.div`
  position: relative;
  left: 0;
  top: 0;
`;

// This is static div positioned 12px below the top center of the thumb.
// This is used to align the tooltip by, as this is the base position at the 0 mark.
const FakeThumb = styled.div`
  width: 0;
  height: 0;
  position: absolute;
  left: ${({ thumbSize }) => thumbSize / 2}px;
  top: ${({ thumbSize }) => -thumbSize / 2 + 12}px;
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
 * @param {number} props.thumbSize Thumb diameter in pixels if different from standard
 * @param {string} props.suffix Optional value suffix to be displayed in tooltip
 * @param {boolean} props.isRTL Needed for tooltip placement
 * @param {number} props.leftOffset Needed for tooltip placement
 * @param {number} props.popupZIndexOverride Needed for z index of tooltip
 * @return {Node} Range input component
 */
function Slider({
  minorStep,
  majorStep,
  handleChange = noop,
  value,
  min = 0,
  max = 500,
  thumbSize = DEFAULT_SIZE,
  suffix = '',
  isRTL,
  leftOffset,
  popupZIndexOverride,
  ...rest
}) {
  const ref = useRef();
  const fakeThumbRef = useRef();
  const [widthTracker, setWidthTracker] = useState(null);
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

  useLayoutEffect(() => {
    if (ref.current && !widthTracker) {
      const { width } = ref.current.getBoundingClientRect();
      setWidthTracker(width);
    }
  }, [ref, widthTracker]);

  useKeyDownEffect(ref, ['left', 'down'], () => update(-1, true), [update]);
  useKeyDownEffect(ref, ['right', 'up'], () => update(1, true), [update]);
  useKeyDownEffect(ref, ['shift+left', 'shift+down'], () => update(-1, false), [
    update,
  ]);
  useKeyDownEffect(ref, ['shift+right', 'shift+up'], () => update(1, false), [
    update,
  ]);

  const printValue = `${value}${suffix}`;
  return (
    <BaseTooltip
      title={printValue}
      placement={PLACEMENT.TOP}
      popupZIndexOverride={popupZIndexOverride}
      forceAnchorRef={fakeThumbRef}
      isRTL={isRTL}
      leftOffset={leftOffset}
      styleOverride={{
        style: {
          transform: `translate(${
            ((widthTracker - thumbSize) * percentageVal) / 100
          }px, 0)`,
        },
      }}
    >
      <Wrapper>
        <Input
          percentage={percentageVal}
          ref={ref}
          onChange={(evt) => handleChange(evt.target.valueAsNumber)}
          step={minorStep}
          value={value}
          min={min}
          max={max}
          thumbSize={thumbSize}
          width={widthTracker}
          aria-valuenow={value}
          aria-valuetext={printValue}
          {...rest}
        />
        <FakeThumb
          ref={fakeThumbRef}
          percentage={percentageVal}
          width={widthTracker}
          thumbSize={thumbSize}
        />
      </Wrapper>
    </BaseTooltip>
  );
}

Slider.propTypes = {
  minorStep: PropTypes.number.isRequired,
  majorStep: PropTypes.number.isRequired,
  handleChange: PropTypes.func,
  value: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  thumbSize: PropTypes.number,
  suffix: PropTypes.string,
  isRTL: PropTypes.bool,
  leftOffset: PropTypes.number,
  popupZIndexOverride: PropTypes.number,
};

export { Slider };
