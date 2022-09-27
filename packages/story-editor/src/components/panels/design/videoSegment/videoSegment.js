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
import { __, sprintf } from '@googleforcreators/i18n';
import styled from 'styled-components';
import {
  Text,
  Button,
  THEME_CONSTANTS,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  useSnackbar,
  Slider,
} from '@googleforcreators/design-system';
import { useCallback, useState, useEffect } from '@googleforcreators/react';
import { createPage, ELEMENT_TYPES } from '@googleforcreators/elements';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { Row as DefaultRow } from '../../../form';
import { SimplePanel } from '../../panel';
import { getCommonValue } from '../../shared';
import { useLocalMedia } from '../../../../app/media';
import { useStory } from '../../../../app/story';
import useInsertElement from '../../../canvas/useInsertElement';

const Row = styled(DefaultRow)`
  margin-top: 2px;
`;

const StyledButton = styled(Button)`
  padding: 12px 8px;
`;

const StyledSlider = styled(Slider)`
  width: 100%;
`;

const HelperText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL,
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
  const insertElement = useInsertElement();

  const {
    pages,
    currentPage,
    addPageAt,
    deleteElementById,
    setSelectedElementsById,
  } = useStory(
    ({
      state: { pages, currentPage },
      actions: { addPageAt, deleteElementById, setSelectedElementsById },
    }) => ({
      pages,
      currentPage,
      addPageAt,
      deleteElementById,
      setSelectedElementsById,
    })
  );

  const { isBatchUploading, segmentVideo } = useLocalMedia(
    ({ state: { isBatchUploading }, actions: { segmentVideo } }) => ({
      segmentVideo,
      isBatchUploading,
    })
  );

  const [isSegmenting, setIsSegmenting] = useState();
  const [segmentedFiles, setSegmentedFiles] = useState([]);
  const [segmentElementId, setSegmentElementId] = useState();
  const [segmentPageId, setSegmentPageId] = useState();
  const [batchCount, setBatchCount] = useState(); // remove this one useEffect + queue check works
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

    let newElement;
    const pageIds = pages.map(({ id }) => id);
    const originalPageIndex = pageIds.indexOf(segmentPageId);

    segmentedFiles.forEach((segmentedResource, index) => {
      if (index >= 1) {
        const page = createPage();
        const position = originalPageIndex + index;
        addPageAt({
          page,
          position,
          select: false,
        });
        insertElement(ELEMENT_TYPES.VIDEO, {
          pageId: page.id,
          resource: segmentedResource,
        });
        // @todo remove this ... add some text to help debug
        insertElement(ELEMENT_TYPES.TEXT, {
          content: segmentedResource.alt,
          pageId: page.id,
          y: 300,
        });
      } else {
        // remove the original non-segmented element
        deleteElementById({ elementId: segmentElementId });
        newElement = insertElement(ELEMENT_TYPES.VIDEO, {
          resource: segmentedResource,
        });

        // @todo remove this ... add some text to help debug
        insertElement(ELEMENT_TYPES.TEXT, {
          content: segmentedResource.alt,
          y: 300,
        });
      }
    });
    setSelectedElementsById({ elementIds: [newElement.id] });
    setIsSegmenting(false);
    setSegmentElementId(null);
    setSegmentPageId(null);
    batchCount(null);
  }, [
    segmentedFiles,
    showSnackbar,
    pages,
    addPageAt,
    insertElement,
    setSelectedElementsById,
    deleteElementById,
    segmentElementId,
    segmentPageId,
    batchCount,
  ]);

  const handleSegmentation = useCallback(async () => {
    setIsSegmenting(true);
    setSegmentElementId(elementId);
    setSegmentPageId(currentPage.id);
    showSnackbar({
      message: __('Video segmentation in progress', 'web-stories'),
      dismissible: true,
    });

    const files = [];
    await segmentVideo(
      { resource, segmentTime },
      ({ resource: newResource, batchPosition, batchCount: count }) => {
        files[batchPosition] = newResource;
        setSegmentedFiles([...files]);
        setBatchCount(count); // remove this one useEffect + queue check works
      }
    );
  }, [
    elementId,
    currentPage,
    showSnackbar,
    segmentVideo,
    segmentTime,
    resource,
    setSegmentedFiles,
  ]);

  useEffect(() => {
    // @todo replace this with isBatchUploading check
    if (
      segmentedFiles.length === batchCount &&
      !segmentedFiles.includes(undefined)
    ) {
      addElementsToPages();
    }
    if (!isBatchUploading('123')) {
      // @todo get proper batchId here
      //
    }
  }, [batchCount, segmentedFiles, addElementsToPages, isBatchUploading]);

  if (!enableSegmentVideo || resource.length <= MIN_SEGMENT_LENGTH) {
    return null;
  }

  return (
    <SimplePanel
      name="videoOptions"
      title={__('Video Segment Settings', 'web-stories')}
    >
      <Row spaceBetween>
        <StyledSlider
          value={segmentTime}
          handleChange={onChangeSegmentTime}
          minorStep={1}
          majorStep={5}
          min={MIN_SEGMENT_LENGTH}
          max={
            resource.length <= MAX_SEGMENT_LENGTH
              ? resource.length - MIN_SEGMENT_LENGTH
              : MAX_SEGMENT_LENGTH
          }
          aria-label={__('Segment length', 'web-stories')}
        />
        {sprintf(
          /* translators: %d number of seconds */
          __('%d sec', 'web-stories'),
          segmentTime
        )}
        <StyledButton
          disabled={isSegmenting}
          variant={BUTTON_VARIANTS.RECTANGLE}
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
          onClick={handleSegmentation}
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
