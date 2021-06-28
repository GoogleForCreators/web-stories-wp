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
import { __ } from '@web-stories-wp/i18n';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useCallback, useMemo, useState } from 'react';
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
import { Button, BUTTON_SIZES, BUTTON_TYPES } from '../../../../design-system';
import { useHighlights } from '../../../app/highlights';
import { useRegisterCheck } from '../checkCountContext';

const OptimizeButton = styled(Button)`
  margin-top: 4px;
  border: ${({ theme }) => `1px solid ${theme.colors.border.defaultNormal}`};
`;

export function videoElementOptimized(element = {}) {
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
  const story = useStory(({ state }) => state);
  const unoptimizedVideos = filterStoryElements(story, videoElementOptimized);

  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);

  const { optimizeVideo } = useLocalMedia((state) => ({
    optimizeVideo: state.actions.optimizeVideo,
  }));

  const [isOptimizing, setIsOptimizing] = useState(false);

  const sequencedVideoOptimization = useCallback(() => {
    return new Promise((res) => {
      unoptimizedVideos
        .filter(({ resource }) => !resource?.isTranscoding)
        .map(({ resource }) => async () => {
          await optimizeVideo({ resource });
        })
        .reduce((p, fn) => p.then(fn), Promise.resolve())
        .then(() => {
          res();
        });
    });
  }, [unoptimizedVideos, optimizeVideo]);

  const handleUpdateVideos = useCallback(async () => {
    setIsOptimizing(true);
    await sequencedVideoOptimization();
    setIsOptimizing(false);
  }, [sequencedVideoOptimization]);

  const { footer, title } = PRIORITY_COPY.videoNotOptimized;

  const isTranscoding = useMemo(
    () =>
      isOptimizing ||
      unoptimizedVideos.some((video) => video.resource?.isTranscoding),
    [isOptimizing, unoptimizedVideos]
  );

  const isRendered = unoptimizedVideos.length > 0;
  useRegisterCheck('VideoOptimization', isRendered);

  return (
    isRendered && (
      <ChecklistCard
        cta={
          <OptimizeButton
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.SMALL}
            onClick={handleUpdateVideos}
            disabled={isTranscoding}
          >
            {isTranscoding
              ? __('Optimizing videos', 'web-stories')
              : __('Optimize all videos', 'web-stories')}
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
        thumbnail={
          <>
            {unoptimizedVideos.map((element) => (
              <Thumbnail
                key={element.id}
                onClick={() => {
                  setHighlights({
                    elementId: element.id,
                  });
                }}
                isLoading={element.resource?.isTranscoding}
                type={THUMBNAIL_TYPES.VIDEO}
                displayBackground={<LayerThumbnail page={element} />}
                aria-label={__('Go to offending video', 'web-stories')}
              />
            ))}
          </>
        }
      />
    )
  );
};

export default BulkVideoOptimization;
