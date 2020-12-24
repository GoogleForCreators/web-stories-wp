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
 * Internal dependencies
 */
import { GRID_VIEW_TYPE } from '../constants';
import { isShowing } from '../util';
import StoryCard from './storyCard';

function StoriesPreview(props) {
  const {
    attributes: { align, viewType, sizeOfCircles, fieldState, numOfColumns },
    viewAllLabel,
    stories,
  } = props;

  const alignmentClass = classNames({ [`align${align}`]: align });
  const blockClasses = classNames(
    {
      'is-style-default': !isShowing('sharp_corners', fieldState[viewType]),
      'is-style-squared': isShowing('sharp_corners', fieldState[viewType]),
    },
    'web-stories-list',
    { [`is-view-type-${viewType}`]: viewType },
    { [`columns-${numOfColumns}`]: GRID_VIEW_TYPE === viewType && numOfColumns }
  );

  return (
    <div className={alignmentClass}>
      <div
        className={blockClasses}
        style={{
          gridTemplateColumns: `repeat(${numOfColumns}, 1fr)`,
        }}
      >
        {stories.map((story) => {
          return (
            <StoryCard
              key={story.id}
              url={story.link}
              title={story.title.rendered}
              excerpt={story.excerpt.rendered ? story.excerpt.rendered : ''}
              date={story.date_gmt}
              author={story._embedded.author[0].name}
              poster={story.featured_media_url}
              imageOnRight={isShowing('image_align', fieldState[viewType])}
              isShowingAuthor={isShowing('author', fieldState[viewType])}
              isShowingDate={isShowing('date', fieldState[viewType])}
              isShowingTitle={isShowing('title', fieldState[viewType])}
              isShowingExcerpt={isShowing('excerpt', fieldState[viewType])}
              sizeOfCircles={sizeOfCircles}
            />
          );
        })}
      </div>
      {isShowing('archive_link', fieldState[viewType]) &&
        'circles' !== viewType &&
        'carousel' !== viewType && (
          <div className="web-stories-list__archive-link">{viewAllLabel}</div>
        )}
    </div>
  );
}

StoriesPreview.propTypes = {
  attributes: PropTypes.shape({
    align: PropTypes.string,
    viewType: PropTypes.string,
    numOfColumns: PropTypes.number,
    sizeOfCircles: PropTypes.number,
    fieldState: PropTypes.object,
  }),
  stories: PropTypes.array,
  viewAllLabel: PropTypes.string,
};

export default StoriesPreview;
