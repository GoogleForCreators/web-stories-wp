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
  TOOLTIP_PLACEMENT,
} from '@googleforcreators/design-system';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { MULTIPLE_VALUE } from '../../../constants';
import useEyedropper from '../../eyedropper';
import Tooltip from '../../tooltip';
import { focusStyle } from '../../panels/shared/styles';

import applyOpacityChange from './applyOpacityChange';
import ColorInput from './colorInput';
import { ActiveOpacity } from './activeOpacity';
import { SPACING } from './constants';

const containerCss = css`
  display: flex;
  align-items: center;
`;

const Container = styled.section`
  ${containerCss}
  gap: ${({ isInDesignMenu }) => (isInDesignMenu ? 6 : 8)}px;
  width: ${({ width }) => (width ? `${width}px` : 'inherit')};
`;
Container.propTypes = {
  isInDesignMenu: PropTypes.bool,
  width: PropTypes.number,
};

const ColorInputsWrapper = styled.div`
  ${containerCss}
  gap: ${({ isInDesignMenu }) => (isInDesignMenu ? 0 : 6)}px;
`;

// 10px comes from divider / 2
const InputWrapper = styled.div`
  ${({ hasInputs }) => hasInputs && `width: calc(53% - 10px);`}
`;

const EyeDropperButton = styled(Button).attrs({
  variant: BUTTON_VARIANTS.SQUARE,
  type: BUTTON_TYPES.TERTIARY,
  size: BUTTON_SIZES.SMALL,
})`
  ${focusStyle};
`;

const DEFAULT_CONTAINER_LABEL_BASE = __('Color input', 'web-stories');

const Color = forwardRef(function Color(
  {
    onChange,
    allowsGradient = false,
    allowsOpacity = true,
    allowsSavedColors = false,
    value = null,
    label = null,
    containerLabelBase = DEFAULT_CONTAINER_LABEL_BASE,
    changedStyle = null,
    hasEyedropper = false,
    pickerHasEyedropper = true,
    maxHeight = null,
    shouldCloseOnSelection = false,
    allowsSavedColorDeletion = true,
    pickerPlacement = PLACEMENT.RIGHT_START,
    isInDesignMenu = false,
    hasInputs = true,
    width,
    tabIndex,
    opacityFocusTrap,
    colorFocusTrap,
  },
  ref
) {
  const handleOpacityChange = useCallback(
    (newOpacity) => onChange(applyOpacityChange(value, newOpacity)),
    [value, onChange]
  );

  const containerLabel = sprintf(
    /* translators: 1: the input section in the editor. 2: color input label name. */
    __('%1$s: %2$s', 'web-stories'),
    containerLabelBase,
    label
  );

  const displayOpacity =
    value !== MULTIPLE_VALUE && Boolean(getPreviewText(value)) && hasInputs;

  const { initEyedropper } = useEyedropper({
    onChange: (color) => onChange({ color }),
  });
  const tooltip = __('Pick a color from canvas', 'web-stories');

  const tooltipPlacement =
    isInDesignMenu || hasEyedropper
      ? TOOLTIP_PLACEMENT.BOTTOM
      : TOOLTIP_PLACEMENT.BOTTOM_START;

  // Sometimes there's more than 1 color to an element.
  // When there's multiple colors the input displays "Mixed" (in english) and takes up a different amount of space.
  // By checking here to ignore that value based on mixed colors we prevent visual spill over of content.
  const ignoreSetWidth = width && value === MULTIPLE_VALUE;

  return (
    <Container
      aria-label={containerLabel}
      isInDesignMenu={isInDesignMenu}
      width={!ignoreSetWidth && width ? width : null}
    >
      {hasEyedropper && (
        <Tooltip
          title={tooltip}
          hasTail
          placement={
            isInDesignMenu
              ? TOOLTIP_PLACEMENT.BOTTOM
              : TOOLTIP_PLACEMENT.BOTTOM_START
          }
        >
          <EyeDropperButton
            id={uuidv4()}
            tabIndex={tabIndex}
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
            tabIndex={tabIndex}
            onChange={onChange}
            value={value}
            label={label}
            changedStyle={changedStyle}
            pickerPlacement={pickerPlacement}
            hasInputs={hasInputs}
            isInDesignMenu={isInDesignMenu}
            spacing={
              isInDesignMenu ? SPACING.FLOATING_MENU : SPACING.DEFAULT_SIDEBAR
            }
            tooltipPlacement={tooltipPlacement}
            colorFocusTrap={colorFocusTrap}
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
          <ActiveOpacity
            handleOpacityChange={handleOpacityChange}
            isInDesignMenu={isInDesignMenu}
            opacityFocusTrap={opacityFocusTrap}
            tabIndex={tabIndex}
            value={value}
          />
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
  containerLabelBase: PropTypes.string,
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
