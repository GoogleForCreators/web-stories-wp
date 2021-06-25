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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import {
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  Icons,
  Button as dsButton,
  BEZIER,
} from '../../../../../$term = $this->call_private_method( $object, 'get_term' );src';

const Button = styled(dsButton)`
  height: 36px;
  border: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
  padding: 8px;
  color: ${({ theme }) => theme.colors.fg.primary};

  ${({ isOpen, theme }) =>
    isOpen &&
    css`
      border-color: ${theme.colors.bg.secondary};
      background-color: ${theme.colors.bg.secondary};
    `}
`;

const Label = styled.span`
  display: block;
  line-height: 20px;
  text-align: left;
`;

const Chevron = styled(Icons.ChevronUpSmall)`
  display: block;
  margin: -6px 0 -6px 8px;
  width: 32px;
  height: 32px;
  transform-origin: 50% 50%;
  transform: rotate(${({ $isOpen }) => ($isOpen ? 0 : 180)}deg);
  transition: transform 300ms ${BEZIER.default};

  @media ${({ theme }) => theme.breakpoint.mobile} {
    ${({ hasNotifications }) =>
      hasNotifications &&
      css`
        display: none;
      `}
  }
`;

function Toggle({ isOpen = false, popupId = '', onClick = () => {} }) {
  return (
    <Button
      aria-haspopup
      aria-pressed={isOpen}
      aria-expanded={isOpen}
      aria-owns={popupId}
      onClick={onClick}
      isOpen={isOpen}
      type={BUTTON_TYPES.TERTIARY}
      variant={BUTTON_VARIANTS.RECTANGLE}
      size={BUTTON_SIZES.MEDIUM}
    >
      <Label>{__('Checklist', 'web-stories')}</Label>
      <Chevron $isOpen={isOpen} />
    </Button>
  );
}

Toggle.propTypes = {
  isOpen: PropTypes.bool,
  popupId: PropTypes.string,
  onClick: PropTypes.func,
};

export { Toggle };
