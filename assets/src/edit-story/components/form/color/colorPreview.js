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
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { KEYBOARD_USER_SELECTOR } from '../../../utils/keyboardOnlyOutline';
import useUnmount from '../../../utils/useUnmount';
import { PatternPropType } from '../../../types';
import MULTIPLE_VALUE from '../multipleValue';
import Popup from '../../popup';
import ColorPicker from '../../colorPicker';
import useInspector from '../../inspector/useInspector';
import getPreviewText from './getPreviewText';
import getPreviewStyle from './getPreviewStyle';
import { ColorBox } from './colorBox';

const Preview = styled(ColorBox)`
  display: flex;
  width: 122px;
  padding: 0;
  border: 0;
  cursor: pointer;
`;

const buttonAttrs = {
  as: 'button',
  type: 'button', // avoid submitting forms
};

const buttonStyle = css`
  overflow: hidden;
  border: 0 solid;
  border-color: ${({ theme }) => theme.colors.whiteout} !important;
  outline: none;
  ${KEYBOARD_USER_SELECTOR} &:focus {
    border-width: 1px;
    box-shadow: none !important;
  }
`;

const PreviewButton = styled(Preview).attrs(buttonAttrs)`
  border-radius: 4px;
  ${buttonStyle}
`;

const VisualPreview = styled.div`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  position: relative;
`;

const VisualPreviewButton = styled(VisualPreview).attrs(buttonAttrs)`
  border-radius: 4px 0 0 4px;
  ${buttonStyle}
`;

const VisualPreviewInsideButton = styled(VisualPreview)`
  ${KEYBOARD_USER_SELECTOR} ${PreviewButton}:focus & {
    margin-left: -1px;
  }
`;

const colorStyles = css`
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 4px 0 0 4px;
  width: 100%;
  height: 100%;
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
  padding: 0 0 0 10px;
  text-align: left;
  flex-grow: 1;
  font-size: 15px;
  line-height: 32px;
  height: 32px;
`;

const TextualInput = styled(TextualPreview).attrs({ as: 'input' })`
  background: transparent;
  color: inherit;
  margin: 0;
  cursor: text;
  overflow: auto;
  border-radius: 0 4px 4px 0;
`;

function ColorPreview({
  onChange,
  hasGradient,
  hasOpacity,
  value,
  label,
  colorPickerActions,
}) {
  const isMultiple = value === MULTIPLE_VALUE;
  value = isMultiple ? '' : value;
  const previewStyle = getPreviewStyle(value);
  const previewText = getPreviewText(value);

  const [hexInputValue, setHexInputValue] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const previewRef = useRef(null);

  const {
    refs: { inspector },
  } = useInspector();

  useEffect(() => setHexInputValue(previewText), [previewText]);

  const colorType = value?.type;
  const isEditable =
    !isMultiple &&
    Boolean(previewText) &&
    (!colorType || colorType === 'solid');

  const editLabel = __('Edit', 'web-stories');
  const inputLabel = __('Enter', 'web-stories');

  const buttonProps = {
    onClick: () => setPickerOpen(true),
    'aria-label': `${editLabel}: ${label}`,
  };

  const handleInputChange = useCallback(
    (evt) => {
      // Trim and strip initial '#' (might very well be pasted in)
      const val = evt.target.value.trim().replace(/^#/, '');
      setHexInputValue(val);
      const hasNonHex = /[^0-9a-f]/i.test(val);
      const hasValidLength = val.length === 6;
      if (hasNonHex || !hasValidLength) {
        // Invalid color hex, just allow it for now
        // but don't pass it upstream
        return;
      }

      // Update actual color, which will in turn update hex input from value
      const { red: r, green: g, blue: b } = parseToRgb(`#${val}`);
      // Keep same opacity as before though
      const {
        color: { a },
      } = value;
      onChange({ color: { r, g, b, a } });
    },
    [value, onChange]
  );

  // Reset to last known "valid" color on blur
  const handleInputBlur = useCallback(() => setHexInputValue(previewText), [
    previewText,
  ]);

  // Always hide color picker on unmount - note the double arrows
  useUnmount(() => () => setPickerOpen(false));

  const onClose = useCallback(() => setPickerOpen(false), []);
  const spacing = useMemo(() => ({ x: 20 }), []);

  return (
    <>
      {isEditable ? (
        // If editable, only the visual preview component is a button
        // And the text is an input field
        <Preview ref={previewRef}>
          <VisualPreviewButton {...buttonProps}>
            {value.a < 1 && <Transparent />}
            <CurrentColor role="status" style={previewStyle} />
          </VisualPreviewButton>
          <TextualInput
            type="text"
            aria-label={`${inputLabel}: ${label}`}
            value={hexInputValue ?? ''}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
        </Preview>
      ) : (
        // If not editable, the whole component is a button
        <PreviewButton ref={previewRef} {...buttonProps}>
          <VisualPreviewInsideButton>
            <Transparent />
            <CurrentColor role="status" style={previewStyle} />
          </VisualPreviewInsideButton>
          <TextualPreview>
            {isMultiple
              ? __('Multiple', 'web-stories')
              : previewText ||
                _x('None', 'No color or gradient selected', 'web-stories')}
          </TextualPreview>
        </PreviewButton>
      )}
      <Popup
        anchor={previewRef}
        dock={inspector}
        isOpen={pickerOpen}
        placement={'left-start'}
        spacing={spacing}
      >
        <ColorPicker
          color={isMultiple ? null : value}
          onChange={onChange}
          hasGradient={hasGradient}
          hasOpacity={hasOpacity}
          onClose={onClose}
          renderFooter={colorPickerActions}
        />
      </Popup>
    </>
  );
}

ColorPreview.propTypes = {
  value: PropTypes.oneOfType([PatternPropType, PropTypes.string]),
  hasGradient: PropTypes.bool,
  hasOpacity: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  colorPickerActions: PropTypes.func,
};

ColorPreview.defaultProps = {
  hasGradient: false,
  hasOpacity: true,
  label: null,
  value: null,
};

export default ColorPreview;
