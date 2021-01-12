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
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { dateI18n, format, __experimentalGetSettings } from '@wordpress/date';

function StoryCard({
  title,
  excerpt,
  poster,
  author,
  date,
  isShowingAuthor,
  isShowingDate,
  isShowingTitle,
  isShowingExcerpt,
  imageOnRight,
}) {
  const singleStoryClasses = classNames('web-stories-list__story-wrapper');
  const imageAlignmentClass = classNames('web-stories-list__inner-wrapper', {
    [`image-align-right`]: imageOnRight,
    [`image-align-left`]: !imageOnRight,
  });
  const hasContentOverlay = isShowingTitle || isShowingAuthor || isShowingDate;
  const dateFormat = __experimentalGetSettings().formats.date;

  return (
    <div className={singleStoryClasses}>
      <div className={imageAlignmentClass}>
        <div
          className="web-stories-list__story-placeholder"
          style={{
            backgroundImage: poster ? `url('${poster}')` : undefined,
          }}
        />
        {hasContentOverlay && (
          <div className="story-content-overlay web-stories-list__story-content-overlay">
            {isShowingTitle && title && (
              <RawHTML className="story-content-overlay__title">
                {title}
              </RawHTML>
            )}
            {isShowingExcerpt && excerpt && (
              <RawHTML className="story-content-overlay__excerpt">
                {excerpt}
              </RawHTML>
            )}
            {isShowingAuthor && (
              <div className="story-content-overlay__author">
                {sprintf(
                  /* translators: byline. %s: current author. */
                  __('by %s', 'web-stories'),
                  author
                )}
              </div>
            )}
            {isShowingDate && (
              <time
                dateTime={format('c', date)}
                className="story-content-overlay__date"
              >
                {sprintf(
                  /* translators: date. %s: published date. */
                  __('On %s', 'web-stories'),
                  dateI18n(dateFormat, date)
                )}
              </time>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

StoryCard.propTypes = {
  title: PropTypes.string,
  excerpt: PropTypes.string,
  poster: PropTypes.string,
  author: PropTypes.string,
  date: PropTypes.string,
  isShowingAuthor: PropTypes.bool,
  isShowingDate: PropTypes.bool,
  isShowingTitle: PropTypes.bool,
  isShowingExcerpt: PropTypes.bool,
  imageOnRight: PropTypes.bool,
};

export default StoryCard;
