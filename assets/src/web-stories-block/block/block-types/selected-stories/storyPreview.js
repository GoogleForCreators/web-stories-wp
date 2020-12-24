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
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { CardPreviewContainer } from '../../../../dashboard/components';
import { StoryPropType, PageSizePropType } from '../../../../dashboard/types';

const StoryPreviewCover = styled.div(
  ({ coverImage, pageSize, theme }) => `
  background-image: url(${coverImage});
  position: relative;
  height: ${pageSize.containerHeight}px;
  width: 100%;
  overflow: hidden;
  z-index: -1;
  background-size: cover;
  background-position: center;
  border-radius: ${theme.DEPRECATED_THEME.storyPreview.borderRadius}px;
  border: ${theme.DEPRECATED_THEME.borders.gray75};
`
);

function StoryPreview({ story, pageSize }) {
  return story.originalStoryData.featured_media_url ? (
    <StoryPreviewCover
      ariaLabel={sprintf(
        /* translators: %s: story title. */
        __('preview of %s', 'web-stories'),
        story.title
      )}
      coverImage={story.originalStoryData.featured_media_url}
      pageSize={pageSize}
    />
  ) : (
    <CardPreviewContainer
      ariaLabel={sprintf(
        /* translators: %s: story title. */
        __('preview of %s', 'web-stories'),
        story.title
      )}
      pageSize={pageSize}
      story={story}
    />
  );
}

StoryPreview.propTypes = {
  story: StoryPropType,
  pageSize: PageSizePropType,
};

export default StoryPreview;
