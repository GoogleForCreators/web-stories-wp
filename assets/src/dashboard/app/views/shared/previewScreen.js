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
import { useFeatures } from 'flagged';

/**
 * Internal dependencies
 */
import getStoryMarkup from '../../../../edit-story/output/utils/getStoryMarkup';
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

const ErrorContainer = styled.div`
  width: 100%;
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ErrorText = styled.p`
  ${TypographyPresets.Large};
  margin: 0;
  padding-bottom: 20px;
  color: ${({ theme }) => theme.colors.white};
`;

const PreviewScreen = ({ story, handleClose, isTemplate }) => {
  const {
    actions: {
      storyApi: { createStoryPreviewFromTemplate },
    },
  } = useContext(ApiContext);
  const flags = useFeatures();

  const containerRef = useRef(document.getElementById(WPBODY_ID));

  const [isReadyToRenderPreview, setIsReadyToRenderPreview] = useState(false);
  const [modalDimensions, setModalDimensions] = useState({
    width: containerRef.current?.offsetWidth || window.innerWidth,
    height: containerRef.current?.offsetHeight || window.innerHeight,
  });
  const [storyMarkup, setStoryMarkup] = useState();
  const [previewError, setPreviewError] = useState('');
  const handleReadyToRenderPreview = useCallback(() => {
    setIsReadyToRenderPreview(true);
  }, [setIsReadyToRenderPreview]);
  useEffect(() => {
    // this is necessary for the #previewContainer to be findable by document
    if (storyMarkup) {
      handleReadyToRenderPreview();
    }
  }, [handleReadyToRenderPreview, storyMarkup]);

  useEffect(() => {
    if (isReadyToRenderPreview) {
      let iframe = document.createElement('iframe');
      document.getElementById(PREVIEW_CONTAINER_ID).appendChild(iframe);
      iframe.setAttribute('style', 'height:100%;width:100%');
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(storyMarkup.toString());
      iframe.contentWindow.document.close();
    }
  }, [storyMarkup, isReadyToRenderPreview]);

  const handleSetStoryMarkup = useCallback(
    async (preppedStory) => {
      const markup = await getStoryMarkup(
        preppedStory.story,
        preppedStory.pages,
        preppedStory.metadata,
        flags
      );
      return setStoryMarkup(markup);
    },
    [flags]
  );

  const handleSetTemplateAsStoryPreview = useCallback(() => {
    createStoryPreviewFromTemplate(story).then((templateMarkup) => {
      if (!templateMarkup.error) {
        handleSetStoryMarkup(templateMarkup);
      }
      return setPreviewError(templateMarkup.error);
    });
  }, [createStoryPreviewFromTemplate, handleSetStoryMarkup, story]);

  useEffect(() => {
    if (!story) {
      setPreviewError(__('Unable to Render Preview', 'web-stories'));
    } else if (isTemplate) {
      handleSetTemplateAsStoryPreview();
    } else {
      handleSetStoryMarkup(story);
    }
  }, [
    handleSetTemplateAsStoryPreview,
    handleSetStoryMarkup,
    isTemplate,
    story,
  ]);

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
          <CloseIcon />
        </CloseButton>
        {!previewError && (
          <IframeContainer
            dimensions={modalDimensions}
            id={PREVIEW_CONTAINER_ID}
          />
        )}

        {previewError && (
          <ErrorContainer>
            <ErrorText>{previewError}</ErrorText>
            <Button type={BUTTON_TYPES.CTA} onClick={handleClose}>
              {__('Close Preview', 'web-stories')}
            </Button>
          </ErrorContainer>
        )}
      </>
    </Modal>
  );
};

export default PreviewScreen;

PreviewScreen.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isTemplate: PropTypes.bool,
  story: StoryPropType.isRequired,
};
