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
import { _n, __ } from '@web-stories-wp/i18n';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useCallback, useMemo, useRef } from 'react';
import { useFeature } from 'flagged';
import { useLocalMedia, useStory } from '../../../app';
import { VIDEO_SIZE_THRESHOLD } from '../../../app/media/utils/useFFmpeg';
import { PRIORITY_COPY } from '../constants';
import { LayerThumbnail, Thumbnail, THUMBNAIL_TYPES } from '../../thumbnail';
import {
  CARD_TYPE,
  ChecklistCard,
  DefaultFooterText,
} from '../../checklistCard';
import { filterStoryElements } from '../utils/filterStoryElements';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  Tooltip,
} from '../../../../design-system';
import { useHighlights } from '../../../app/highlights';
import { useRegisterCheck } from '../checkCountContext';
import { StyledVideoOptimizationIcon } from '../../checklistCard/styles';

const OptimizeButton = styled(Button)`
  margin-top: 4px;
`;

export function isVideoElementOptimized(element = {}) {
  if (element.resource?.isTranscoding) {
    return true;
  }

  if (
    element.type !== 'video' ||
    element.resource?.local ||
    element.resource?.isOptimized
  ) {
    return false;
  }

  const videoArea =
    (element.resource?.height ?? 0) * (element.resource?.width ?? 0);
  const isLargeVideo =
    videoArea >= VIDEO_SIZE_THRESHOLD.WIDTH * VIDEO_SIZE_THRESHOLD.HEIGHT;
  return isLargeVideo;
}

export const BulkVideoOptimization = () => {
  const enableBulkVideoOptimization = useFeature('enableBulkVideoOptimization');

  const story = useStory(({ state }) => state);
  const optimizingResourcesRef = useRef({});
  const unoptimizedVideos = filterStoryElements(story, isVideoElementOptimized);

  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);

  const { optimizeVideo } = useLocalMedia((state) => ({
    optimizeVideo: state.actions.optimizeVideo,
  }));

  const sequencedVideoOptimization = useCallback(() => {
    // only attempt to optimize videos that are not currently being transcoded
    const optimizingResources = unoptimizedVideos.filter(
      ({ resource }) => !resource?.isTranscoding
    );
    return new Promise((res) => {
      optimizingResources
        .map(({ resource }) => async () => {
          await optimizeVideo({ resource }).finally(() => {
            optimizingResourcesRef.current[resource.id] = 'UPLOADED';
          });
        })
        .reduce((p, fn) => p.then(fn), Promise.resolve())
        .then(() => {
          res();
        });
    });
  }, [unoptimizedVideos, optimizeVideo]);

  const handleUpdateVideos = useCallback(async () => {
    unoptimizedVideos.forEach(({ resource }) => {
      if (!resource.isTranscoding) {
        optimizingResourcesRef.current[resource.id] = 'UPLOADING';
      }
    });
    await sequencedVideoOptimization();
  }, [sequencedVideoOptimization, unoptimizedVideos]);

  const handleClickThumbnail = useCallback(
    (element) => async () => {
      setHighlights({
        pageId: element.pageId,
        elementId: element.id,
      });
      if (
        !element.resource?.isTranscoding &&
        !['UPLOADING'].includes(
          optimizingResourcesRef.current[element.resource.id]
        )
      ) {
        optimizingResourcesRef.current[element.resource.id] = 'UPLOADING';
        await optimizeVideo({ resource: element.resource }).finally(() => {
          optimizingResourcesRef.current[element.resource.id] = 'UPLOADED';
        });
      }
    },
    [optimizeVideo, setHighlights]
  );

  const { footer, title } = PRIORITY_COPY.videoNotOptimized;

  const isTranscoding = useMemo(
    () =>
      Object.values(optimizingResourcesRef.current).includes('UPLOADING') ||
      unoptimizedVideos.some((video) => video.resource?.isTranscoding),
    [unoptimizedVideos]
  );

  const isRendered = unoptimizedVideos.length > 0;
  useRegisterCheck('VideoOptimization', isRendered);

  return (
    isRendered && (
      <ChecklistCard
        cta={
          (enableBulkVideoOptimization || unoptimizedVideos.length === 1) && (
            <OptimizeButton
              type={BUTTON_TYPES.SECONDARY}
              size={BUTTON_SIZES.SMALL}
              onClick={handleUpdateVideos}
              disabled={isTranscoding}
            >
              {/* todo copy should count the number of videos */}
              {isTranscoding
                ? _n(
                    'Optimizing video',
                    'Optimizing videos',
                    unoptimizedVideos.length,
                    'web-stories'
                  )
                : _n(
                    'Optimize video',
                    'Optimize all videos',
                    unoptimizedVideos.length,
                    'web-stories'
                  )}
            </OptimizeButton>
          )
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
            key={element.id}
            onClick={handleClickThumbnail(element)}
            isLoading={element.resource?.isTranscoding}
            type={THUMBNAIL_TYPES.VIDEO}
            displayBackground={<LayerThumbnail page={element} />}
            aria-label={__('Go to offending video', 'web-stories')}
          >
            <Tooltip
              title={
                ['UPLOADING'].includes(
                  optimizingResourcesRef.current[element.resource?.id]
                ) || element.resource?.isTranscoding
                  ? __('Video optimization in progress', 'web-stories')
                  : __('Optimize', 'web-stories')
              }
            >
              <StyledVideoOptimizationIcon />
            </Tooltip>
          </Thumbnail>
        ))}
      />
    )
  );
};

export default BulkVideoOptimization;
