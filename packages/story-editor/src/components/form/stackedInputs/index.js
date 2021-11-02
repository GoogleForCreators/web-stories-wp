/*
 * Copyright 2021 Google LLC
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
import { NumericInput } from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { inputContainerStyleOverride } from '../../panels/shared';
import { MULTIPLE_DISPLAY_VALUE, MULTIPLE_VALUE } from '../../../constants';
import { getStackedInputValues } from './utils';

const InputContainer = styled.div`
  margin-left: 1px;
  ${({ isSmall }) => (!isSmall ? 'max-width: 106px' : '')}
`;

const BoxedNumericInput = styled(NumericInput)`
  border-radius: 0px;
  margin-left: -1px;
  svg {
    ${({ side }) =>
      side === 'topLeft' || side === 'top' ? 'transform: rotate(90deg);' : ''}
  }

  ${({ isSmall, side }) =>
    isSmall &&
    `
  width: 25%;
  svg {
    ${
      side === 'topRight' || side === 'right'
        ? 'transform: rotate(180deg);'
        : ''
    }
    ${
      side === 'bottomRight' || side === 'bottom'
        ? 'transform: rotate(270deg);'
        : ''
    }
    width: 29px;
    height: 29px;
    margin-right: -14px;
  }
`}
`;

const inputContainerStyle = css`
  ${inputContainerStyleOverride}
  position: relative;
  :focus-within {
    z-index: 1;
  }
`;

const inputStyleOverride = css`
  height: 36px;
  padding: 2px 6px 2px 12px;
`;

const lastInputStyleOverride = css`
  ${inputStyleOverride}
  padding-right: 10px;
`;

const styleOverrideTopLeft = css`
  ${inputContainerStyle}
  border-radius: 4px 0 0 4px;
`;

const styleOverrideTopRight = css`
  ${inputContainerStyle}
  border-radius: 0;
`;

const styleOverrideBottomLeft = css`
  ${inputContainerStyle}
  border-radius: 0;
`;

const styleOverrideBottomRight = css`
  ${inputContainerStyle}
  border-radius: 0 4px 4px 0;
`;

function StackedInputs(props) {
  const {
    lockInput,
    handleChange,
    inputProps,
    suffix,
    firstInputLabel,
    showLockedSuffixIcon,
  } = props;

  const left = getStackedInputValues(inputProps, 'topLeft', 'left');
  const top = getStackedInputValues(inputProps, 'topRight', 'top');
  const right = getStackedInputValues(inputProps, 'bottomLeft', 'right');
  const bottom = getStackedInputValues(inputProps, 'bottomRight', 'bottom');

  return (
    <InputContainer isSmall={!lockInput}>
      <BoxedNumericInput
        isSmall={!lockInput}
        side={left.key}
        suffix={!lockInput || showLockedSuffixIcon ? suffix : undefined}
        value={left.props === MULTIPLE_VALUE ? '' : left.props}
        aria-label={firstInputLabel}
        onChange={handleChange(left.key)}
        placeholder={
          left.props === MULTIPLE_VALUE ? MULTIPLE_DISPLAY_VALUE : ''
        }
        isIndeterminate={left.props === MULTIPLE_VALUE}
        styleOverride={inputStyleOverride}
        containerStyleOverride={
          lockInput ? inputContainerStyle : styleOverrideTopLeft
        }
      />
      {!lockInput && (
        <>
          <BoxedNumericInput
            isSmall
            side={top.key}
            suffix={suffix}
            value={top.props === MULTIPLE_VALUE ? '' : top.props}
            aria-label={top.label}
            onChange={handleChange(top.key)}
            placeholder={
              top.props === MULTIPLE_VALUE ? MULTIPLE_DISPLAY_VALUE : ''
            }
            isIndeterminate={top.props === MULTIPLE_VALUE}
            styleOverride={inputStyleOverride}
            containerStyleOverride={styleOverrideTopRight}
          />
          <BoxedNumericInput
            isSmall
            value={right.props === MULTIPLE_VALUE ? '' : right.props}
            aria-label={right.label}
            onChange={handleChange(right.key)}
            placeholder={
              right.props === MULTIPLE_VALUE ? MULTIPLE_DISPLAY_VALUE : ''
            }
            suffix={suffix}
            side={right.key}
            isIndeterminate={right.props === MULTIPLE_VALUE}
            styleOverride={inputStyleOverride}
            containerStyleOverride={styleOverrideBottomLeft}
          />
          <BoxedNumericInput
            isSmall
            value={bottom.props === MULTIPLE_VALUE ? '' : bottom.props}
            aria-label={bottom.label}
            onChange={handleChange(bottom.key)}
            placeholder={
              bottom.props === MULTIPLE_VALUE ? MULTIPLE_DISPLAY_VALUE : ''
            }
            side={bottom.key}
            suffix={suffix}
            isIndeterminate={bottom.props === MULTIPLE_VALUE}
            styleOverride={lastInputStyleOverride}
            containerStyleOverride={styleOverrideBottomRight}
          />
        </>
      )}
    </InputContainer>
  );
}

StackedInputs.propTypes = {
  lockInput: PropTypes.bool,
  handleChange: PropTypes.func,
  inputProps: PropTypes.object,
  suffix: PropTypes.node,
  firstInputLabel: PropTypes.string,
  showLockedSuffixIcon: PropTypes.bool,
};

export default StackedInputs;
