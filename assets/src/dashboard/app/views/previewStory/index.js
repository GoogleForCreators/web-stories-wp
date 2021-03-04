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
import { __, sprintf } from '@web-stories-wp/i18n';

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
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  Modal,
  Text,
  THEME_CONSTANTS,
  useResizeEffect,
} from '../../../../design-system';
import { WPBODY_ID } from '../../../constants';
import { StoryPropType } from '../../../types';
import useApi from '../../api/useApi';
import { ERRORS } from '../../textContent';

const AMP_LOCAL_STORAGE = 'amp-story-state';
const PREVIEW_CONTAINER_ID = 'previewContainer';

const CloseButtonContainer = styled.div`
  align-self: flex-end;
  margin: 14px 10px 4px 0;
`;

const CloseButton = styled(Button)`
  color: ${({ theme }) => theme.colors.standard.white};
`;

// 54 getting subtracted from height is the size of the close button + margin. The Iframe wants specifics in safari, this is important to make sure the close button is visible.
const IframeContainer = styled.div`
  width: ${({ dimensions }) => `${dimensions.width}px`};
  min-height: 90vh;
  height: calc(100% - ${THEME_CONSTANTS.WP_ADMIN.TOOLBAR_HEIGHT}px);

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
      const iframe = document.createElement('iframe');
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
      setPreviewError(ERRORS.RENDER_PREVIEW.MESSAGE);
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
        height: `calc(100% - ${THEME_CONSTANTS.WP_ADMIN.TOOLBAR_HEIGHT}px)`,
        width: `${modalDimensions.width}px`,
        display: 'flex',
        flexDirection: 'column',
      }}
      overlayStyles={{
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        backgroundColor: theme.colors.bg.storyPreview,
      }}
    >
      <>
        <CloseButtonContainer>
          <CloseButton
            variant={BUTTON_VARIANTS.SQUARE}
            type={BUTTON_TYPES.PLAIN}
            size={BUTTON_SIZES.SMALL}
            onClick={handleClose}
            aria-label={__('close preview', 'web-stories')}
          >
            <Icons.Cross aria-hidden={true} />
          </CloseButton>
        </CloseButtonContainer>
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
            <Button
              type={BUTTON_TYPES.PRIMARY}
              size={BUTTON_SIZES.MEDIUM}
              onClick={handleClose}
            >
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
