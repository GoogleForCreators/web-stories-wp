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
import { __, sprintf, _n, TranslateWithMarkup } from '@web-stories-wp/i18n';
import { trackClick } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { Link, THEME_CONSTANTS } from '../../../design-system';

export const MIN_STORY_PAGES = 4;
export const MAX_STORY_PAGES = 30;
export const MAX_STORY_TITLE_LENGTH_WORDS = 10;
export const MAX_STORY_TITLE_LENGTH_CHARS = 40;
const POSTER_DIMENSION_WIDTH_PX = 640;
const POSTER_DIMENSION_HEIGHT_PX = 853;
export const ASPECT_RATIO_LEFT = 3;
export const ASPECT_RATIO_RIGHT = 4;
const PUBLISHER_LOGO_DIMENSION = 96;
const PUBLISHER_LOGO_RATIO = 1;
const MIN_FONT_SIZE = 12;
const IMAGE_SIZE_WIDTH = 828;
const IMAGE_SIZE_HEIGHT = 1792;
const MIN_STORY_CHARACTERS = 100;
const MAX_STORY_CHARACTERS = 200;
const MAX_CHARACTER_PERCENTAGE = 10;
const MIN_VIDEO_RESOLUTION = 480;
const MIN_VIDEO_FPS = 24;
const MAX_VIDEO_RESOLUTION = 4000;
const MAX_VIDEO_LENGTH_SECONDS = 60;
const MAX_VIDEO_LENGTH_MINUTES = Math.floor(MAX_VIDEO_LENGTH_SECONDS / 60);
const MIN_TAP_REGION_WIDTH = 48;
const MAX_LINKS_PER_PAGE = 3;

export const PRE_PUBLISH_MESSAGE_TYPES = {
  GUIDANCE: 'guidance',
  ERROR: 'error',
  WARNING: 'warning',
};

const VIDEO_DOCUMENTATION_URL = __(
  'https://amp.dev/documentation/guides-and-tutorials/start/create_successful_stories/#visual-treat',
  'web-stories'
);

