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
import { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { themeHelpers, THEME_CONSTANTS } from '../../theme';
import { FOCUS_VISIBLE_SELECTOR } from '../../theme/global';
import { Text } from '../typography';

const BORDER_WIDTH = 1;
const TEXT_GAP_HEIGHT = 4;
const RING_DIAMETER = 22;
const BUTTON_CONTAINER_HEIGHT = RING_DIAMETER + BORDER_WIDTH * 2;
const CONTAINER_HEIGHT = BUTTON_CONTAINER_HEIGHT + TEXT_GAP_HEIGHT;
const RADIO_DIAMETER = 16;

const Container = styled.div`
  display: flex;
  align-items: center;
  height: ${CONTAINER_HEIGHT}px;
`;

const ButtonContainer = styled.div`
  position: relative;
  height: ${BUTTON_CONTAINER_HEIGHT}px;
  width: ${BUTTON_CONTAINER_HEIGHT}px;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  gap: ${TEXT_GAP_HEIGHT}px;
`;

const RadioBorder = styled.span(
  ({ theme }) => css`
    display: inline-block;
    height: ${RING_DIAMETER}px;
    width: ${RING_DIAMETER}px;
    border: ${BORDER_WIDTH}px solid ${theme.colors.border.defaultNormal};
    border-radius: ${theme.borders.radius.round};
    pointer-events: none;
    transition: all 0.15s;
  `
);

const InnerButton = styled.span(
  ({ theme }) => css`
    pointer-events: none;
    display: none;

    :after {
      content: '';
      position: absolute;
      height: ${RADIO_DIAMETER}px;
      width: ${RADIO_DIAMETER}px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: ${theme.colors.fg.primary};
      border-radius: ${theme.borders.radius.round};
    }
  `
);

const HiddenInput = styled.input.attrs({ type: 'radio' })`
  position: absolute;
  height: ${BUTTON_CONTAINER_HEIGHT}px;
  width: ${BUTTON_CONTAINER_HEIGHT}px;
  margin: 0;
  opacity: 0;
  cursor: pointer;

  :hover ~ ${RadioBorder} {
    border-color: ${({ theme }) => theme.colors.border.defaultHover};
  }

  :focus {
    outline: none;
  }

  :focus ~ ${RadioBorder}, &.${FOCUS_VISIBLE_SELECTOR} ~ ${RadioBorder} {
    ${({ theme }) => themeHelpers.focusCSS(theme.colors.border.focus)};
    border-color: ${({ theme }) => theme.colors.border.defaultHover};
  }

  :active ~ ${RadioBorder} {
    box-shadow: 0 0 0 8px ${({ theme }) => theme.colors.shadow.active};
  }

  :checked ~ ${InnerButton} {
    display: block;
  }

  :disabled {
    ~ ${RadioBorder} {
      border-color: ${({ theme }) => theme.colors.border.disable};
    }

    ~ ${InnerButton}::after {
      background-color: ${({ theme }) => theme.colors.fg.disable};
    }
  }
`;

const Hint = styled(Text).attrs({
  forwardedAs: 'span',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

/**
 * A controlled radio button. Can be used with other radio buttons.
 *
 * To configure a group of radio buttons, the following must be done:
 * 1. Give all the radio buttons of a group the same `name`
 * 2. Pass a unique `value` to each radio button. This tracks the value of the specific radio button.
 * 3. Pass `checked={true}` to the radio button that should be selected
 *
 * Keyboard navigation:
 * - [Tab] can be used to navigate between radio groups
 * - [ArrowUp] and [ArrowDown] can be used to navigate between radio buttons
 *
 * @param {Object} props The props
 * @param {string} props.className className that is applied to the outer container
 * @param {string} props.checked whether the radio button is selected
 * @param {string} props.hint hint to display
 * @param {string} props.id unique id used to associate the label to the input
 * @param {string} props.label label to display
 * @param {Function} props.onChange change event handler
 * @param {string} props.value the value of the radio button
 * @return {Object} The radio button
 */
export function Radio({ className, hint, id, label, ...props }) {
  const inputId = useMemo(() => id || uuidv4(), [id]);

  return (
    <Container className={className}>
      <ButtonContainer>
        <HiddenInput {...props} />
        <RadioBorder />
        <InnerButton />
      </ButtonContainer>

      <LabelContainer>
        <Text
          htmlFor={inputId}
          as="label"
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
        >
          {label}
        </Text>
        {hint && <Hint>{hint}</Hint>}
      </LabelContainer>
    </Container>
  );
}
Radio.propTypes = {
  className: PropTypes.string,
  checked: PropTypes.bool,
  hint: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
