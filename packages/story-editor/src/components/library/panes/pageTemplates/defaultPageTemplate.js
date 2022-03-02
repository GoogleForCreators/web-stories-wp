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
import { forwardRef, useState } from '@googleforcreators/react';
import styled from 'styled-components';
import { _x, sprintf, __ } from '@googleforcreators/i18n';
import {
  Button,
  BUTTON_TYPES,
  THEME_CONSTANTS,
  Text,
  themeHelpers,
  ThemeGlobals,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import InsertionOverlay from '../shared/insertionOverlay';
import { PageTemplateTitleContainer } from '../shared';
import { PAGE_TEMPLATE_TYPES } from './constants';

const PageTemplateWrapper = styled.div``;

const PageTemplateButton = styled(Button).attrs({ type: BUTTON_TYPES.PLAIN })`
  position: relative;
  display: block;
  padding: 0;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  overflow: hidden;

  &.${ThemeGlobals.FOCUS_VISIBLE_SELECTOR},
    &[data-focus-visible-added]
    [role='presentation'] {
    box-shadow: none;
  }

  &.${ThemeGlobals.FOCUS_VISIBLE_SELECTOR} [role='presentation'],
  &[data-focus-visible-added] [role='presentation'] {
    ${({ theme }) =>
      themeHelpers.focusCSS(
        theme.colors.border.focus,
        theme.colors.bg.secondary
      )};
  }
`;

const TemplateTitleContainer = styled(PageTemplateTitleContainer)`
  ${PageTemplateButton}:hover &,
  ${PageTemplateButton}:focus & {
    opacity: 1;
  }
`;

const PosterImg = styled.img`
  display: block;
  width: 100%;
`;

const DefaultPageTemplate = forwardRef(
  ({ page, columnWidth, isActive, onFocus, ...rest }, ref) => {
    const templateTitle = sprintf(
      /* translators: 1: template name. 2: page template name. */
      _x('%1$s %2$s', 'page template title', 'web-stories'),
      page.title,
      PAGE_TEMPLATE_TYPES[page.type].name
    );
    const [isFocused, setIsFocused] = useState(false);

    return (
      <PageTemplateWrapper ref={ref} role="listitem">
        <PageTemplateButton
          columnWidth={columnWidth}
          tabIndex={isActive ? 0 : -1}
          aria-label={templateTitle}
          onPointerEnter={() => setIsFocused(true)}
          onPointerLeave={() => setIsFocused(false)}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => setIsFocused(false)}
          {...rest}
        >
          {page.png && (
            <PosterImg
              src={page.png}
              alt={sprintf(
                /* translators: 1: page title */
                __('Snapshot of page template for %1$s', 'web-stories'),
                page.title
              )}
              crossOrigin="anonymous"
              decoding="async"
              draggable={false}
            />
          )}
          {isFocused && <InsertionOverlay />}
          {page.title && (
            <TemplateTitleContainer>
              <Text
                as="span"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
              >
                {templateTitle}
              </Text>
            </TemplateTitleContainer>
          )}
        </PageTemplateButton>
      </PageTemplateWrapper>
    );
  }
);

DefaultPageTemplate.propTypes = {
  isActive: PropTypes.bool,
  page: PropTypes.object.isRequired,
  columnWidth: PropTypes.number.isRequired,
};

DefaultPageTemplate.displayName = 'DefaultPageTemplate';

export default DefaultPageTemplate;
