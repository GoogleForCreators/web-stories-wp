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
import { forwardRef, useCallback, useMemo } from '@googleforcreators/react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { themeHelpers, THEME_CONSTANTS } from '../../theme';
import { Text } from '../typography';

const SWITCH_HEIGHT = 32;
const VALUES = {
  ON: 'ON',
  OFF: 'OFF',
};

const VisuallyHiddenRadioGroupLabel = styled.p`
  ${themeHelpers.visuallyHidden};
`;

const SlidingButton = styled.span`
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  width: 50%;
  height: ${SWITCH_HEIGHT}px;
  border-radius: 100px;
  transition: all 0.15s ease-out;
  z-index: 0;

  ${({ hasOffset }) => hasOffset && `left: 50%`}
`;

const SwitchContainer = styled.div`
  position: relative;
  height: ${SWITCH_HEIGHT}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  appearance: none;
  background: ${({ theme, darkTheme }) =>
    darkTheme ? theme.colors.divider.secondary : theme.colors.bg.tertiary};
  border-radius: 100px;
  color: ${({ theme }) => theme.colors.fg.primary};
  cursor: pointer;

  ${({ disabled, theme, darkTheme }) =>
    disabled
      ? css`
          cursor: default;
          background: ${theme.colors.divider.tertiary};

          ${SlidingButton} {
            background-color: ${theme.colors.interactiveBg.disable};
          }
        `
      : css`
          :hover ${SlidingButton} {
            background-color: ${darkTheme
              ? theme.colors.interactiveBg.primaryHover
              : theme.colors.interactiveBg.brandNormal};
          }
        `};
`;

const HiddenRadioButton = styled.input.attrs({ type: 'radio' })`
  position: absolute;
  height: 0;
  width: 0;
  padding: 0;
  min-width: unset;
  appearance: none;
  border: 0;
  box-shadow: none;
  margin: -1px;
  outline: none;
  overflow: hidden;
  opacity: 0;
`;

const RadioButtonLabel = styled(Text).attrs({
  forwardedAs: 'label',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: ${SWITCH_HEIGHT}px;
  width: 50%;
  padding: 0px 6px;
  z-index: 1;
  color: ${({ isActive, theme, darkTheme }) =>
    isActive
      ? darkTheme
        ? theme.colors.inverted.fg.primary
        : theme.colors.fg.primary
      : theme.colors.fg.secondary};
  background-color: ${({ isActive, theme, darkTheme }) =>
    isActive &&
    (darkTheme
      ? theme.colors.interactiveBg.primaryNormal
      : theme.colors.interactiveBg.brandNormal)};
  border-radius: 100px;
  cursor: pointer;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.15s ease-out;

  ${({ disabled, theme }) =>
    disabled &&
    css`
      cursor: default;
      color: ${theme.colors.fg.disable};
    `}

  /* add focus styling on the slider when the hidden input is focused */
  :focus-within ~ span {
    ${themeHelpers.focusCSS};
  }
`;

/**
 * A controlled radio group that looks like a switch.
 *
 * Keyboard navigation:
 * - [Tab] can be used to navigate between radio groups
 * - [Enter], [Space], [ArrowLeft], [ArrowRight] [ArrowUp], and [ArrowDown] can be used to select radio buttons
 *
 * @param {Object} props The props
 * @param {string} props.className className that is applied to the outer container
 * @param {string} props.disabled whether the radio buttons are disabled
 * @param {string} props.groupLabel the label for the radio group. Used for accessibility
 * @param {string} props.id unique id used for accessibility
 * @param {string} props.name name of the radio group
 * @param {string} props.offLabel label for the 'off' radio button
 * @param {Function} props.onChange change event handler
 * @param {string} props.onLabel label for the 'on' radio button
 * @param {boolean} props.value the value of the radio group
 * @param {string} props.darkTheme If to use dark theme, defaults to `true`.
 * @return {Object} The radio button
 */
export const Switch = forwardRef(function Switch(
  {
    className,
    disabled,
    groupLabel,
    id,
    offLabel,
    onChange,
    onLabel,
    value = false,
    darkTheme = true,
    ...props
  },
  ref
) {
  const ids = useMemo(
    () => ({
      group: id || uuidv4(),
      offInput: uuidv4(),
      onInput: uuidv4(),
    }),
    [id]
  );

  const handleChange = useCallback(
    (evt) => {
      onChange(evt, evt.target.value === VALUES.ON);
    },
    [onChange]
  );

  return (
    <SwitchContainer
      ref={ref}
      className={className}
      role="radiogroup"
      aria-labelledby={ids.group}
      aria-disabled={disabled}
      disabled={disabled}
      darkTheme={darkTheme}
    >
      <VisuallyHiddenRadioGroupLabel id={ids.group}>
        {groupLabel}
      </VisuallyHiddenRadioGroupLabel>

      <RadioButtonLabel
        htmlFor={ids.onInput}
        isActive={value}
        disabled={disabled}
      >
        {onLabel}
        <HiddenRadioButton
          checked={value}
          disabled={disabled}
          id={ids.onInput}
          onChange={handleChange}
          value={VALUES.ON}
          {...props}
        />
      </RadioButtonLabel>
      <RadioButtonLabel
        htmlFor={ids.offInput}
        isActive={!value}
        disabled={disabled}
        darkTheme={darkTheme}
      >
        {offLabel}
        <HiddenRadioButton
          checked={!value}
          disabled={disabled}
          id={ids.offInput}
          onChange={handleChange}
          value={VALUES.OFF}
          {...props}
        />
      </RadioButtonLabel>
      <SlidingButton hasOffset={!value} />
    </SwitchContainer>
  );
});
Switch.displayName = 'Switch';
export const SwitchPropTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  groupLabel: PropTypes.string.isRequired,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  offLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  onChange: PropTypes.func.isRequired,
  onLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  value: PropTypes.bool,
  darkTheme: PropTypes.bool,
};
Switch.propTypes = SwitchPropTypes;
