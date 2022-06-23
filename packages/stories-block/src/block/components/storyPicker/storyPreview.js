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
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { dateI18n, __experimentalGetSettings } from '@wordpress/date';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ItemOverlay from './itemOverlay';

const noop = () => {};

function StoryPreview({
  story,
  isSelected,
  addSelectedStory = noop,
  removeSelectedStory = noop,
}) {
  // @todo Keep an eye on this experimental API, make necessary changes when this gets updated in core.
  const dateFormat = __experimentalGetSettings().formats.date;
  const displayDate = dateI18n(dateFormat, story.created);
  const displayDateText = useMemo(() => {
    if (!displayDate) {
      return null;
    }

    switch (story.status) {
      case 'publish':
        return sprintf(
          /* translators: %s: published date */
          __('Published %s', 'web-stories'),
          displayDate
        );

      case 'future':
        return sprintf(
          /* translators: %s: future publish date */
          __('Scheduled %s', 'web-stories'),
          displayDate
        );

      default:
        return sprintf(
          /* translators: %s: last modified date */
          __('Modified %s', 'web-stories'),
          displayDate
        );
    }
  }, [story.status, displayDate]);

  const poster = story.meta['web_stories_poster'];
  const featuredmedia = story._embedded?.['wp:featuredmedia']?.[0];

  const posterImage = poster?.url ? poster.url : featuredmedia?.source_url;

  return (
    <div className="web-stories-story-preview-card">
      <div className="web-stories-story-preview-card__poster">
        <ItemOverlay
          isSelected={isSelected}
          story={story}
          addSelectedStory={addSelectedStory}
          removeSelectedStory={removeSelectedStory}
        />
        {posterImage && (
          <img src={posterImage} alt="" width={640} height={853} />
        )}
      </div>
      <div className="web-stories-story-preview-card__label">
        <div className="web-stories-story-preview-card__title">
          {story.title.rendered === ''
            ? __('Untitled', 'web-stories')
            : story.title.rendered}
        </div>
        {story._embedded?.author?.[0]?.name && (
          <div>{story._embedded?.author?.[0]?.name}</div>
        )}
        <div>{displayDateText}</div>
      </div>
    </div>
  );
}

StoryPreview.propTypes = {
  story: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  addSelectedStory: PropTypes.func,
  removeSelectedStory: PropTypes.func,
};

export default StoryPreview;
