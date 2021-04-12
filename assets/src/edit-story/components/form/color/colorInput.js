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
import { useCallback, useState, useRef, useMemo } from 'react';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import useUnmount from '../../../utils/useUnmount';
import { PatternPropType } from '../../../types';
import { MULTIPLE_VALUE, MULTIPLE_DISPLAY_VALUE } from '../../../constants';
import Popup from '../../popup';
import {
  HexInput,
  Text,
  THEME_CONSTANTS,
  Swatch,
  getOpaquePattern,
  PLACEMENT,
} from '../../../../design-system';
import getPreviewText from '../../../../design-system/components/hex/getPreviewText';
import ColorPicker from '../../colorPicker';
import useInspector from '../../inspector/useInspector';
import DefaultTooltip from '../../tooltip';

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

  const previewPattern = isMixed
    ? { color: { r: 0, g: 0, b: 0, a: 0 } }
    : getOpaquePattern(value);
  const previewText = getPreviewText(value);

  const [pickerOpen, setPickerOpen] = useState(false);
  const previewRef = useRef(null);

  const {
    refs: { inspector },
  } = useInspector();

  const colorType = value?.type;
  // Allow editing always in case of solid color of if color type is missing (mixed)
  const isEditable = !colorType || colorType === 'solid';

  const buttonProps = {
    onClick: () => setPickerOpen(true),
    'aria-label': label,
  };

  // Always hide color picker on unmount - note the double arrows
  useUnmount(() => () => setPickerOpen(false));

  const onClose = useCallback(() => setPickerOpen(false), []);
  const spacing = useMemo(() => ({ x: 20 }), []);

  const tooltip = __('Open color picker', 'web-stories');
  return (
    <>
      {isEditable ? (
        // If editable, only the visual preview component is a button
        // And the text is an input field
        <Preview ref={previewRef}>
          <Input
            aria-label={label}
            value={isMixed ? null : value}
            onChange={onChange}
            isIndeterminate={isMixed}
            placeholder={isMixed ? MULTIPLE_DISPLAY_VALUE : ''}
          />
          <ColorPreview>
            <Tooltip title={tooltip} hasTail>
              <Swatch isSmall pattern={previewPattern} {...buttonProps} />
            </Tooltip>
          </ColorPreview>
        </Preview>
      ) : (
        // If not editable, the whole component is a button
        <Tooltip title={tooltip} hasTail>
          <ColorButton ref={previewRef} {...buttonProps}>
            <ColorPreview>
              <Swatch
                isSmall
                role="status"
                tabIndex="-1"
                pattern={previewPattern}
              />
            </ColorPreview>
            <TextualPreview>
              <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
                {previewText}
              </Text>
            </TextualPreview>
          </ColorButton>
        </Tooltip>
      )}
      <Popup
        anchor={previewRef}
        dock={inspector}
        isOpen={pickerOpen}
        placement={PLACEMENT.LEFT_START}
        spacing={spacing}
        renderContents={({ propagateDimensionChange }) => (
          <ColorPicker
            color={isMixed ? null : value}
            onChange={onChange}
            hasGradient={hasGradient}
            hasOpacity={hasOpacity}
            onClose={onClose}
            renderFooter={(props) =>
              colorPickerActions?.(props, null, propagateDimensionChange)
            }
            changedStyle={changedStyle}
          />
        )}
      />
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
