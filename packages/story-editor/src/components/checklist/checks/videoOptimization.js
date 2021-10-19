/*
 * Copyright 2021 Google LLC
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
import { sprintf, _n, __ } from '@web-stories-wp/i18n';
import { canTranscodeResource } from '@web-stories-wp/media';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useCallback, useMemo, useReducer } from '@web-stories-wp/react';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  Tooltip,
} from '@web-stories-wp/design-system';
import { useLocalMedia, useStory } from '../../../app';
import { MEDIA_VIDEO_DIMENSIONS_THRESHOLD } from '../../../constants';
import { PRIORITY_COPY } from '../constants';
import { LayerThumbnail, Thumbnail, THUMBNAIL_TYPES } from '../../thumbnail';
import {
  CARD_TYPE,
  ChecklistCard,
  DefaultFooterText,
} from '../../checklistCard';
import { filterStoryElements } from '../utils/filterStoryElements';
import { useHighlights } from '../../../app/highlights';
import { StyledVideoOptimizationIcon } from '../../checklistCard/styles';
import { useRegisterCheck } from '../countContext';
import { useIsChecklistMounted } from '../popupMountedContext';

const OptimizeButton = styled(Button)`
  margin-top: 4px;
`;

export function videoElementsNotOptimized(element = {}) {
  if (!element.resource) {
    return false;
  }
  const {
    isTranscoding,
    isOptimized,
    height = 0,
    width = 0,
  } = element.resource;
  if (isTranscoding) {
    return true;
  }

  if (
    element.type !== 'video' ||
    isOptimized ||
    !canTranscodeResource(element.resource)
  ) {
    return false;
  }

  const videoArea = height * width;
  const isLargeVideo =
    videoArea >
    MEDIA_VIDEO_DIMENSIONS_THRESHOLD.WIDTH *
      MEDIA_VIDEO_DIMENSIONS_THRESHOLD.HEIGHT;

  return isLargeVideo;
}

const initialState = {};
const actionTypes = {
  cancelled: 'cancelled',
  uploaded: 'uploaded',
  uploading: 'uploading',
};

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.cancelled:
      return {
        ...state,
        [action.element.resource.id]: actionTypes.cancelled,
      };
    case actionTypes.uploaded:
      return {
        ...state,
        [action.element.resource.id]: actionTypes.uploaded,
      };
    case actionTypes.uploading:
      return {
        ...state,
        [action.element.resource.id]: actionTypes.uploading,
      };
    default:
      throw new Error();
  }
}

export const BulkVideoOptimization = () => {
  const isChecklistMounted = useIsChecklistMounted();
  const [state, dispatch] = useReducer(reducer, initialState);
  const pages = useStory(({ state: storyState }) => storyState?.pages);
  const unoptimizedElements = useMemo(
    () => filterStoryElements(pages, videoElementsNotOptimized),
    [pages]
  );
  const unoptimizedVideos = unoptimizedElements.filter(
    (element, index, array) =>
      array.findIndex(
        (innerElement) => innerElement.resource.id === element.resource.id
      ) === index
  );

  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);

  const { optimizeVideo } = useLocalMedia(({ actions }) => ({
    optimizeVideo: actions.optimizeVideo,
  }));

  const processVideoElement = useCallback(
    async (element) => {
      if (
        canTranscodeResource(element.resource) &&
        state[element.resource.id] !== actionTypes.uploading
      ) {
        dispatch({ type: actionTypes.uploading, element });
        try {
          await optimizeVideo({ resource: element.resource });
        } catch (e) {
          dispatch({ type: actionTypes.cancelled, element });
          return;
        }
        dispatch({ type: actionTypes.uploaded, element });
      }
    },
    [optimizeVideo, state]
  );

  const sequencedVideoOptimization = useCallback(() => {
    // only attempt to optimize videos that are not currently being transcoded
    const optimizingResources = unoptimizedVideos.filter(
      ({ resource }) => !resource?.isTranscoding
    );
    return new Promise((resolve) => {
      optimizingResources
        .map((element) => async () => {
          await processVideoElement(element);
        })
        .reduce((p, fn) => p.then(fn), Promise.resolve())
        .then(resolve);
    });
  }, [processVideoElement, unoptimizedVideos]);

  const handleUpdateVideos = useCallback(async () => {
    await sequencedVideoOptimization();
  }, [sequencedVideoOptimization]);

  const handleClickThumbnail = useCallback(
    (element) => async () => {
      setHighlights({
        pageId: element.pageId,
        elementId: element.id,
      });
      await processVideoElement(element);
    },
    [processVideoElement, setHighlights]
  );

  const { footer, title } = PRIORITY_COPY.videoNotOptimized;

  const currentlyUploading = useMemo(
    () =>
      Object.values(state).filter((value) => value === actionTypes.uploading),
    [state]
  );
  const isTranscoding = useMemo(
    () =>
      currentlyUploading.length > 0 ||
      unoptimizedVideos.some((video) => video.resource?.isTranscoding),
    [currentlyUploading, unoptimizedVideos]
  );

  const isRendered = unoptimizedVideos.length > 0;
  useRegisterCheck('VideoOptimization', isRendered);

  let optimizeButtonCopy =
    unoptimizedVideos.length === 1
      ? __('Optimize video', 'web-stories')
      : __('Optimize all videos', 'web-stories');

  if (isTranscoding) {
    const numTranscoding =
      currentlyUploading.length +
      unoptimizedVideos.filter((video) => video.resource?.isTranscoding).length;
    optimizeButtonCopy = sprintf(
      /* translators: 1: number of videos currently transcoding. 2: total number of videos in list. */
      _n(
        'Optimizing %1$d of %2$d',
        'Optimizing %1$d of %2$d',
        numTranscoding,
        'web-stories'
      ),
      numTranscoding,
      unoptimizedVideos.length
    );
  }

  return (
    isRendered &&
    isChecklistMounted && (
      <ChecklistCard
        cta={
          <OptimizeButton
            type={BUTTON_TYPES.SECONDARY}
            size={BUTTON_SIZES.SMALL}
            onClick={handleUpdateVideos}
            disabled={isTranscoding}
          >
            {optimizeButtonCopy}
          </OptimizeButton>
        }
        title={title}
        cardType={
          unoptimizedVideos.length > 1
            ? CARD_TYPE.MULTIPLE_ISSUE
            : CARD_TYPE.SINGLE_ISSUE
        }
        footer={<DefaultFooterText>{footer}</DefaultFooterText>}
        thumbnailCount={unoptimizedVideos.length}
        thumbnail={unoptimizedVideos.map((element) => (
          <Thumbnail
            key={element.resource.id}
            onClick={handleClickThumbnail(element)}
            isLoading={element.resource.isTranscoding}
            type={THUMBNAIL_TYPES.VIDEO}
            displayBackground={<LayerThumbnail page={element} />}
            aria-label={__('Go to offending video', 'web-stories')}
            isError={state[element.resource.id] === actionTypes.cancelled}
          >
            {
              <Tooltip
                title={
                  state[element.resource.id] === actionTypes.uploading ||
                  element.resource.isTranscoding
                    ? __('Video optimization in progress', 'web-stories')
                    : __('Optimize', 'web-stories')
                }
              >
                <StyledVideoOptimizationIcon />
              </Tooltip>
            }
          </Thumbnail>
        ))}
      />
    )
  );
};

export default BulkVideoOptimization;
