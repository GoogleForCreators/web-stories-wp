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
import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { parseToRgb } from 'polished';

/**
 * Internal dependencies
 */
import { KEYBOARD_USER_SELECTOR } from '../../../utils/keyboardOnlyOutline';
import useUnmount from '../../../utils/useUnmount';
import useFocusAndSelect from '../../../utils/useFocusAndSelect';
import { PatternPropType } from '../../../types';
import { MULTIPLE_VALUE, MULTIPLE_DISPLAY_VALUE } from '../../../constants';
import Popup from '../../popup';
import {
  Input,
  Text,
  THEME_CONSTANTS,
  useKeyDownEffect,
} from '../../../../design-system';
import ColorPicker from '../../colorPicker';
import useInspector from '../../inspector/useInspector';
import getPreviewText from './getPreviewText';
import getPreviewStyle from './getPreviewStyle';
import getHexFromValue from './getHexFromValue';

const SELECT_CONTENTS_DELAY = 10;

const Preview = styled.div`
  height: 36px;
  color: ${({ theme }) => theme.colors.fg.primary};
  cursor: pointer;
  position: relative;
  width: 100%;
  padding: 0;
`;

const HexInput = styled(Input)`
  min-width: 100px;
  div {
    background-color: transparent;
  }
  input {
    padding-left: 26px;
  }
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
  border: 1px solid;
  border-color: ${({ theme }) => theme.colors.border.defaultNormal};
  outline: none;
  ${KEYBOARD_USER_SELECTOR} &:focus {
    border-color: ${({ theme }) => theme.colors.border.defaultHover};
    box-shadow: none !important;
  }
  background: transparent;
`;

const ColorButton = styled(Preview).attrs(buttonAttrs)`
  border-radius: 4px;
  ${buttonStyle}
`;

const ColorPreview = styled.div`
  ${colorStyles}
  top: 6px;
  left: 6px;
  padding: 0;
  background: transparent;
  cursor: pointer;
`;

const ColorPreviewButton = styled(ColorPreview).attrs(buttonAttrs)`
  ${buttonStyle}
  padding: 0;
  border: none;
`;

const ColorPreviewInsideButton = styled(ColorPreview)`
  border: none;
  transform: translate(-1px, -1px);
`;

const CurrentColor = styled.div`
  ${colorStyles}
`;

const Transparent = styled.div`
  ${colorStyles}

  background-image: conic-gradient(
    #fff 0.25turn,
    #d3d4d4 0turn 0.5turn,
    #fff 0turn 0.75turn,
    #d3d4d4 0turn 1turn
  );
  background-size: 66.67% 66.67%;
`;

const TextualPreview = styled.div`
  padding: 6px 12px 6px 38px;
  text-align: left;
  flex-grow: 1;
  height: 32px;
`;

