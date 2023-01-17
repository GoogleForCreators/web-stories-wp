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
import classNames from 'classnames';
import Glider from '@web-stories-wp/glider';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
  CAROUSEL_VIEW_TYPE,
  CIRCLES_VIEW_TYPE,
  GRID_VIEW_TYPE,
} from '../constants';
import StoryCard from './storyCard';

const {
  config: { archiveURL },
} = window.webStoriesBlockSettings;

function StoriesPreview(props) {
  const {
    attributes: {
      align,
      viewType,
      circleSize,
      imageAlignment,
      fieldState,
      numOfColumns,
    },
    viewAllLabel,
    stories,
  } = props;

  const carouselContainer = useRef(null);
  const carouselNext = useRef(null);
  const carouselPrev = useRef(null);

  const blockClasses = classNames(
    {
      'is-style-default': !fieldState['show_sharp_corners'],
      'is-style-squared': fieldState['show_sharp_corners'],
      'is-carousel':
        CIRCLES_VIEW_TYPE === viewType || CAROUSEL_VIEW_TYPE === viewType,
      [`is-view-type-${viewType}`]: viewType,
      [`columns-${numOfColumns}`]: GRID_VIEW_TYPE === viewType && numOfColumns,
      [`align${align}`]: align,
      'has-archive-link': fieldState['show_archive_link'],
    },
    'web-stories-list'
  );

  const StoriesLoop = () =>
    stories.map((story) => {
      const externalPoster = story.meta['web_stories_poster']?.url;
      const featuredImage =
        story._embedded?.['wp:featuredmedia']?.[0]?.source_url;
      const posterImage = externalPoster || featuredImage;
      return (
        <StoryCard
          key={story.id}
          url={story.link}
          title={story.title.rendered}
          excerpt={story.excerpt.rendered ? story.excerpt.rendered : ''}
          date={story.date_gmt}
          author={story._embedded.author[0].name}
          poster={posterImage}
          imageAlignment={imageAlignment}
          isShowingAuthor={fieldState['show_author']}
          isShowingDate={fieldState['show_date']}
          isShowingTitle={fieldState['show_title']}
          isShowingExcerpt={fieldState['show_excerpt']}
          circleSize={circleSize}
        />
      );
    });

  useEffect(() => {
    if (!carouselContainer.current) {
      return;
    }

    const storyItem = carouselContainer.current.querySelector(
      '.web-stories-list__story'
    );

    if (!storyItem) {
      return;
    }

    const itemStyle = window.getComputedStyle(storyItem);
    const itemWidth =
      parseFloat(itemStyle.width) +
      (parseFloat(itemStyle.marginLeft) + parseFloat(itemStyle.marginRight));

    const instance = new Glider(carouselContainer.current, {
      slidesToShow: 'auto',
      slidesToScroll: 'auto',
      itemWidth,
      duration: 0.25,
      skipTrack: true,
      scrollLock: true,
      arrows: {
        prev: carouselPrev.current,
        next: carouselNext.current,
      },
    });

    // Force resize to ensure Glider.js has the correct clientWidth for the carouselContainer.
    instance.resize();

    // Force correct trackWidth, especially when switching view types.
    const trackWidth = itemWidth * stories.length;
    instance.trackWidth = trackWidth;
    instance.track.style.width = `${trackWidth}px`;
  }, [stories.length, viewType, circleSize]);

  return (
    <div
      className={blockClasses}
      style={{
        '--ws-circle-size':
          'circles' === viewType && circleSize ? `${circleSize}px` : undefined,
      }}
    >
      <div className="web-stories-list__inner-wrapper">
        {CIRCLES_VIEW_TYPE === viewType || CAROUSEL_VIEW_TYPE === viewType ? (
          <>
            <div className="web-stories-list__carousel" ref={carouselContainer}>
              <div className="glider-track">
                <StoriesLoop />
              </div>
            </div>
            <div
              aria-label={__('Previous', 'web-stories')}
              className="glider-prev"
              ref={carouselPrev}
            />
            <div
              aria-label={__('Next', 'web-stories')}
              className="glider-next"
              ref={carouselNext}
            />
          </>
        ) : (
          <StoriesLoop />
        )}
      </div>
      {fieldState['show_archive_link'] && archiveURL && (
        <div className="web-stories-list__archive-link">
          <a target="__blank" href={archiveURL}>
            {viewAllLabel}
          </a>
        </div>
      )}
    </div>
  );
}

StoriesPreview.propTypes = {
  attributes: PropTypes.shape({
    align: PropTypes.string,
    viewType: PropTypes.string,
    numOfColumns: PropTypes.number,
    circleSize: PropTypes.number,
    fieldState: PropTypes.object,
    imageAlignment: PropTypes.string,
  }),
  stories: PropTypes.array,
  viewAllLabel: PropTypes.string,
};

export default StoriesPreview;
