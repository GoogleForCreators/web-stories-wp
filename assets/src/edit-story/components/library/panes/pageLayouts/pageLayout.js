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
import { PageSizePropType } from '../../../../types';
import { PreviewPage, PreviewErrorBoundary } from '../../../previewPage';
import useFocusOut from '../../../../utils/useFocusOut';
import { STORY_ANIMATION_STATE } from '../../../../../animation';
import { KEYBOARD_USER_SELECTOR } from '../../../../utils/keyboardOnlyOutline';
import ConfirmPageLayoutDialog from './confirmPageLayoutDialog';

const PageLayoutWrapper = styled.div`
  position: relative;
  height: ${({ pageSize }) => pageSize.containerHeight}px;
  width: ${({ pageSize }) => pageSize.width}px;
`;
PageLayoutWrapper.propTypes = {
  pageSize: PageSizePropType.isRequired,
};

const PreviewPageWrapper = styled.div`
  height: ${({ pageSize }) => pageSize.containerHeight}px;
  width: ${({ pageSize }) => pageSize.width}px;
  position: absolute;
  z-index: -1;
  background-color: ${({ theme }) =>
    theme.DEPRECATED_THEME.colors.loading.primary};
  border-radius: ${({ theme }) => theme.DEPRECATED_THEME.border.radius.default};
  overflow: hidden;
`;
PreviewPageWrapper.propTypes = {
  pageSize: PageSizePropType.isRequired,
};

const HoverControls = styled.div`
  height: ${({ pageSize }) => pageSize.containerHeight}px;
  width: ${({ pageSize }) => pageSize.width}px;
  position: absolute;
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.DEPRECATED_THEME.border.radius.default};
  overflow: hidden;

  ${KEYBOARD_USER_SELECTOR} &:focus {
    outline: ${({ theme }) =>
      `2px solid ${theme.DEPRECATED_THEME.colors.selection} !important`};
  }
`;
HoverControls.propTypes = {
  pageSize: PageSizePropType.isRequired,
  isActive: PropTypes.bool.isRequired,
};

const PageLayoutTitle = styled.div`
  position: absolute;
  bottom: 0;
  background-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.grayout};
  padding: 8px;
  font-size: 12px;
  line-height: 22px;
  width: 100%;
`;

function PageLayout(props, ref) {
  const { isFocused, page, pageSize, onConfirm, requiresConfirmation } = props;
  const [isActive, setIsActive] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useFocusOut(ref, () => setIsActive(false), []);

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

  const handleKeyUp = useCallback(
    ({ key }) => {
      if (key === 'Enter' && isActive) {
        handleClick();
      }
    },
    [handleClick, isActive]
  );

  const handleFocus = useCallback(
    (event) => {
      // if pageLayouts are in focus we want to make sure this focus event doesn't bubble up and reset the keyboard nav.
      if (isFocused) {
        event.stopPropagation();
      }
      setIsActive(true);
    },
    [isFocused]
  );

  const handleBlur = useCallback(
    (event) => {
      // if pageLayouts are in focus we want to make sure this blur event doesn't bubble up and reset the keyboard nav.
      if (isFocused) {
        event.stopPropagation();
      }
      setIsActive(false);
    },
    [isFocused]
  );

  return (
    <>
      <PageLayoutWrapper pageSize={pageSize} role="listitem">
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
        <HoverControls
          ref={ref}
          pageSize={pageSize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={() => setIsActive(true)}
          onMouseLeave={() => setIsActive(false)}
          onKeyUp={handleKeyUp}
          onClick={handleClick}
          isActive={isActive}
          aria-label={page.title}
          tabIndex="0"
          role="button"
        >
          <PageLayoutTitle>{page.title}</PageLayoutTitle>
        </HoverControls>
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
  isFocused: PropTypes.bool,
};

export default forwardRef(PageLayout);
