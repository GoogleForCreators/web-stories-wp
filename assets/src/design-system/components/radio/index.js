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
import { themeHelpers } from '../../theme';
import { FOCUS_VISIBLE_SELECTOR } from '../../theme/global';
import { Text } from '../typography';

const BORDER_WIDTH = 1;
const RING_DIAMETER = 24;
const CONTAINER_DIAMETER = 24 + BORDER_WIDTH * 2;
const RADIO_DIAMETER = 16;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonContainer = styled.div`
  position: relative;
  height: ${CONTAINER_DIAMETER}px;
  width: ${CONTAINER_DIAMETER}px;
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
  height: ${CONTAINER_DIAMETER}px;
  width: ${CONTAINER_DIAMETER}px;
  margin: 0;
  opacity: 0;
  cursor: pointer;

  :hover ~ ${RadioBorder} {
    border-color: ${({ theme }) => theme.colors.border.defaultHover};
  }

  :focus ~ ${RadioBorder}, &.${FOCUS_VISIBLE_SELECTOR} ~ ${RadioBorder} {
    ${themeHelpers.focusableOutlineCSS};
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

const Label = styled(Text).attrs({ forwardedAs: 'label' })`
  margin-left: 12px;
`;

export function Radio({ className, id, label, ...props }) {
  const inputId = useMemo(() => id || uuidv4(), [id]);

  return (
    <Container>
      <ButtonContainer className={className}>
        <HiddenInput {...props} />
        <RadioBorder />
        <InnerButton />
      </ButtonContainer>
      {label && <Label htmlFor={inputId}>{label}</Label>}
    </Container>
  );
}
Radio.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
};
