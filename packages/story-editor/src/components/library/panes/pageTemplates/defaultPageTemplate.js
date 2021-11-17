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
import { forwardRef } from '@web-stories-wp/react';
import styled from 'styled-components';
import { _x, sprintf, __ } from '@web-stories-wp/i18n';
import {
  Button,
  BUTTON_TYPES,
  THEME_CONSTANTS,
  Text,
} from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { PAGE_TEMPLATE_TYPES } from './constants';

const PageTemplateWrapper = styled.div``;

const PageTemplateButton = styled(Button).attrs({ type: BUTTON_TYPES.PLAIN })`
  position: relative;
  display: block;
  padding: 0;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  overflow: hidden;
`;

const PageTemplateTitleContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.opacity.black64};
  opacity: 0;

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
  ({ page, columnWidth, isActive, ...rest }, ref) => {
    const templateTitle = sprintf(
      /* translators: 1: template name. 2: page template name. */
      _x('%1$s %2$s', 'page template title', 'web-stories'),
      page.title,
      PAGE_TEMPLATE_TYPES[page.type].name
    );

    return (
      <PageTemplateWrapper ref={ref} role="listitem">
        <PageTemplateButton
          columnWidth={columnWidth}
          tabIndex={isActive ? 0 : -1}
          aria-label={templateTitle}
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
              draggable={false}
            />
          )}
          {page.title && (
            <PageTemplateTitleContainer>
              <Text
                as="span"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
              >
                {templateTitle}
              </Text>
            </PageTemplateTitleContainer>
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
