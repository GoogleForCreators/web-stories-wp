/*
 * Copyright 2022 Google LLC
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
import { __ } from '@googleforcreators/i18n';
import styled from 'styled-components';
import {
  Text,
  Button,
  TextSize,
  ButtonSize,
  ButtonType,
  ButtonVariant,
  useSnackbar,
  Slider,
} from '@googleforcreators/design-system';
import { useCallback, useState, useEffect } from '@googleforcreators/react';
import { createNewElement, createPage } from '@googleforcreators/elements';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { Row as DefaultRow } from '../../../form';
import { SimplePanel } from '../../panel';
import { getCommonValue } from '../../shared';
import { useLocalMedia } from '../../../../app/media';
import { useStory } from '../../../../app/story';
import getElementProperties from '../../../canvas/utils/getElementProperties';

const Row = styled(DefaultRow)`
  margin-top: 2px;
`;

const StyledButton = styled(Button)`
  padding: 12px 8px;
`;

const SliderWrapper = styled.div`
  flex: 1;
  margin-right: 20px;
`;

const StyledSlider = styled(Slider)`
  width: 100%;
`;

const HelperText = styled(Text.Paragraph).attrs({
  size: TextSize.XSmall,
})`
  color: ${({ theme }) => theme.colors.fg.tertiary};
`;

function VideoSegmentPanel({ pushUpdate, selectedElements }) {
  const MIN_SEGMENT_LENGTH = 10;
  const MAX_SEGMENT_LENGTH = 60;
  const resource = getCommonValue(selectedElements, 'resource');
  const elementId = getCommonValue(selectedElements, 'id');
  const enableSegmentVideo = useFeature('segmentVideo');

  const onChangeSegmentTime = (value) => {
    pushUpdate({ segmentTime: value }, true);
  };

  const segmentTime = getCommonValue(selectedElements, 'segmentTime', 20);

  const { pageIds, currentPageId, deleteElementById, addElementsAcrossPages } =
    useStory(
      ({
        state: { pages, currentPageId },
        actions: { deleteElementById, addElementsAcrossPages },
      }) => ({
        pageIds: pages.map(({ id }) => id),
        currentPageId,
        deleteElementById,
        addElementsAcrossPages,
      })
    );

  const { isBatchUploading, segmentVideo } = useLocalMedia(
    ({ state: { isBatchUploading }, actions: { segmentVideo } }) => ({
      segmentVideo,
      isBatchUploading,
    })
  );

  // @todo state needs to persist across tabs
  // https://github.com/GoogleForCreators/web-stories-wp/issues/12463
  const [batchId, setBatchId] = useState();
  const [isSegmenting, setIsSegmenting] = useState();
  const [segmentedFiles, setSegmentedFiles] = useState([]);
  const [segmentElementId, setSegmentElementId] = useState();
  const [segmentPageId, setSegmentPageId] = useState();

  const isUploading = batchId && isBatchUploading(batchId);

  const showSnackbar = useSnackbar(({ showSnackbar }) => showSnackbar);

  const segmentButtonText = isSegmenting
    ? __('Segmenting…', 'web-stories')
    : __('Segment', 'web-stories');

  const addElementsToPages = useCallback(() => {
    if (!segmentPageId || !segmentElementId) {
      return;
    }

    showSnackbar({
      message: __('Inserting video segments', 'web-stories'),
      dismissible: false,
    });

    const elements = segmentedFiles.map((segmentedResource) =>
      createNewElement(
        segmentedResource.type,
        getElementProperties(segmentedResource.type, {
          resource: segmentedResource,
        })
      )
    );

    const page = createPage();
    const position = pageIds.indexOf(segmentPageId);

    addElementsAcrossPages({
      elements,
      page,
      position,
    });

    deleteElementById({ elementId: segmentElementId });

    setSegmentedFiles([]);
    setIsSegmenting(false);
    setBatchId(null);
  }, [
    segmentPageId,
    segmentElementId,
    showSnackbar,
    segmentedFiles,
    pageIds,
    addElementsAcrossPages,
    deleteElementById,
  ]);

  const onClick = useCallback(async () => {
    setIsSegmenting(true);
    setSegmentElementId(elementId);
    setSegmentPageId(currentPageId);

    showSnackbar({
      message: __('Video segmentation in progress', 'web-stories'),
      dismissible: true,
    });

    const onUploadSuccess = ({ resource: newResource, batchPosition }) => {
      setSegmentedFiles((f) => {
        f[batchPosition] = newResource;
        return f;
      });
    };

    const batchId_ = await segmentVideo(
      { resource, segmentTime },
      onUploadSuccess
    );

    if (!batchId_) {
      showSnackbar({
        message: __('Segmentation failed', 'web-stories'),
        dismissible: true,
      });

      setIsSegmenting(false);

      return;
    }

    setBatchId(batchId_);
  }, [
    elementId,
    currentPageId,
    showSnackbar,
    segmentVideo,
    segmentTime,
    resource,
  ]);

  useEffect(() => {
    if (!isUploading && segmentedFiles.length >= 1) {
      addElementsToPages();
    }
  }, [isUploading, segmentedFiles, addElementsToPages]);

  if (!enableSegmentVideo || resource.length <= MIN_SEGMENT_LENGTH) {
    return null;
  }

  return (
    <SimplePanel
      name="videoOptions"
      title={__('Video Segment Settings', 'web-stories')}
    >
      <Row spaceBetween>
        <SliderWrapper>
          <StyledSlider
            value={segmentTime}
            handleChange={onChangeSegmentTime}
            minorStep={1}
            majorStep={5}
            min={MIN_SEGMENT_LENGTH}
            max={Math.max(
              MIN_SEGMENT_LENGTH,
              Math.min(resource.length, MAX_SEGMENT_LENGTH)
            )}
            aria-label={__('Segment length', 'web-stories')}
            suffix={'s'}
          />
        </SliderWrapper>
        <StyledButton
          disabled={isSegmenting}
          variant={ButtonVariant.Rectangle}
          type={ButtonType.Secondary}
          size={ButtonSize.Small}
          onClick={onClick}
        >
          {segmentButtonText}
        </StyledButton>
      </Row>
      <Row>
        <HelperText>
          {__(
            'Segmenting your video will split the video across multiple pages',
            'web-stories'
          )}
        </HelperText>
      </Row>
    </SimplePanel>
  );
}

VideoSegmentPanel.propTypes = {
  pushUpdate: PropTypes.func.isRequired,
  selectedElements: PropTypes.array.isRequired,
};

export default VideoSegmentPanel;
