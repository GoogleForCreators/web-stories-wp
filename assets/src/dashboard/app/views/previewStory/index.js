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
import { useCallback, useEffect, useRef, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeContext } from 'styled-components';

/**
 * Internal dependencies
 */
import {
  Button,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  Modal,
  Text,
  themeHelpers,
} from '../../../../design-system';
import { WPBODY_ID } from '../../../constants';
import { StoryPropType } from '../../../types';
import { useResizeEffect } from '../../../utils';
import useApi from '../../api/useApi';

const CLOSE_BUTTON_SIZE = {
  HEIGHT: 20,
  WIDTH: 20,
};
const AMP_LOCAL_STORAGE = 'amp-story-state';
const PREVIEW_CONTAINER_ID = 'previewContainer';

const CloseButton = styled(Button)`
  align-self: flex-end;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.white};
  margin: 15px 11px 5px 0;
  width: ${CLOSE_BUTTON_SIZE.WIDTH}px;
  height: ${CLOSE_BUTTON_SIZE.HEIGHT}px;
  border: ${({ theme }) => theme.DEPRECATED_THEME.borders.transparent};
  background-color: transparent;
  z-index: 15;
  ${({ theme }) =>
    themeHelpers.focusableOutlineCSS(
      theme.colors.bg.overlay,
      theme.colors.accent.secondary
    )};

  &:hover {
    cursor: pointer;
  }
`;

const IframeContainer = styled.div`
  width: ${({ dimensions }) => `${dimensions.width}px`};

  height: ${({ dimensions }) => `${dimensions.height - 40}px`};
  max-height: calc(100vh - 40px);

  &:focus {
    border: ${({ theme }) => theme.DEPRECATED_THEME.borders.bluePrimary};
    border-width: 2px;
  }
`;

const HelperText = styled(Text)`
  padding-bottom: 20px;
  color: ${({ theme }) => theme.colors.standard.white};
`;

const HelperContainer = styled.div`
  position: ${({ overlay }) => (overlay ? 'absolute' : 'inherit')};
  width: 100%;
  height: calc(100% - 40px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  /* Because this modal is "dark mode" we need to override focusable outline */
  & > button {
    ${({ theme }) =>
      themeHelpers.focusableOutlineCSS(
        theme.colors.bg.overlay,
        theme.colors.accent.secondary
      )};
  }
`;

const PreviewStory = ({ story, handleClose }) => {
  const {
    previewMarkup,
    isLoading,
    error,
    createStoryPreview,
    clearStoryPreview,
  } = useApi(
    ({
      state: {
        stories: { previewMarkup, isLoading, error },
      },
      actions: {
        storyApi: { createStoryPreview, clearStoryPreview },
      },
    }) => ({
      previewMarkup,
      isLoading,
      error,
      createStoryPreview,
      clearStoryPreview,
    })
  );

  const theme = useContext(ThemeContext);

  const containerRef = useRef(document.getElementById(WPBODY_ID));
  const iframeContainerRef = useRef();

  const [modalDimensions, setModalDimensions] = useState({
    width: containerRef.current?.offsetWidth || window.innerWidth,
    height: containerRef.current?.offsetHeight || window.innerHeight,
  });
  const [previewError, setPreviewError] = useState(error.message?.title);

  useEffect(() => {
    const iframeContainer = document.getElementById(PREVIEW_CONTAINER_ID);
    if (previewMarkup.length > 0 && iframeContainer) {
      let iframe = document.createElement('iframe');
      iframeContainer.appendChild(iframe);
      iframe.setAttribute('style', 'height:100%;width:100%;border:none;');
      iframe.setAttribute('title', __('AMP preview', 'web-stories'));
      iframe.setAttribute('tabindex', 0);
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(previewMarkup);
      iframe.contentWindow.document.close();
    }
    return () => {
      if (iframeContainer) {
        iframeContainer.innerHTML = '';
      }
    };
  }, [previewMarkup]);

  useEffect(() => {
    if (localStorage.getItem(AMP_LOCAL_STORAGE)) {
      localStorage.removeItem(AMP_LOCAL_STORAGE);
    }
    if (!story || !story.pages.length) {
      setPreviewError(__('Unable to Render Preview', 'web-stories'));
    } else {
      createStoryPreview(story);
    }

    return () => {
      clearStoryPreview();
      localStorage.removeItem(AMP_LOCAL_STORAGE);
    };
  }, [story, clearStoryPreview, createStoryPreview]);

  useResizeEffect(
    containerRef,
    ({ width, height }) => {
      setModalDimensions({ width, height });
    },
    [setModalDimensions]
  );

  const handleIframeFocus = useCallback(({ key, shiftKey }) => {
    if (key.toLowerCase() !== 'tab') {
      return false;
    }
    if (!shiftKey && iframeContainerRef?.current) {
      // Force focus within the iframe to circumnavigate browser settings
      return iframeContainerRef?.current.firstChild.contentWindow.document.body.focus();
    }
    return containerRef.current.focus();
  }, []);

  return (
    <Modal
      contentLabel={
        (story?.title &&
          sprintf(
            /* translators: %s: story title. */
            __('preview of %s', 'web-stories'),
            story.title
          )) ||
        __('Story Preview', 'web-stories')
      }
      isOpen
      onClose={handleClose}
      contentStyles={{
        height: `${modalDimensions.height}px`,
        width: `${modalDimensions.width}px`,
        display: 'flex',
        flexDirection: 'column',
      }}
      overlayStyles={{
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        backgroundColor: theme.colors.bg.overlay,
      }}
    >
      <>
        <CloseButton
          variant={BUTTON_VARIANTS.ICON}
          type={BUTTON_TYPES.PLAIN}
          onClick={handleClose}
          aria-label={__('close preview', 'web-stories')}
        >
          <Icons.Close aria-hidden={true} />
        </CloseButton>

        {!previewError && (
          <IframeContainer
            ref={iframeContainerRef}
            dimensions={modalDimensions}
            id={PREVIEW_CONTAINER_ID}
            data-testid="preview-iframe"
            onKeyDown={handleIframeFocus}
            tabIndex={0}
          />
        )}

        {isLoading && !previewError && (
          <HelperContainer overlay>
            <HelperText>{__('Loading\u2026', 'web-stories')}</HelperText>
          </HelperContainer>
        )}

        {previewError && (
          <HelperContainer>
            <HelperText>{previewError}</HelperText>
            <Button type={BUTTON_TYPES.PRIMARY} onClick={handleClose}>
              {__('Close Preview', 'web-stories')}
            </Button>
          </HelperContainer>
        )}
      </>
    </Modal>
  );
};

export default PreviewStory;

PreviewStory.propTypes = {
  handleClose: PropTypes.func.isRequired,
  story: StoryPropType.isRequired,
};