export const MESSAGES = {
  CRITICAL_METADATA: {
    MISSING_TITLE: {
      MAIN_TEXT: __('Add Web Story title', 'web-stories'),
      HELPER_TEXT: (
        <ul>
          <li>
            {sprintf(
              /* translators: %d: maximum story title length in words. */
              _n(
                'Keep under %d word',
                'Keep under %d words',
                MAX_STORY_TITLE_LENGTH_WORDS,
                'web-stories'
              ),
              MAX_STORY_TITLE_LENGTH_WORDS
            )}
          </li>
          <li>
            {sprintf(
              /* translators: %d: maximum story title length in characters. */
              _n(
                "Don't exceed %d character",
                "Don't exceed %d characters",
                MAX_STORY_TITLE_LENGTH_CHARS,
                'web-stories'
              ),
              MAX_STORY_TITLE_LENGTH_CHARS
            )}
          </li>
        </ul>
      ),
    },
    MISSING_POSTER: {
      MAIN_TEXT: __('Add poster image', 'web-stories'),
      HELPER_TEXT: (
        <ul>
          <li>{__('Use as a representation of the story', 'web-stories')}</li>
          <li>{__('Avoid images with embedded text', 'web-stories')}</li>
          <li>
            {sprintf(
              /* translators: %s: image dimensions.  */
              __("Use an image that's at least %s", 'web-stories'),
              `${POSTER_DIMENSION_WIDTH_PX}x${POSTER_DIMENSION_HEIGHT_PX}px`
            )}
          </li>
          <li>
            {sprintf(
              /* translators: %s: aspect ratio.  */
              __('Maintain a %s aspect ratio', 'web-stories'),
              `${ASPECT_RATIO_LEFT}:${ASPECT_RATIO_RIGHT}`
            )}
          </li>
        </ul>
      ),
    },
    POSTER_TOO_SMALL: {
      MAIN_TEXT: sprintf(
        /* translators: %s: image dimensions.  */
        __('Increase poster image size to at least %s', 'web-stories'),
        `${POSTER_DIMENSION_WIDTH_PX}x${POSTER_DIMENSION_HEIGHT_PX}px`
      ),
      HELPER_TEXT: (
        <ul>
          <li>
            {sprintf(
              /* translators: %s: image dimensions.  */
              __("Use an image that's at least %s", 'web-stories'),
              `${POSTER_DIMENSION_WIDTH_PX}x${POSTER_DIMENSION_HEIGHT_PX}px`
            )}
          </li>
          <li>
            {sprintf(
              /* translators: %s: aspect ratio.  */
              __('Maintain a %s aspect ratio', 'web-stories'),
              `${ASPECT_RATIO_LEFT}:${ASPECT_RATIO_RIGHT}`
            )}
          </li>
        </ul>
      ),
    },
    POSTER_WRONG_ASPECT_RATIO: {
      MAIN_TEXT: sprintf(
        /* translators: %s: image dimensions.  */
        __('Correct poster image aspect ratio to %s', 'web-stories'),
        `${POSTER_DIMENSION_WIDTH_PX}x${POSTER_DIMENSION_HEIGHT_PX}px`
      ),
      HELPER_TEXT: (
        <ul>
          <li>
            {sprintf(
              /* translators: %s: image dimensions.  */
              __("Use an image that's at least %s", 'web-stories'),
              `${POSTER_DIMENSION_WIDTH_PX}x${POSTER_DIMENSION_HEIGHT_PX}px`
            )}
          </li>
          <li>
            {sprintf(
              /* translators: %s: aspect ratio.  */
              __('Maintain a %s aspect ratio', 'web-stories'),
              `${ASPECT_RATIO_LEFT}:${ASPECT_RATIO_RIGHT}`
            )}
          </li>
        </ul>
      ),
    },
    LOGO_TOO_SMALL: {
      MAIN_TEXT: sprintf(
        /* translators: %s: image dimensions. */
        __('Increase size of publisher logo to at least %s', 'web-stories'),
        `${PUBLISHER_LOGO_DIMENSION}x${PUBLISHER_LOGO_DIMENSION}px`
      ),
      HELPER_TEXT: (
        <ul>
          <li>
            {sprintf(
              /* translators: %s: image dimensions. */
              __("Use an image that's at least %s", 'web-stories'),
              `${PUBLISHER_LOGO_DIMENSION}x${PUBLISHER_LOGO_DIMENSION}px`
            )}
          </li>
          <li>
            {sprintf(
              /* translators: %s: aspect ratio.  */
              __('Maintain a %s aspect ratio', 'web-stories'),
              `${PUBLISHER_LOGO_RATIO}x${PUBLISHER_LOGO_RATIO}px`
            )}
          </li>
        </ul>
      ),
    },
    MISSING_VIDEO_POSTER: {
      MAIN_TEXT: __('Add poster image to every video', 'web-stories'),
      HELPER_TEXT: (
        <ul>
          <li>
            {__(
              'Ensure a better experience by displaying a poster while users wait for the video to load',
              'web-stories'
            )}
          </li>
        </ul>
      ),
    },
  },
  ACCESSIBILITY: {
    LOW_CONTRAST: {
      MAIN_TEXT: __(
        'Increase contrast between text and background color',
        'web-stories'
      ),
      HELPER_TEXT: (
        <ul>
          <li>
            {__(
              'Ensure legibility of text and ease of reading by increasing color contrast',
              'web-stories'
            )}
          </li>
        </ul>
      ),
    },
    FONT_TOO_SMALL: {
      MAIN_TEXT: sprintf(
        /* translators: %d: minimum font size. */
        __('Increase font size to %s or above', 'web-stories'),
        MIN_FONT_SIZE
      ),
      HELPER_TEXT: (
        <ul>
          <li>
            {sprintf(
              /* translators: %d: minimum font size. */
              __(
                'Ensure legibility by selecting text size %d or greater',
                'web-stories'
              ),
              MIN_FONT_SIZE
            )}
          </li>
        </ul>
      ),
    },
    LOW_IMAGE_RESOLUTION: {
      MAIN_TEXT: sprintf(
        /* translators: %s: minimum image size width x minimum image size height. */
        __(
          'Upload a higher resolution poster image to at least %s',
          'web-stories'
        ),
        `${IMAGE_SIZE_WIDTH}x${IMAGE_SIZE_HEIGHT}px`
      ),
      HELPER_TEXT: (
        <ul>
          <li>
            {sprintf(
              /* translators: %s: minimum image size width x minimum image size height. */
              __('Use %s for a full-screen image', 'web-stories'),
              `${IMAGE_SIZE_WIDTH}x${IMAGE_SIZE_HEIGHT}px`
            )}
          </li>
          <li>
            {__(
              'Consider similar pixel density for cropped images',
              'web-stories'
            )}
          </li>
        </ul>
      ),
    },
    MISSING_CAPTIONS: {
      MAIN_TEXT: __('Add video captions', 'web-stories'),
      HELPER_TEXT: (
        <ul>
          <li>
            {__(
              "Keep the audience engaged even when they can't listen to the audio",
              'web-stories'
            )}
          </li>
        </ul>
      ),
    },
    MISSING_VIDEO_DESCRIPTION: {
      MAIN_TEXT: __('Add video description', 'web-stories'),
      HELPER_TEXT: (
        <ul>
          <li>
            {__(
              'Improves indexability and accessibility (for videos without captions)',
              'web-stories'
            )}
          </li>
          <li>
            {__(
              'Include any text or captions that are already a rendered part of the video',
              'web-stories'
            )}
          </li>
        </ul>
      ),
    },
    TOO_MANY_LINKS: {
      MAIN_TEXT: sprintf(
        /* translators: %s: maximum number of links per page. */
        __('Avoid including more than %s links per page', 'web-stories'),
        MAX_LINKS_PER_PAGE
      ),
      HELPER_TEXT: (
        <ul>
          <li>
            {sprintf(
              /* translators: %s: maximum number of links per page. */
              __('Avoid having more than %s links on one page', 'web-stories'),
              MAX_LINKS_PER_PAGE
            )}
          </li>
        </ul>
      ),
    },
    LINK_REGION_TOO_SMALL: {
      MAIN_TEXT: sprintf(
        /* translators: %s: minimum tappable region size width x minimum tappable region size height. */
        __('Increase tap area size to at least %s', 'web-stories'),
        `${MIN_TAP_REGION_WIDTH}x${MIN_TAP_REGION_WIDTH}px`
      ),
      HELPER_TEXT: (
        <ul>
          <li>
            {__(
              'Make the linked element large enough for users to easily tap it',
              'web-stories'
            )}
          </li>
        </ul>
      ),
    },
    MISSING_IMAGE_ALT_TEXT: {
      MAIN_TEXT: __('Add assistive text to images', 'web-stories'),
      HELPER_TEXT: (
        <ul>
          <li>
            {__(
              'Optimize accessibility and indexability with meaningful text to better assist users',
              'web-stories'
            )}
          </li>
        </ul>
      ),
    },
  },
  DISTRIBUTION: {
    MISSING_DESCRIPTION: {
      MAIN_TEXT: __('Add Web Story description', 'web-stories'),
      HELPER_TEXT: (
        <ul>
          <li>
            {__(
              'Incorporate a brief description for better user experience',
              'web-stories'
            )}
          </li>
        </ul>
      ),
    },
  },
  GENERAL_GUIDELINES: {
    STORY_TOO_SHORT: {
      MAIN_TEXT: sprintf(
        /* translators: %d: maximum number of pages. */
        _n(
          'Make Web Story at least %d page',
          'Make Web Story at least %d pages',
          MIN_STORY_PAGES,
          'web-stories'
        ),
        MIN_STORY_PAGES
      ),
      HELPER_TEXT: (
        <ul>
          <li>
            {sprintf(
              /* translators: 1: minimum number of pages. 2: maximum number of pages. */
              __(
                'It is recommended to have between %1$d and %2$d pages in your story',
                'web-stories'
              ),
              MIN_STORY_PAGES,
              MAX_STORY_PAGES
            )}
          </li>
        </ul>
      ),
    },
    STORY_TOO_LONG: {
      MAIN_TEXT: sprintf(
        /* translators: %d: minimum number of pages. */
        _n(
          'Make Web Story fewer than %d page',
          'Make Web Story fewer than %d pages',
          MAX_STORY_PAGES,
          'web-stories'
        ),
        MAX_STORY_PAGES
      ),
      HELPER_TEXT: (
        <ul>
          <li>
            {sprintf(
              /* translators: 1: minimum number of pages. 2: maximum number of pages. */
              __(
                'It is recommended to have between %1$d and %2$d pages in your story',
                'web-stories'
              ),
              MIN_STORY_PAGES,
              MAX_STORY_PAGES
            )}
          </li>
        </ul>
      ),
    },
    STORY_TITLE_TOO_LONG: {
      MAIN_TEXT: sprintf(
        /* translators: %d: minimum number of story characters. */
        _n(
          'Shorten title to fewer than %d character',
          'Shorten title to fewer than %d characters',
          MAX_STORY_TITLE_LENGTH_CHARS,
          'web-stories'
        ),
        MAX_STORY_TITLE_LENGTH_CHARS
      ),
      HELPER_TEXT: (
        <ul>
          <li>
            {sprintf(
              /* translators: %d: maximum number of story characters. */
              _n(
                'Limit story title to %d character or less',
                'Limit story title to %d characters or less',
                MAX_STORY_TITLE_LENGTH_CHARS,
                'web-stories'
              ),
              MAX_STORY_TITLE_LENGTH_CHARS
            )}
          </li>
        </ul>
      ),
    },
  },
  TEXT: {
    TOO_MUCH_PAGE_TEXT: {
      MAIN_TEXT: __('Reduce text amount on page', 'web-stories'),
      // eslint-disable eslint/no-useless-escape
      HELPER_TEXT: (
        <ul>
          <li>
            {sprintf(
              /* translators: %d: maximum number of story characters. */
              _n(
                'Include no more than %d character',
                'Include no more than %d characters',
                MAX_STORY_CHARACTERS,
                'web-stories'
              ),
              MAX_STORY_CHARACTERS
            )}
          </li>
          <li>
            {__(
              'Use a page attachment breaking up the text into multiple screens; or',
              'web-stories'
            )}
          </li>
          <li>
            {sprintf(
              /* translators: %s: maximum percentage of characters, depending on number of pages. */
              __(
                'Keep the total number of text-heavy pages under %s of total number of story pages',
                'web-stories'
              ),
              MAX_CHARACTER_PERCENTAGE + '%'
            )}
          </li>
        </ul>
      ),
    },
    TOO_LITTLE_TEXT: {
      MAIN_TEXT: __('Add more text to page', 'web-stories'),
      HELPER_TEXT: (
        <ul>
          <li>
            {sprintf(
              /* translators: %d: minimum number of story characters. */
              _n(
                'Include at least %d character',
                'Include at least %d characters',
                MIN_STORY_CHARACTERS,
                'web-stories'
              ),
              MIN_STORY_CHARACTERS
            )}
          </li>
        </ul>
      ),
    },
  },
  MEDIA: {
    VIDEO_IMAGE_TOO_SMALL_ON_PAGE: {
      MAIN_TEXT: __('Increase video or image size on the page', 'web-stories'),
      HELPER_TEXT: (
        <ul>
          <li>
            <TranslateWithMarkup
              mapping={{
                a: (
                  <Link
                    size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                    rel="noreferrer noopener"
                    target="_blank"
                    onClick={(evt) =>
                      trackClick(evt, 'click_pre_publish_video_docs')
                    }
                    href={VIDEO_DOCUMENTATION_URL}
                  />
                ),
              }}
            >
              {__(
                'Use full screen videos and images whenever possible to create a more immersive experience <a>(more info)</a>',
                'web-stories'
              )}
            </TranslateWithMarkup>
          </li>
        </ul>
      ),
    },
    LOW_IMAGE_RESOLUTION: {
      MAIN_TEXT: __('Choose an image with higher resolution', 'web-stories'),
      HELPER_TEXT: (
        <ul>
          <li>
            {sprintf(
              /* translators: %s: minimum image size width x minimum image size height. */
              __('Use %s for full screen image', 'web-stories'),
              `${IMAGE_SIZE_WIDTH}x${IMAGE_SIZE_HEIGHT}px`
            )}
          </li>
          <li>
            {__(
              'Consider similar pixel density for cropped images',
              'web-stories'
            )}
          </li>
        </ul>
      ),
    },
    VIDEO_TOO_LONG: {
      MAIN_TEXT: sprintf(
        /* translators: %d: maximum video length in minutes. */
        _n(
          'Split videos into segments of %d minute or less',
          'Split videos into segments of %d minutes or less',
          MAX_VIDEO_LENGTH_MINUTES,
          'web-stories'
        ),
        MAX_VIDEO_LENGTH_MINUTES
      ),
      HELPER_TEXT: (
        <ul>
          <li>
            {__('Shorter videos help readers navigate stories', 'web-stories')}
          </li>
        </ul>
      ),
    },
    VIDEO_FRAME_RATE_TOO_LOW: {
      MAIN_TEXT: sprintf(
        /* translators: %d: minimum number of frames per second for video. */
        __('Increase video frame rate to at least %d fps', 'web-stories'),
        MIN_VIDEO_FPS
      ),
      HELPER_TEXT: (
        <ul>
          <li>
            {sprintf(
              /* translators: %d: minimum number of frames per second for video. */
              _n(
                'Ensure your video has a minimum of %d frame per second',
                'Ensure your video has a minimum of %d frames per second',
                MIN_VIDEO_FPS,
                'web-stories'
              ),
              MIN_VIDEO_FPS
            )}
          </li>
        </ul>
      ),
    },
    VIDEO_RESOLUTION_TOO_LOW: {
      MAIN_TEXT: sprintf(
        /* translators: %s: minimum video resolution. */
        __('Increase video resolution to at least %s', 'web-stories'),
        `${MIN_VIDEO_RESOLUTION}p`
      ),
      HELPER_TEXT: (
        <ul>
          <li>
            {sprintf(
              /* translators: %s: minimum video resolution. */
              __(
                'Ensure your videos has a minimum resolution of %s',
                'web-stories'
              ),
              `${MIN_VIDEO_RESOLUTION}p`
            )}
          </li>
        </ul>
      ),
    },
    VIDEO_RESOLUTION_TOO_HIGH: {
      MAIN_TEXT: sprintf(
        /* translators: %s: maximum video resolution. */
        __('Reduce video resolution to less than %s', 'web-stories'),
        `${MAX_VIDEO_RESOLUTION}p`
      ),
      HELPER_TEXT: (
        <ul>
          <li>
            {__(
              "Optimize reach and engagement by accounting for the large number of mobile devices don't support video resolutions larger than 4K",
              'web-stories'
            )}
          </li>
        </ul>
      ),
    },
    VIDEO_NOT_OPTIMIZED: {
      MAIN_TEXT: __('Video not optimized', 'web-stories'),
    },
  },
};
