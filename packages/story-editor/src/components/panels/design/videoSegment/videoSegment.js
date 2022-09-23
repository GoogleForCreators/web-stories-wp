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
import { useCallback, useState } from '@googleforcreators/react';
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

  const { pages, currentPage, addPageAt, deleteElementById } = useStory(
    ({
      state: { pages, currentPage },
      actions: { addPageAt, deleteElementById },
    }) => ({
      pages,
      currentPage,
      addPageAt,
      deleteElementById,
    })
  );

  const { segmentVideo } = useLocalMedia(({ actions: { segmentVideo } }) => ({
    segmentVideo,
  }));

  const [isSegmenting, setIsSegmenting] = useState();
  const showSnackbar = useSnackbar(({ showSnackbar }) => showSnackbar);

  const segmentButtonText = isSegmenting
    ? __('Segmenting…', 'web-stories')
    : __('Segment', 'web-stories');

  const handleSegmentation = useCallback(async () => {
    setIsSegmenting(true);
    showSnackbar({
      message: __('Video segmentation in progress', 'web-stories'),
      dismissible: true,
    });

    // const originalElementId = elementId;
    const pageIds = pages.map(({ id }) => id);
    // const originalPageIndex = pageIds.indexOf(currentPage.id);

    let segmentedFiles = [];

    await segmentVideo({ resource, segmentTime }, ({ resource: newResource, batchPosition, batchCount }) => {

      const exists = segmentedFiles.find(item => item.batchPosition === batchPosition);
      if (!exists) {
        segmentedFiles.push({ batchPosition, resource: newResource });
      }

      if (!exists && segmentedFiles.length === batchCount) {
        segmentedFiles.sort((a, b) => a.batchPosition - b.batchPosition);
        setIsSegmenting(false);

        // @todo insert pages + elements
        /* 
        deleteElementById({ elementId: originalElementId });  // remove the original element
        addPageAt({
          page: createPage(),
          position: originalPageIndex + processedFiles,
        });
        insertElement(ELEMENT_TYPES.VIDEO, resource);
        */
      }
    });

    showSnackbar({
      message: __('Inserting video segments', 'web-stories'),
      dismissible: false,
    });
  }, [
    elementId,
    deleteElementById,
    pages,
    currentPage,
    addPageAt,
    insertElement,
    segmentVideo,
    segmentTime,
    resource,
    showSnackbar,
  ]);

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
