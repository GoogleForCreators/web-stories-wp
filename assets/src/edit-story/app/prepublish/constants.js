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
import { __, sprintf } from '@wordpress/i18n';
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
      MAIN_TEXT: __('Add story title', 'web-stories'),
      HELPER_TEXT: (
        <TranslateWithMarkup>
          {sprintf(
            /* translators: 1: minimum story title length in words. 2: maximum story title length in characters. */
            __(
              "- Keep under %1$d words<br/>- Don't exceed %2$d characters",
              'web-stories'
            ),
            MAX_STORY_TITLE_LENGTH_WORDS,
            MAX_STORY_TITLE_LENGTH_CHARS
          )}
        </TranslateWithMarkup>
      ),
    },
    MISSING_COVER: {
      MAIN_TEXT: __('Add story cover image', 'web-stories'),
      HELPER_TEXT: (
        <TranslateWithMarkup>
          {sprintf(
            /* translators: 1: minimum cover dimension width x minimum cover dimension height. 2: cover dimensions aspect ratio.  */
            __(
              // 'Used as the cover for the Story and is representative of the story. Should not have the Story title pre-embedded on it or any other burned-in text. Should be at least %1$s in size and maintain a %2$s aspect ratio.',
              "- Use as a representation of the story<br/>- Avoid images with embedded text<br/>- Use an image that's at least 640x853px<br/>- Maintain a %2$s aspect ratio",
              'web-stories'
            ),
            `${COVER_DIMENSION_WIDTH_PX}x${COVER_DIMENSION_HEIGHT_PX}px`,
            `${ASPECT_RATIO_LEFT}:${ASPECT_RATIO_RIGHT}`
          )}
        </TranslateWithMarkup>
      ),
    },
    COVER_TOO_SMALL: {
      MAIN_TEXT: __(
        'Choose a bigger image for your story cover',
        'web-stories'
      ),
      HELPER_TEXT: (
        <TranslateWithMarkup>
          {sprintf(
            /* translators: 1: minimum cover dimension width X minimum cover dimension height. 2: cover dimensions aspect ratio. */
            __(
              "- Use an image that's at least %1$s<br/>- Maintain a %2$s aspect ratio",
              'web-stories'
            ),
            `${COVER_DIMENSION_WIDTH_PX}x${COVER_DIMENSION_HEIGHT_PX}px`,
            `${ASPECT_RATIO_LEFT}:${ASPECT_RATIO_RIGHT}`
          )}
        </TranslateWithMarkup>
      ),
    },
    COVER_WRONG_ASPECT_RATIO: {
      MAIN_TEXT: __(
        'Choose an image with the correct aspect ratio',
        'web-stories'
      ),
      HELPER_TEXT: (
        <TranslateWithMarkup>
          {sprintf(
            /* translators: %s: cover dimensions aspect ratio. */
            __(
              "- Use an image that's at least %1$s<br/>- Maintain a %2$s aspect ratio",
              'web-stories'
            ),
            `${COVER_DIMENSION_WIDTH_PX}x${COVER_DIMENSION_HEIGHT_PX}px`,
            `${ASPECT_RATIO_LEFT}:${ASPECT_RATIO_RIGHT}`
          )}
        </TranslateWithMarkup>
      ),
    },
    LOGO_TOO_SMALL: {
      MAIN_TEXT: __('Upload a bigger logo', 'web-stories'),
      HELPER_TEXT: (
        <TranslateWithMarkup>
          {sprintf(
            /* translators: 1: minimum publisher logo dimensions. 2: publisher logo dimension ratio. */
            __(
              "- Use an image that's at least %1$s<br/>- Maintain a %2$s aspect ratio",
              'web-stories'
            ),
            `${PUBLISHER_LOGO_DIMENSION}x${PUBLISHER_LOGO_DIMENSION}px`,
            `${PUBLISHER_LOGO_RATIO}x${PUBLISHER_LOGO_RATIO}px`
          )}
        </TranslateWithMarkup>
      ),
    },
    LINK_ATTACHMENT_CONFLICT: {
      MAIN_TEXT: __(
        'Turn off Page Attachment or remove conflicting links',
        'web-stories'
      ),
      HELPER_TEXT: __(
        '- Remove the Page Attachment or any links at the bottom of the page, which conflict with the Page Attachment section',
        'web-stories'
      ),
    },
    MISSING_VIDEO_POSTER: {
      MAIN_TEXT: __('Add a poster image for every video', 'web-stories'),
      HELPER_TEXT: __(
        '- Ensure a better experience by displaying a poster while users wait for the video to load',
        'web-stories'
      ),
    },
  },
  ACCESSIBILITY: {
    LOW_CONTRAST: {
      MAIN_TEXT: __(
        'Adjust contrast between font and background color',
        'web-stories'
      ),
      HELPER_TEXT: __(
        '- Ensure legibility of text and ease of reading by increasing color contrast',
        'web-stories'
      ),
    },
    FONT_TOO_SMALL: {
      MAIN_TEXT: __('Increase font size', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: 1: minimum font size. */
        __(
          '- Ensure legibility by selecting text size %d or greater',
          'web-stories'
        ),
        MIN_FONT_SIZE
      ),
    },
    LOW_IMAGE_RESOLUTION: {
      MAIN_TEXT: __('Select image with higher resolution', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: 1: minimum image size width x minimum image size height. */
        __(
          '- Use %s for a full-screen image<br/>- Consider similar pixel density for cropped images',
          'web-stories'
        ),
        `${IMAGE_SIZE_WIDTH}x${IMAGE_SIZE_HEIGHT}px`
      ),
    },
    MISSING_CAPTIONS: {
      MAIN_TEXT: __('Add captions to video', 'web-stories'),
      HELPER_TEXT: __(
        "- Keep the audience engaged even when they can't listen to the audio",
        'web-stories'
      ),
    },
    MISSING_VIDEO_DESCRIPTION: {
      MAIN_TEXT: __('Add video description', 'web-stories'),
      HELPER_TEXT: (
        <TranslateWithMarkup>
          {__(
            '- Improves indexability and accessibility (for videos without captions)<br/>- Include any text or captions that are already a rendered part of the video',
            'web-stories'
          )}
        </TranslateWithMarkup>
      ),
    },
    TOO_MANY_LINKS: {
      MAIN_TEXT: __('Reduce number of links', 'web-stories'),
      HELPER_TEXT: __(
        '- Avoid having more than 3 links on one page',
        'web-stories'
      ),
    },
    LINK_REGION_TOO_SMALL: {
      MAIN_TEXT: __('Increase tappable space for link', 'web-stories'),
      HELPER_TEXT: __(
        '- Make the linked element large enough for users to easily tap it',
        'web-stories'
      ),
    },
    MISSING_IMAGE_ALT_TEXT: {
      MAIN_TEXT: __('Add assistive text to image', 'web-stories'),
      HELPER_TEXT: __(
        '- Optimize accessibility and indexability with meaningful text to better assist users',
        'web-stories'
      ),
    },
  },
  DISTRIBUTION: {
    MISSING_DESCRIPTION: {
      MAIN_TEXT: __('Add story description', 'web-stories'),
      HELPER_TEXT: __(
        '- Incorporate a brief description for better user experience',
        'web-stories'
      ),
    },
  },
  GENERAL_GUIDELINES: {
    STORY_TOO_SHORT: {
      MAIN_TEXT: __('Make story longer', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: 1: minimum number of pages. 2: maximum number of pages. */
        __(
          '- It is recommended to have between %1$d and %2$d pages in your story',
          'web-stories'
        ),
        MIN_STORY_PAGES,
        MAX_STORY_PAGES
      ),
    },
    STORY_TOO_LONG: {
      MAIN_TEXT: __('Make story shorter', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: 1: minimum number of pages. 2: maximum number of pages. */
        __(
          '- It is recommended to have between %1$d and %2$d pages in your story',
          'web-stories'
        ),
        MIN_STORY_PAGES,
        MAX_STORY_PAGES
      ),
    },
    STORY_TITLE_TOO_LONG: {
      MAIN_TEXT: __('Make story title shorter', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: 1: minimum number of story characters. */
        __('- Limit story title to %d characters or less', 'web-stories'),
        MAX_STORY_TITLE_LENGTH_CHARS
      ),
    },
  },
  TEXT: {
    TOO_MUCH_PAGE_TEXT: {
      MAIN_TEXT: __('Reduce text on page', 'web-stories'),
      // eslint-disable eslint/no-useless-escape
      HELPER_TEXT: (
        <TranslateWithMarkup>
          {sprintf(
            /* translators: 1: maximum number of story characters. 2: maximum percentage of characters, depending on number of pages. */
            __(
              '- Keep text to max %1$d characters per page<br/>- Use a page attachment breaking up the text into multiple screens; or<br/>- Keep the total number of text-heavy pages under %2$d%% of total number of story pages',
              'web-stories'
            ),
            MAX_STORY_CHARACTERS,
            MAX_CHARACTER_PERCENTAGE
          )}
        </TranslateWithMarkup>
      ),
    },
    TOO_LITTLE_TEXT: {
      MAIN_TEXT: __('Increase amount of total text', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: %d: minimum number of story characters. */
        __('- Make your story text %d characters or more', 'web-stories'),
        MIN_STORY_CHARACTERS
      ),
    },
  },
  MEDIA: {
    VIDEO_IMAGE_TOO_SMALL_ON_PAGE: {
      MAIN_TEXT: __('Increase video or image size on the page', 'web-stories'),
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
            '-<a> Use full screen videos and images whenever possible to create a more immersive experience. (more info)</a>',
            'web-stories'
          )}
        </TranslateWithMarkup>
      ),
    },
    LOW_IMAGE_RESOLUTION: {
      MAIN_TEXT: __('Choose an image with higher resolution', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: 1: minimum image size width x minimum image size height. */
        __(
          '- Use %s for full screen image<br/>- Consider similar pixel density for cropped images',
          'web-stories'
        ),
        `${IMAGE_SIZE_WIDTH}x${IMAGE_SIZE_HEIGHT}px`
      ),
    },
    VIDEO_TOO_LONG: {
      MAIN_TEXT: __('Break video into segments', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: %d: maximum video length in minutes. */
        __(
          '- Split longer videos into segments of %d minute or less',
          'web-stories'
        ),
        MAX_VIDEO_LENGTH_MINUTES
      ),
    },
    VIDEO_FRAME_RATE_TOO_LOW: {
      MAIN_TEXT: __('Increase video frame rate', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: %d: minimum number of frames per second for video. */
        __(
          '- Ensure your video has a minimum of %d frames per second',
          'web-stories'
        ),
        MIN_VIDEO_FPS
      ),
    },
    VIDEO_RESOLUTION_TOO_LOW: {
      MAIN_TEXT: __('Increase video resolution', 'web-stories'),
      HELPER_TEXT: sprintf(
        /* translators: 1: minimum video resolution. */
        __(
          '- Ensure your videos has a minimum resolution of %s',
          'web-stories'
        ),
        `${MIN_VIDEO_RESOLUTION}p`
      ),
    },
    VIDEO_RESOLUTION_TOO_HIGH: {
      MAIN_TEXT: __('Reduce video resolution', 'web-stories'),
      HELPER_TEXT: __(
        "- Optimize reach and engagement by accounting for the large number of mobile devices don't support video resolutions larger than 4K",
        'web-stories'
      ),
    },
  },
};
