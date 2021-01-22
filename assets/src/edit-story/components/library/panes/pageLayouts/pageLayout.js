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
import { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useFocusOut, useKeyDownEffect } from '../../../../../design-system';
import { PageSizePropType } from '../../../../types';
import { PreviewPage, PreviewErrorBoundary } from '../../../previewPage';
import { STORY_ANIMATION_STATE } from '../../../../../animation';
import { KEYBOARD_USER_SELECTOR } from '../../../../utils/keyboardOnlyOutline';
import useRovingTabIndex from '../../../../utils/useRovingTabIndex';
import ConfirmPageLayoutDialog from './confirmPageLayoutDialog';

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

  ${KEYBOARD_USER_SELECTOR} &:focus {
    outline: ${({ theme }) => `2px solid ${theme.colors.selection} !important`};
  }
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
  border-radius: ${({ theme }) => theme.DEPRECATED_THEME.border.radius.default};
  overflow: hidden;
`;
PreviewPageWrapper.propTypes = {
  pageSize: PageSizePropType.isRequired,
};

const PageLayoutTitle = styled.div`
  position: absolute;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.grayout};
  border-radius: ${({ theme }) => theme.border.radius.default};
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

function PageLayout({
  page,
  pageSize,
  onConfirm,
  requiresConfirmation,
  translateY,
  translateX,
}) {
  const ref = useRef();
  const [isActive, setIsActive] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useFocusOut(ref, () => setIsActive(false), []);
  useRovingTabIndex({ ref });

  const handleClick = useCallback(() => {
    if (requiresConfirmation) {
      setIsConfirming(true);
    } else {
      onConfirm();
    }
  }, [setIsConfirming, onConfirm, requiresConfirmation]);

  const handleCloseDialog = useCallback(() => {
    setIsConfirming(false);
  }, [setIsConfirming]);

  const handleConfirmDialog = useCallback(() => {
    onConfirm();
    setIsConfirming(false);
  }, [onConfirm, setIsConfirming]);

  useKeyDownEffect(ref, ['enter', 'space'], handleClick, [handleClick]);

  return (
    <>
      <PageLayoutWrapper
        pageSize={pageSize}
        role="button"
        ref={ref}
        tabIndex={0}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
        onClick={handleClick}
        aria-label={page.title}
        translateY={translateY}
        translateX={translateX}
      >
        <PreviewPageWrapper pageSize={pageSize}>
          <PreviewErrorBoundary>
            <PreviewPage
              pageSize={pageSize}
              page={page}
              animationState={
                isActive
                  ? STORY_ANIMATION_STATE.PLAYING
                  : STORY_ANIMATION_STATE.RESET
              }
            />
          </PreviewErrorBoundary>
        </PreviewPageWrapper>

        <PageLayoutTitle isActive={isActive}>{page.title}</PageLayoutTitle>
      </PageLayoutWrapper>
      {isConfirming && (
        <ConfirmPageLayoutDialog
          onConfirm={handleConfirmDialog}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
}

PageLayout.propTypes = {
  page: PropTypes.object.isRequired,
  pageSize: PageSizePropType.isRequired,
  onConfirm: PropTypes.func.isRequired,
  requiresConfirmation: PropTypes.bool.isRequired,
  translateY: PropTypes.number.isRequired,
  translateX: PropTypes.number.isRequired,
};

export default PageLayout;
