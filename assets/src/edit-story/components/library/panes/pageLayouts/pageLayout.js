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
import { useState, useCallback, forwardRef } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { themeHelpers, useFocusOut } from '../../../../../design-system';
import { PageSizePropType } from '../../../../types';
import { PreviewPage, PreviewErrorBoundary } from '../../../previewPage';
import { STORY_ANIMATION_STATE } from '../../../../../animation';

const PageLayoutWrapper = styled.div`
  position: absolute;
  top: 0;
  height: ${({ pageSize }) => pageSize.containerHeight}px;
  width: ${({ pageSize }) => pageSize.width}px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transform: ${({ translateX, translateY }) =>
    `translateX(${translateX}px) translateY(${translateY}px)`};

  ${themeHelpers.focusableOutlineCSS};
`;
PageLayoutWrapper.propTypes = {
  pageSize: PageSizePropType.isRequired,
  translateY: PropTypes.number.isRequired,
  translateX: PropTypes.number.isRequired,
};

const PreviewPageWrapper = styled.div`
  height: ${({ pageSize }) => pageSize.containerHeight}px;
  width: ${({ pageSize }) => pageSize.width}px;
  z-index: -1;
  background-color: ${({ theme }) =>
    theme.DEPRECATED_THEME.colors.loading.primary};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  overflow: hidden;
`;
PreviewPageWrapper.propTypes = {
  pageSize: PageSizePropType.isRequired,
};

const PageLayoutTitle = styled.div`
  position: absolute;
  bottom: 0;
  background-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.grayout};
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

PageLayoutTitle.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

function PageLayout(
  { page, pageSize, translateY, translateX, isActive, ...rest },
  ref
) {
  const [isHover, setIsHover] = useState(false);
  const isActivePage = isHover || isActive;

  useFocusOut(ref, () => setIsHover(false), []);

  const handleSetHoverActive = useCallback(() => setIsHover(true), []);

  const handleSetHoverFalse = useCallback(() => {
    setIsHover(false);
  }, []);

  return (
    <PageLayoutWrapper
      pageSize={pageSize}
      role="button"
      ref={ref}
      tabIndex={0}
      onMouseEnter={handleSetHoverActive}
      onMouseLeave={handleSetHoverFalse}
      aria-label={page.title}
      translateY={translateY}
      translateX={translateX}
      {...rest}
    >
      <PreviewPageWrapper pageSize={pageSize}>
        <PreviewErrorBoundary>
          <PreviewPage
            pageSize={pageSize}
            page={page}
            animationState={
              isActivePage
                ? STORY_ANIMATION_STATE.PLAYING
                : STORY_ANIMATION_STATE.RESET
            }
          />
        </PreviewErrorBoundary>
      </PreviewPageWrapper>

      <PageLayoutTitle isActive={isActivePage}>{page.title}</PageLayoutTitle>
    </PageLayoutWrapper>
  );
}

PageLayout.propTypes = {
  isActive: PropTypes.bool,
  page: PropTypes.object.isRequired,
  pageSize: PageSizePropType.isRequired,
  translateY: PropTypes.number.isRequired,
  translateX: PropTypes.number.isRequired,
};

PageLayout.displayName = 'PageLayout';

export default forwardRef(PageLayout);
