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
import { useEffect, useRef, useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Modal, TypographyPresets, Button } from '../../../components';
import { WPBODY_ID, BUTTON_TYPES } from '../../../constants';
import dashboardTheme from '../../../theme';
import { Close as CloseIcon } from '../../../icons';
import { StoryPropType } from '../../../types';
import { useResizeEffect } from '../../../utils';
import { ApiContext } from '../../api/apiProvider';

const CLOSE_BUTTON_SIZE = {
  HEIGHT: 30,
  WIDTH: 30,
};
const PREVIEW_CONTAINER_ID = 'previewContainer';

const CloseButton = styled.button`
  align-self: flex-end;
  color: ${({ theme }) => theme.colors.white};
  margin-top: 20px;
  margin-right: 11px;
  width: ${CLOSE_BUTTON_SIZE.WIDTH}px;
  height: ${CLOSE_BUTTON_SIZE.HEIGHT}px;
  border: ${({ theme }) => theme.borders.transparent};
  background-color: transparent;
  z-index: 10;
`;

const IframeContainer = styled.div`
  width: ${({ dimensions }) => `${dimensions.width}px`};
  height: ${({ dimensions }) =>
    `${dimensions.height - CLOSE_BUTTON_SIZE.HEIGHT}px`};
`;

const HelperText = styled.p`
  ${TypographyPresets.Large};
  margin: 0;
  padding-bottom: 20px;
  color: ${({ theme }) => theme.colors.white};
`;

const HelperContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const PreviewStory = ({ story, handleClose, isTemplate }) => {
  const {
    state: {
      stories: { previewMarkup, isLoading, error },
    },
    actions: {
      storyApi: { createStoryPreviewFromTemplate, clearStoryPreview },
    },
  } = useContext(ApiContext);

  const containerRef = useRef(document.getElementById(WPBODY_ID));

  const [isReadyToRenderPreview, setIsReadyToRenderPreview] = useState(false);
  const [modalDimensions, setModalDimensions] = useState({
    width: containerRef.current?.offsetWidth || window.innerWidth,
    height: containerRef.current?.offsetHeight || window.innerHeight,
  });
  const [previewError, setPreviewError] = useState(error.message?.title);

  const handleReadyToRenderPreview = useCallback(() => {
    setIsReadyToRenderPreview(true);
  }, [setIsReadyToRenderPreview]);

  useEffect(() => {
    // this is necessary for the #previewContainer to be findable by document
    if (previewMarkup.length > 0) {
      handleReadyToRenderPreview();
    }
  }, [handleReadyToRenderPreview, previewMarkup.length]);

  useEffect(() => {
    if (isReadyToRenderPreview) {
      let iframe = document.createElement('iframe');
      document.getElementById(PREVIEW_CONTAINER_ID).appendChild(iframe);
      iframe.setAttribute('style', 'height:100%;width:100%;border:none;');
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(previewMarkup);
      iframe.contentWindow.document.close();
    }
  }, [previewMarkup, isReadyToRenderPreview]);

  useEffect(() => {
    if (!story) {
      setPreviewError(__('Unable to Render Preview', 'web-stories'));
    } else if (isTemplate) {
      createStoryPreviewFromTemplate(story);
    } else {
      // TODO handle story previews. Should be the default
    }
    return () => {
      clearStoryPreview();
    };
  }, [isTemplate, story, createStoryPreviewFromTemplate, clearStoryPreview]);

  useResizeEffect(
    containerRef,
    ({ width, height }) => {
      setModalDimensions({ width, height });
    },
    [setModalDimensions]
  );

  return (
    <Modal
      contentLabel={
        (story?.title &&
          sprintf(
            /* translators: %s: name of story or template getting previewed */
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
        backgroundColor: dashboardTheme.colors.storyPreviewBackground,
      }}
    >
      <>
        <CloseButton
          onClick={handleClose}
          aria-label={__('close', 'web-stories')}
        >
          <CloseIcon aria-hidden={true} />
        </CloseButton>

        {!previewError && (
          <IframeContainer
            dimensions={modalDimensions}
            id={PREVIEW_CONTAINER_ID}
            data-testid="preview-iframe"
          />
        )}

        {isLoading && !previewError && (
          <HelperContainer>
            <HelperText>{__('Loading\u2026', 'web-stories')}</HelperText>
          </HelperContainer>
        )}

        {previewError && (
          <HelperContainer>
            <HelperText>{previewError}</HelperText>
            <Button type={BUTTON_TYPES.CTA} onClick={handleClose}>
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
  isTemplate: PropTypes.bool,
  story: StoryPropType.isRequired,
};
