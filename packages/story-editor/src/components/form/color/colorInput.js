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
import PropTypes from 'prop-types';
import {
  forwardRef,
  useCallback,
  useState,
  useRef,
  useUnmount,
} from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import {
  getPreviewText,
  getOpaquePattern,
  PatternPropType,
} from '@googleforcreators/patterns';
import {
  HexInput,
  Text,
  THEME_CONSTANTS,
  Swatch,
  Icons,
  Popup,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import ColorPicker from '../../colorPicker';
import useInspector from '../../inspector/useInspector';
import DefaultTooltip from '../../tooltip';
import { focusStyle, inputContainerStyleOverride } from '../../panels/shared';
import { useCanvas, useConfig } from '../../../app';
import { MULTIPLE_VALUE, MULTIPLE_DISPLAY_VALUE } from '../../../constants';

const Preview = styled.div`
  height: 36px;
  color: ${({ theme }) => theme.colors.fg.primary};
  cursor: pointer;
  position: relative;
  width: 100%;
  padding: 0;
`;

const Input = styled(HexInput)`
  min-width: 100px;
  div {
    background-color: transparent;
  }
  input {
    padding-left: 26px;
  }
`;

const Tooltip = styled(DefaultTooltip)`
  width: 100%;
  height: 100%;
`;

const buttonAttrs = {
  as: 'button',
  type: 'button', // avoid submitting forms
};

const colorStyles = css`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50px;
  width: 24px;
  height: 24px;
`;

const buttonStyle = css`
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
  outline: none;
  background: transparent;
`;

const minimalInputContainerStyleOverride = css`
  ${inputContainerStyleOverride};
  padding-right: 6px;
`;

const ColorButton = styled(Preview).attrs(buttonAttrs)`
  border-radius: 4px;
  ${buttonStyle}
  &:focus {
    box-shadow: 0px 0px 0 2px ${({ theme }) => theme.colors.bg.primary},
      0px 0px 0 4px ${({ theme }) => theme.colors.border.focus};
    border-color: ${({ theme }) => theme.colors.border.defaultHover};
  }
`;

const ColorPreview = styled.div`
  ${colorStyles}
  top: 6px;
  left: 6px;
  padding: 0;
  background: transparent;
  cursor: pointer;
`;

const TextualPreview = styled.div`
  padding: 6px 12px 6px 38px;
  text-align: left;
  flex-grow: 1;
  height: 32px;
`;

const StyledSwatch = styled(Swatch)`
  ${focusStyle};
`;

const ChevronContainer = styled.div`
  width: 58px;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const loadReactColor = () =>
  import(/* webpackChunkName: "chunk-react-color" */ 'react-color');

const SPACING = { x: 20, y: 10 };
const ColorInput = forwardRef(function ColorInput(
  {
    onChange,
    value = null,
    label = null,
    changedStyle,
    pickerPlacement,
    isInDesignMenu = false,
    hasInputs = true,
    pickerProps,
  },
  ref
) {
  const isMixed = value === MULTIPLE_VALUE;
  value = isMixed ? '' : value;

  const previewPattern = !value
    ? { color: { r: 0, g: 0, b: 0, a: 0 } }
    : getOpaquePattern(value);
  const previewText = getPreviewText(value);

  const [pickerOpen, setPickerOpen] = useState(false);
  const previewRef = useRef(null);
  const { isEyedropperActive } = useCanvas(
    ({ state: { isEyedropperActive } }) => ({
      isEyedropperActive,
    })
  );
  const { isRTL, styleConstants: { topOffset } = {} } = useConfig();
  const {
    refs: { inspector },
  } = useInspector();

  const colorType = value?.type;
  // Allow editing always in case of solid color of if color type is missing (mixed)
  const isEditable = (!colorType || colorType === 'solid') && hasInputs;

  const buttonProps = {
    onClick: () => setPickerOpen(true),
    'aria-label': label,
    onPointerEnter: () => loadReactColor(),
    onFocus: () => loadReactColor(),
  };

  // Always hide color picker on unmount - note the double arrows
  useUnmount(() => () => setPickerOpen(false));

  const onClose = useCallback(() => setPickerOpen(false), []);

  const tooltip = __('Open color picker', 'web-stories');

  const containerStyle = isInDesignMenu
    ? minimalInputContainerStyleOverride
    : inputContainerStyleOverride;

  return (
    <>
      {isEditable ? (
        // If editable, only the visual preview component is a button
        // And the text is an input field
        <Preview ref={previewRef}>
          <Input
            ref={ref}
            aria-label={label}
            value={isMixed ? null : value}
            onChange={onChange}
            isIndeterminate={isMixed}
            placeholder={isMixed ? MULTIPLE_DISPLAY_VALUE : ''}
            containerStyleOverride={containerStyle}
          />
          <ColorPreview>
            <Tooltip title={tooltip} hasTail>
              <StyledSwatch isSmall pattern={previewPattern} {...buttonProps} />
            </Tooltip>
          </ColorPreview>
        </Preview>
      ) : (
        // If not editable, the whole component is a button
        <Tooltip title={tooltip} hasTail>
          <ColorButton ref={previewRef} {...buttonProps}>
            <ColorPreview>
              <Swatch
                isPreview
                role="status"
                tabIndex="-1"
                pattern={previewPattern}
                isIndeterminate={isMixed}
              />
            </ColorPreview>
            {hasInputs ? (
              <TextualPreview>
                <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
                  {previewText}
                </Text>
              </TextualPreview>
            ) : (
              <ChevronContainer>
                <Icons.ChevronDown />
              </ChevronContainer>
            )}
          </ColorButton>
        </Tooltip>
      )}
      <Popup
        isRTL={isRTL}
        anchor={previewRef}
        dock={inspector}
        isOpen={pickerOpen}
        placement={pickerPlacement}
        spacing={SPACING}
        invisible={isEyedropperActive}
        topOffset={topOffset}
        renderContents={({ propagateDimensionChange }) => (
          <ColorPicker
            color={isMixed ? null : value}
            isEyedropperActive={isEyedropperActive}
            onChange={onChange}
            onClose={onClose}
            changedStyle={changedStyle}
            onDimensionChange={propagateDimensionChange}
            {...pickerProps}
          />
        )}
      />
    </>
  );
});

ColorInput.propTypes = {
  value: PropTypes.oneOfType([PatternPropType, PropTypes.string]),
  pickerProps: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  changedStyle: PropTypes.string,
  pickerPlacement: PropTypes.string,
  isInDesignMenu: PropTypes.bool,
  hasInputs: PropTypes.bool,
};

export default ColorInput;