function ColorInput({
  onChange,
  hasGradient,
  hasOpacity,
  value,
  label,
  colorPickerActions,
  changedStyle,
}) {
  const isMixed = value === MULTIPLE_VALUE;
  value = isMixed ? '' : value;

  const previewStyle = getPreviewStyle(value);
  const previewText = getPreviewText(value);

  const [inputValue, setInputValue] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);

  const previewRef = useRef(null);
  const inputRef = useRef(null);
  const skipValidationRef = useRef(false);
  const selectInputContents = useRef(false);

  const {
    refs: { inspector },
  } = useInspector();

  const { handleFocus, handleBlur } = useFocusAndSelect(inputRef);
  useEffect(() => setInputValue(previewText), [previewText]);

  const colorType = value?.type;
  // Allow editing always in case of solid color of if color type is missing (mixed)
  const isEditable = !colorType || colorType === 'solid';

  const buttonProps = {
    onClick: () => setPickerOpen(true),
    'aria-label': label,
  };

  const validateAndSubmitInput = useCallback(
    ({ selectContentOnUpdate } = {}) => {
      const hex = getHexFromValue(inputValue) ?? previewText;
      setInputValue(hex);

      // Only trigger onChange when hex has been changed
      if (hex !== previewText) {
        // Update actual color, which will in turn update hex input from value
        const { red: r, green: g, blue: b } = parseToRgb(`#${hex}`);

        // Keep same opacity as before though. In case of mixed values, set to default (1).
        const a = isMixed ? 1 : value.color.a;
        onChange({ color: { r, g, b, a } });
      }

      selectInputContents.current = selectContentOnUpdate;
    },
    [inputValue, previewText, onChange, value, isMixed]
  );

  const handleInputChange = useCallback((evt) => {
    // Trim and strip initial '#' (might very well be pasted in)
    const val = evt.target.value.trim().replace(/^#/, '');
    setInputValue(val);
  }, []);

  const handleInputBlur = useCallback(() => {
    if (!skipValidationRef.current) {
      validateAndSubmitInput();
    }

    // Reset flag after use
    skipValidationRef.current = false;

    handleBlur();
  }, [handleBlur, validateAndSubmitInput]);

  const handleEsc = useCallback(() => {
    // Revert input value and exit input focus without
    // triggering blur validation
    setInputValue(previewText);
    skipValidationRef.current = true;
    inputRef.current.blur();
  }, [previewText]);

  const handleEnter = useCallback(() => {
    validateAndSubmitInput({ selectContentOnUpdate: true });
  }, [validateAndSubmitInput]);

  // Always hide color picker on unmount - note the double arrows
  useUnmount(() => () => setPickerOpen(false));

  const onClose = useCallback(() => setPickerOpen(false), []);
  const spacing = useMemo(() => ({ x: 20 }), []);

  useKeyDownEffect(
    inputRef,
    {
      key: ['escape'],
      editable: true,
    },
    handleEsc,
    [handleEsc]
  );

  useKeyDownEffect(
    inputRef,
    {
      key: ['enter'],
      editable: true,
    },
    handleEnter,
    [handleEnter]
  );

  useEffect(() => {
    let selectContentsTimeout = -1;

    if (selectInputContents.current) {
      if (inputRef.current) {
        inputRef.current.select();
      }

      // When we want to select the content of the input
      // we hold open the door for a slight moment to allow
      // all the data to flush down the pipeline.
      selectContentsTimeout = window.setTimeout(() => {
        selectInputContents.current = false;
      }, SELECT_CONTENTS_DELAY);
    }

    return () => {
      window.clearTimeout(selectContentsTimeout);
    };
  }, [inputValue]);

  return (
    <>
      {isEditable ? (
        // If editable, only the visual preview component is a button
        // And the text is an input field
        <Preview ref={previewRef}>
          <HexInput
            ref={inputRef}
            aria-label={label}
            value={inputValue ?? ''}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleFocus}
            placeholder={isMixed ? MULTIPLE_DISPLAY_VALUE : ''}
          />
          <ColorPreviewButton
            {...buttonProps}
            color={previewStyle?.backgroundColor}
          >
            {(value?.a < 1 || isMixed) && <Transparent />}
            <CurrentColor role="status" style={previewStyle} />
          </ColorPreviewButton>
        </Preview>
      ) : (
        // If not editable, the whole component is a button
        <ColorButton ref={previewRef} {...buttonProps}>
          <ColorPreviewInsideButton>
            <Transparent />
            <CurrentColor role="status" style={previewStyle} />
          </ColorPreviewInsideButton>
          <TextualPreview>
            <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
              {previewText}
            </Text>
          </TextualPreview>
        </ColorButton>
      )}
      <Popup
        anchor={previewRef}
        dock={inspector}
        isOpen={pickerOpen}
        placement={'left-start'}
        spacing={spacing}
      >
        <ColorPicker
          color={isMixed ? null : value}
          onChange={onChange}
          hasGradient={hasGradient}
          hasOpacity={hasOpacity}
          onClose={onClose}
          renderFooter={colorPickerActions}
          changedStyle={changedStyle}
        />
      </Popup>
    </>
  );
}

ColorInput.propTypes = {
  value: PropTypes.oneOfType([PatternPropType, PropTypes.string]),
  hasGradient: PropTypes.bool,
  hasOpacity: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  colorPickerActions: PropTypes.func,
  changedStyle: PropTypes.string,
};

ColorInput.defaultProps = {
  hasGradient: false,
  hasOpacity: true,
  label: null,
  value: null,
};

export default ColorInput;
