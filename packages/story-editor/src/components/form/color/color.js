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
import { forwardRef, useCallback } from '@googleforcreators/react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { __, sprintf } from '@googleforcreators/i18n';
import { getPreviewText, PatternPropType } from '@googleforcreators/patterns';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  PLACEMENT,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { MULTIPLE_VALUE } from '../../../constants';
import useEyedropper from '../../eyedropper';
import Tooltip from '../../tooltip';
import { focusStyle } from '../../panels/shared';
import applyOpacityChange from './applyOpacityChange';
import OpacityInput from './opacityInput';
import ColorInput from './colorInput';

const containerCss = css`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Container = styled.section`
  ${containerCss}
  gap: ${({ isInDesignMenu }) => (isInDesignMenu ? 6 : 8)}px;
`;

const ColorInputsWrapper = styled.div`
  ${containerCss}
  gap: ${({ isInDesignMenu }) => (isInDesignMenu ? 0 : 6)}px;
`;

const Space = styled.div`
  width: 8px;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.divider.primary};
`;

// 10px comes from divider / 2
const InputWrapper = styled.div`
  ${({ hasInputs }) => hasInputs && `width: calc(53% - 10px);`}
`;

const OpacityWrapper = styled.div`
  width: calc(47% - 10px);
`;

const EyeDropperButton = styled(Button).attrs({
  variant: BUTTON_VARIANTS.SQUARE,
  type: BUTTON_TYPES.TERTIARY,
  size: BUTTON_SIZES.SMALL,
})`
  ${focusStyle};
`;

const Color = forwardRef(function Color(
  {
    onChange,
    allowsGradient = false,
    allowsOpacity = true,
    allowsSavedColors = false,
    value = null,
    label = null,
    changedStyle = null,
    hasEyedropper = false,
    pickerHasEyedropper = true,
    maxHeight = null,
    shouldCloseOnSelection = false,
    allowsSavedColorDeletion = true,
    pickerPlacement = PLACEMENT.RIGHT_START,
    isInDesignMenu = false,
    hasInputs = true,
  },
  ref
) {
  const handleOpacityChange = useCallback(
    (newOpacity) => onChange(applyOpacityChange(value, newOpacity)),
    [value, onChange]
  );

  const containerLabel = sprintf(
    /* translators: %s: color input label name. */
    __('Color input: %s', 'web-stories'),
    label
  );

  const displayOpacity =
    value !== MULTIPLE_VALUE && Boolean(getPreviewText(value)) && hasInputs;

  const { initEyedropper } = useEyedropper({
    onChange: (color) => onChange({ color }),
  });
  const tooltip = __('Pick a color from canvas', 'web-stories');

  return (
    <Container aria-label={containerLabel} isInDesignMenu={isInDesignMenu}>
      {hasEyedropper && (
        <Tooltip title={tooltip} hasTail>
          <EyeDropperButton
            aria-label={tooltip}
            onClick={initEyedropper()}
            onPointerEnter={initEyedropper(false)}
          >
            <Icons.Pipette />
          </EyeDropperButton>
        </Tooltip>
      )}

      <ColorInputsWrapper isInDesignMenu={isInDesignMenu}>
        <InputWrapper hasInputs={hasInputs}>
          <ColorInput
            ref={ref}
            onChange={onChange}
            value={value}
            label={label}
            changedStyle={changedStyle}
            pickerPlacement={pickerPlacement}
            hasInputs={hasInputs}
            isInDesignMenu={isInDesignMenu}
            pickerProps={{
              allowsGradient,
              allowsOpacity,
              allowsSavedColors,
              hasEyedropper: pickerHasEyedropper,
              allowsSavedColorDeletion,
              maxHeight,
              shouldCloseOnSelection,
            }}
          />
        </InputWrapper>
        {allowsOpacity && displayOpacity && (
          <>
            <Space />
            <OpacityWrapper>
              <OpacityInput
                value={value}
                onChange={handleOpacityChange}
                isInDesignMenu={isInDesignMenu}
              />
            </OpacityWrapper>
          </>
        )}
      </ColorInputsWrapper>
    </Container>
  );
});

Color.propTypes = {
  value: PropTypes.oneOfType([PatternPropType, PropTypes.string]),
  allowsGradient: PropTypes.bool,
  allowsOpacity: PropTypes.bool,
  allowsSavedColors: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  changedStyle: PropTypes.string,
  hasEyedropper: PropTypes.bool,
  pickerHasEyedropper: PropTypes.bool,
  maxHeight: PropTypes.number,
  shouldCloseOnSelection: PropTypes.bool,
  allowsSavedColorDeletion: PropTypes.bool,
  pickerPlacement: PropTypes.string,
  isInDesignMenu: PropTypes.bool,
  hasInputs: PropTypes.bool,
};

export default Color;
