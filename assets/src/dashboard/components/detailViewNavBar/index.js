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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import { BUTTON_TYPES, KEYBOARD_USER_SELECTOR } from '../../constants';
import { BookmarkChip, Button } from '../../components';
import { parentRoute } from '../../app/router/route';
import { TypographyPresets } from '../typography';

const Nav = styled.nav`
  ${({ theme }) => `
  position: relative;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${theme.internalTheme.borders.gray50};
  background-color: ${theme.internalTheme.colors.white};
  display: flex;
  flex-direction: row;
  width: 100%;
  height: ${theme.internalTheme.navBar.height}px;

  padding: 0 ${theme.internalTheme.detailViewContentGutter.desktop}px;

  @media ${theme.internalTheme.breakpoint.tablet} {
    padding: 0 ${theme.internalTheme.detailViewContentGutter.tablet}px;
  }

  @media ${theme.internalTheme.breakpoint.smallDisplayPhone} {
    flex-wrap: wrap;
    padding: 0 ${theme.internalTheme.detailViewContentGutter.min}px;
  }
  `}
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const BookmarkToggle = styled(BookmarkChip)`
  margin-right: 10px;
`;

const CloseLink = styled.a`
  ${TypographyPresets.Medium};
  ${({ theme }) => `
    text-decoration: none;
    font-weight: ${theme.internalTheme.typography.weight.bold};
    color: ${theme.internalTheme.colors.gray700};

    ${KEYBOARD_USER_SELECTOR} &:focus {
      outline: 2px solid ${rgba(
        theme.internalTheme.colors.bluePrimary,
        0.85
      )} !important;
    }
  `}
`;
const CapitalizedButton = styled(Button)`
  text-transform: uppercase;
`;

export function DetailViewNavBar({
  closeViewAriaLabel = __('Close', 'web-stories'),
  handleCta,
  handleBookmarkClick,
  ctaText,
}) {
  return (
    <Nav>
      <Container>
        <CloseLink aria-label={closeViewAriaLabel} href={parentRoute()}>
          {__('Close', 'web-stories')}
        </CloseLink>
      </Container>
      <Container>
        {handleBookmarkClick && (
          <BookmarkToggle onClick={handleBookmarkClick} />
        )}
        {ctaText && ctaText.trim().length > 0 && (
          <CapitalizedButton type={BUTTON_TYPES.CTA} onClick={handleCta}>
            {ctaText}
          </CapitalizedButton>
        )}
      </Container>
    </Nav>
  );
}

DetailViewNavBar.propTypes = {
  closeViewAriaLabel: PropTypes.string,
  ctaText: PropTypes.string,
  handleBookmarkClick: PropTypes.func,
  handleCta: PropTypes.func.isRequired,
};
