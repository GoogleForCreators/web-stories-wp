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
import type { ForwardedRef, ComponentPropsWithoutRef } from 'react';
import { forwardRef, useMemo } from '@googleforcreators/react';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { themeHelpers, TextSize } from '../../theme';
import { Text } from '../typography';

const BORDER_WIDTH = 1;
const TEXT_GAP_HEIGHT = 8;
const RING_DIAMETER = 24;
const CONTAINER_HEIGHT = 44;
const RADIO_DIAMETER = 16;

const Container = styled.div`
  display: flex;
  align-items: center;
  min-height: ${CONTAINER_HEIGHT}px;
  padding: 8px 0;
`;

const RadioInputContainer = styled.div`
  position: relative;
  height: ${RING_DIAMETER}px;
  width: ${RING_DIAMETER}px;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 12px;
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
  height: ${RING_DIAMETER}px;
  width: ${RING_DIAMETER}px;
  margin: 0;
  opacity: 0;
  cursor: pointer;

  :hover ~ ${RadioBorder} {
    border-color: ${({ theme }) => theme.colors.border.defaultHover};
  }

  :focus {
    outline: none;
  }

  :focus ~ ${RadioBorder}, &:focus-visible ~ ${RadioBorder} {
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
    cursor: auto;

    ~ ${RadioBorder} {
      border-color: ${({ theme }) => theme.colors.border.disable};
    }

    ~ ${InnerButton}::after {
      background-color: ${({ theme }) => theme.colors.fg.disable};
    }
  }
`;

const Hint = styled(Text.Span)`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

interface RadioProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  hint?: string;
  label?: string;
}

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
 * @param {string} props.name name of the radio group
 * @param {Function} props.onChange change event handler
 * @param {string} props.value the value of the radio button
 * @return {Object} The radio button
 */
const Radio = forwardRef(function Radio(
  { className, hint, id, label, ...props }: RadioProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const inputId = useMemo(() => id || uuidv4(), [id]);

  return (
    <Container className={className}>
      <RadioInputContainer>
        <HiddenInput id={inputId} ref={ref} {...props} />
        <RadioBorder />
        <InnerButton />
      </RadioInputContainer>

      <LabelContainer>
        <Text.Label htmlFor={inputId} size={TextSize.Small}>
          {label}
        </Text.Label>
        {hint && <Hint>{hint}</Hint>}
      </LabelContainer>
    </Container>
  );
});

export default Radio;
