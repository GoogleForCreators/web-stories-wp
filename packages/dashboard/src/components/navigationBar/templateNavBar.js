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
import { __, sprintf } from '@wordpress/i18n';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { BUTTON_TYPES, APP_ROUTES } from '../../constants';
import { ReactComponent as Close } from '../../icons/close.svg';
import BookmarkChip from '../../components/bookmark-chip';
import { Nav, ActionLink } from './components';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const BookmarkToggle = styled(BookmarkChip)`
  margin-right: 10px;
`;

const CloseLink = styled.a`
  display: inline-block;
  color: ${({ theme }) => theme.colors.gray200};
  width: 14px;
  height: 14px;
  margin-right: 20px;
  cursor: pointer;
`;

const Title = styled.h1`
  ${({ theme }) => `
  margin: 0;
  font-family: ${theme.fonts.body1.family};
  font-size: ${theme.fonts.body1.size};
  font-weight: ${theme.fonts.body1.weight};
  line-height: ${theme.fonts.body1.lineHeight};
  color: ${theme.colors.gray700};
  `}
`;

export function TemplateNavBar({ title }) {
  const translatedTitle = sprintf(
    /* translators: %s: template title */
    __('%s Template', 'web-stories'),
    title
  );
  const closeLabel = __('Go back to template gallery', 'web-stories');

  return (
    <Nav>
      <Container>
        <CloseLink
          title={closeLabel}
          aria-label={closeLabel}
          href={`#${APP_ROUTES.TEMPLATES_GALLERY}`}
        >
          <Close />
        </CloseLink>
        <Title>{translatedTitle}</Title>
      </Container>
      <Container>
        <BookmarkToggle />
        <ActionLink type={BUTTON_TYPES.CTA} href={'#'} isLink={true}>
          {__('Use this template', 'web-stories')}
        </ActionLink>
      </Container>
    </Nav>
  );
}

TemplateNavBar.propTypes = {
  title: PropTypes.string.isRequired,
};
