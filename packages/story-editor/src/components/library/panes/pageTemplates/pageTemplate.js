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
import PropTypes from 'prop-types';
import {
  useState,
  useCallback,
  forwardRef,
  useFocusOut,
  useEffect,
  useRef,
} from '@web-stories-wp/react';
import styled from 'styled-components';
import { _x, sprintf } from '@web-stories-wp/i18n';
import {
  Button,
  BUTTON_TYPES,
  themeHelpers,
} from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { PageSizePropType } from '../../../../types';
import { focusStyle } from '../../../panels/shared';
import { PAGE_TEMPLATE_TYPES } from './constants';

const PageTemplateWrapper = styled(Button).attrs({ type: BUTTON_TYPES.PLAIN })`
  position: relative;
  top: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: auto;
  width: ${({ columnWidth }) => columnWidth}px;
  padding: 0;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  cursor: pointer;

  ${({ isHighlighted }) => isHighlighted && themeHelpers.focusCSS};
  ${focusStyle};
`;

const PosterWrapper = styled.div`
  width: 100%;
  height: 100%;
  z-index: -1;
`;

const PosterImg = styled.img`
  display: block;
  width: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borders.radius.small};
`;

const PageTemplateTitle = styled.div`
  position: absolute;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.opacity.overlayDark};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};

  padding: 8px;
  font-size: 12px;
  line-height: 22px;
  width: 100%;
  align-self: flex-end;
`;

PageTemplateTitle.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

function PageTemplate({ page, isActive, pageSize, columnWidth, ...rest }) {
  const [isHover, setIsHover] = useState(false);
  const isActivePage = isHover || isActive;
  const ref = useRef();

  useFocusOut(ref, () => setIsHover(false), []);

  const { highlightedTemplate } = rest;

  const handleSetHoverActive = useCallback(() => setIsHover(true), []);

  const handleSetHoverFalse = useCallback(() => {
    setIsHover(false);
  }, []);

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.focus();
    }
  });

  return (
    <PageTemplateWrapper
      columnWidth={columnWidth}
      role="listitem"
      ref={ref}
      onMouseEnter={handleSetHoverActive}
      onMouseLeave={handleSetHoverFalse}
      aria-label={page.title}
      isHighlighted={page.id === highlightedTemplate}
      {...rest}
    >
      <PosterWrapper>
        {page.webp && (
          <PosterImg src={page.png} alt={page.title} crossOrigin="anonymous" />
        )}
        {page.title && (
          <PageTemplateTitle isActive={isActivePage}>
            {sprintf(
              /* translators: 1: template name. 2: page template
            name. */ _x('%1$s %2$s', 'page template title', 'web-stories'),
              page.title,
              PAGE_TEMPLATE_TYPES[page.type].name
            )}
          </PageTemplateTitle>
        )}
      </PosterWrapper>
    </PageTemplateWrapper>
  );
}

const PageTemplateWithRef = forwardRef(PageTemplate);

PageTemplate.propTypes = {
  isActive: PropTypes.bool,
  page: PropTypes.object.isRequired,
  pageSize: PageSizePropType.isRequired,
  columnWidth: PropTypes.number.isRequired,
  handleDelete: PropTypes.func,
};

PageTemplate.displayName = 'PageTemplate';

export default PageTemplateWithRef;
