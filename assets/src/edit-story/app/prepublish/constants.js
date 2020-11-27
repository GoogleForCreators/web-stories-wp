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
 * WordPress dependencies
 */
import { __, sprintf, _n } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import { TranslateWithMarkup } from '../../../i18n';

export const MIN_STORY_PAGES = 4;
export const MAX_STORY_PAGES = 30;
export const MAX_STORY_TITLE_LENGTH_WORDS = 10;
export const MAX_STORY_TITLE_LENGTH_CHARS = 40;
const COVER_DIMENSION_WIDTH_PX = 640;
const COVER_DIMENSION_HEIGHT_PX = 853;
const ASPECT_RATIO_LEFT = 3;
const ASPECT_RATIO_RIGHT = 4;
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
const MAX_VIDEO_LENGTH_SECONDS = 60;
const MAX_VIDEO_LENGTH_MINUTES = Math.floor(MAX_VIDEO_LENGTH_SECONDS / 60);

export const PRE_PUBLISH_MESSAGE_TYPES = {
  GUIDANCE: 'guidance',
  ERROR: 'error',
  WARNING: 'warning',
};

export const MESSAGES = {
  CRITICAL_METADATA: {
    MISSING_TITLE: {
      MAIN_TEXT: __('Missing story title', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: 1: minimum story title length in words. 2: maximum story title length in characters. */
        __(
          'Keep the title clear and clean, ideally under %1$d words in less than %2$d characters.',
          'web-stories'
        ),
        MAX_STORY_TITLE_LENGTH_WORDS,
        MAX_STORY_TITLE_LENGTH_CHARS
      ),
    },
    MISSING_COVER: {
      MAIN_TEXT: __('Missing story cover image', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: 1: minimum cover dimension width x minimum cover dimension height. 2: cover dimensions aspect ratio.  */
        __(
          'Used as the cover for the Story and is representative of the story. Should not have the Story title pre-embedded on it or any other burned-in text. Should be at least %1$s in size and maintain a %2$s aspect ratio.',
          'web-stories'
        ),
        `${COVER_DIMENSION_WIDTH_PX}x${COVER_DIMENSION_HEIGHT_PX}px`,
        `${ASPECT_RATIO_LEFT}:${ASPECT_RATIO_RIGHT}`
      ),
    },
    COVER_TOO_SMALL: {
      MAIN_TEXT: __('Story cover image too small', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: 1: minimum cover dimension width X minimum cover dimension height. 2: cover dimensions aspect ratio. */
        __(
          'Should be at least %1$s and maintain a %2$s aspect ratio.',
          'web-stories'
        ),
        `${COVER_DIMENSION_WIDTH_PX}x${COVER_DIMENSION_HEIGHT_PX}px`,
        `${ASPECT_RATIO_LEFT}:${ASPECT_RATIO_RIGHT}`
      ),
    },
    COVER_WRONG_ASPECT_RATIO: {
      MAIN_TEXT: __('Story cover image wrong aspect ratio', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: 1: minimum cover dimension width X minimum cover dimension height. 2: cover dimensions aspect ratio. */
        __(
          'Should be at least %1$s and maintain a %2$s aspect ratio.',
          'web-stories'
        ),
        `${COVER_DIMENSION_WIDTH_PX}x${COVER_DIMENSION_HEIGHT_PX}px`,
        `${ASPECT_RATIO_LEFT}:${ASPECT_RATIO_RIGHT}`
      ),
    },
    LOGO_TOO_SMALL: {
      MAIN_TEXT: __('Publisher logo is too small', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: 1: minimum publisher logo dimensions. 2: publisher logo dimension ratio. */
        __(
          'Should be at least %1$s and maintain a %2$s aspect ratio.',
          'web-stories'
        ),
        `${PUBLISHER_LOGO_DIMENSION}x${PUBLISHER_LOGO_DIMENSION}px`,
        `${PUBLISHER_LOGO_RATIO}x${PUBLISHER_LOGO_RATIO}px`
      ),
    },
    LINK_ATTACHMENT_CONFLICT: {
      MAIN_TEXT: __('Link conflict with page attachment', 'web-stories'),
      HELPER_TEXT: __(
        'Links in the bottom of a page with a Page Attachment are disabled.',
        'web-stories'
      ),
    },
    MISSING_VIDEO_POSTER: {
      MAIN_TEXT: __('Video missing poster image', 'web-stories'),
      HELPER_TEXT: __(
        'Add a poster image for every video. Posters are displayed while a video loads for a better user experience.',
        'web-stories'
      ),
    },
  },
  ACCESSIBILITY: {
    LOW_CONTRAST: {
      MAIN_TEXT: __(
        'Low contrast between font and background color',
        'web-stories'
      ),
      HELPER_TEXT: __(
        'A high contrast makes the words easy to see.',
        'web-stories'
      ),
    },
    FONT_TOO_SMALL: {
      MAIN_TEXT: __('Font size too small', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: 1: minimum font size. */
        __('Text should have size %d or larger.', 'web-stories'),
        MIN_FONT_SIZE
      ),
    },
    LOW_IMAGE_RESOLUTION: {
      MAIN_TEXT: __('Low image resolution', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: 1: minimum image size width x minimum image size height. */
        __(
          'Use %s for full screen images. Use similar pixel density for cropped images.',
          'web-stories'
        ),
        `${IMAGE_SIZE_WIDTH}x${IMAGE_SIZE_HEIGHT}px`
      ),
    },
    MISSING_CAPTIONS: {
      MAIN_TEXT: __('Video missing captions', 'web-stories'),
      HELPER_TEXT: __(
        'Add captions to your video. Captions help keep your audience engaged, even when they can’t listen to the audio.',
        'web-stories'
      ),
    },
    MISSING_VIDEO_TITLE: {
      MAIN_TEXT: __('Video missing description', 'web-stories'),
      HELPER_TEXT: __(
        'Add a video description. Descriptions help with indexability and accessibility (for videos without captions). Include any burned-in text inside of the video.',
        'web-stories'
      ),
    },
    TOO_MANY_LINKS: {
      MAIN_TEXT: __('Too many links on a page', 'web-stories'),
      HELPER_TEXT: __(
        'Avoid having more than one link per page.',
        'web-stories'
      ),
    },
    LINK_REGION_TOO_SMALL: {
      MAIN_TEXT: __('Link tappable region too small', 'web-stories'),
      HELPER_TEXT: __(
        "Make the linked element large enough so it's easy for a user to tap it.",
        'web-stories'
      ),
    },
    MISSING_IMAGE_ALT_TEXT: {
      MAIN_TEXT: __('Image missing alt text', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: %s: alt. */
        __(
          'Add meaningful “%s” text to images to optimize accessibility and indexability.',
          'web-stories'
        ),
        'alt'
      ),
    },
    MISSING_VIDEO_ALT_TEXT: {
      MAIN_TEXT: __('Video missing alt text', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: %s: alt. */
        __(
          'Add meaningful “%s” text to videos to optimize accessibility and indexability.',
          'web-stories'
        ),
        'alt'
      ),
    },
  },
  DISTRIBUTION: {
    MISSING_DESCRIPTION: {
      MAIN_TEXT: __('Missing story description', 'web-stories'),
      HELPER_TEXT: __('Add a description for your story.', 'web-stories'),
    },
  },
  GENERAL_GUIDELINES: {
    STORY_TOO_SHORT: {
      MAIN_TEXT: __('Story too short', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: 1: minimum number of pages. 2: maximum number of pages. */
        __('Use between %1$d and %2$d pages in your story.', 'web-stories'),
        MIN_STORY_PAGES,
        MAX_STORY_PAGES
      ),
    },
    STORY_TOO_LONG: {
      MAIN_TEXT: __('Story too long', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: 1: minimum number of pages. 2: maximum number of pages. */
        __('Use between %1$d and %2$d pages in your story.', 'web-stories'),
        MIN_STORY_PAGES,
        MAX_STORY_PAGES
      ),
    },
    STORY_TITLE_TOO_LONG: {
      MAIN_TEXT: __('Story title too long', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: 1: minimum number of story characters. */
        __('Story title should have %d characters or fewer.', 'web-stories'),
        MAX_STORY_TITLE_LENGTH_CHARS
      ),
    },
  },
  TEXT: {
    TOO_MUCH_PAGE_TEXT: {
      MAIN_TEXT: __('Too much text on page', 'web-stories'),
      // eslint-disable eslint/no-useless-escape
      HELPER_TEXT: sprintf(
        /* translators: 1: maximum number of story characters. 2: maximum percentage of characters, depending on number of pages. */
        __(
          'Keep text to max %1$d characters per page. Consider using a page attachment, breaking up the text into multiple screens, or keeping the total number of pages with a lot of text to less than %2$d%% of the pages in the story.',
          'web-stories'
        ),
        MAX_STORY_CHARACTERS,
        MAX_CHARACTER_PERCENTAGE
      ),
    },
    TOO_LITTLE_TEXT: {
      MAIN_TEXT: __('Too little text', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: %d: minimum number of story characters. */
        __(
          'The entire story should have a minimum of %d characters of text in total.',
          'web-stories'
        ),
        MIN_STORY_CHARACTERS
      ),
    },
  },
  MEDIA: {
    VIDEO_IMAGE_TOO_SMALL_ON_PAGE: {
      MAIN_TEXT: __('Video or image too small on the page', 'web-stories'),
      HELPER_TEXT: (
        <TranslateWithMarkup
          mapping={{
            a: (
              //eslint-disable-next-line jsx-a11y/anchor-has-content
              <a
                href="https://amp.dev/documentation/guides-and-tutorials/start/create_successful_stories/#visual-treat"
                rel="noreferrer"
                target="_blank"
              />
            ),
          }}
        >
          {__(
            'Use full screen videos and images where possible to keep to an immersive feeling. <a>(more info)</a>',
            'web-stories'
          )}
        </TranslateWithMarkup>
      ),
    },
    LOW_IMAGE_RESOLUTION: {
      MAIN_TEXT: __('Low image resolution', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: 1: minimum image size width x minimum image size height. */
        __(
          'Use %s for full screen images, keep to similar pixel density for cropped images.',
          'web-stories'
        ),
        `${IMAGE_SIZE_WIDTH}x${IMAGE_SIZE_HEIGHT}px`
      ),
    },
    VIDEO_TOO_LONG: {
      MAIN_TEXT: __('Video too long', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: %d: maximum video length in minutes. */
        _n(
          'Break longer videos into segments of %d minute or less.',
          'Break longer videos into segments of %d minutes or less.',
          MAX_VIDEO_LENGTH_MINUTES,
          'web-stories'
        ),
        MAX_VIDEO_LENGTH_MINUTES
      ),
    },
    VIDEO_FRAME_RATE_TOO_LOW: {
      MAIN_TEXT: __('Video frame rate low', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: %d: minimum number of frames per second for video. */
        __(
          'Video should have a minimum of %d frames per second.',
          'web-stories'
        ),
        MIN_VIDEO_FPS
      ),
    },
    VIDEO_RESOLUTION_TOO_LOW: {
      MAIN_TEXT: __('Video resolution low', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: 1: minimum video resolution. */
        __('Videos should have a minimum resolution of %s.', 'web-stories'),
        `${MIN_VIDEO_RESOLUTION}p`
      ),
    },
    VIDEO_RESOLUTION_TOO_HIGH: {
      MAIN_TEXT: __('Video resolution too high', 'web-stories'),
      HELPER_TEXT: __(
        "Many mobile devices don't support video resolutions larger than 4K. Reduce the video resolution.",
        'web-stories'
      ),
    },
  },
};
