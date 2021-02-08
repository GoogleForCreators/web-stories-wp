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
import { __, sprintf, _n } from '@web-stories-wp/i18n';
import styled from 'styled-components';

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

const DashedList = styled.ul`
  list-style-type: '-';
  margin-left: 4px;

  li {
    padding-left: 4px;
  }
`;

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
        <DashedList>
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
        </DashedList>
      ),
    },
    MISSING_COVER: {
      MAIN_TEXT: __('Add story cover image', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
          <li>{__('Use as a representation of the story', 'web-stories')}</li>
          <li>{__('Avoid images with embedded text', 'web-stories')}</li>
          <li>
            {sprintf(
              /* translators: %s: image dimensions.  */
              __("Use an image that's at least %s", 'web-stories'),
              `${COVER_DIMENSION_WIDTH_PX}x${COVER_DIMENSION_HEIGHT_PX}px`
            )}
          </li>
          <li>
            {sprintf(
              /* translators: %s: cover dimensions aspect ratio.  */
              __('Maintain a %s aspect ratio', 'web-stories'),
              `${ASPECT_RATIO_LEFT}:${ASPECT_RATIO_RIGHT}`
            )}
          </li>
        </DashedList>
      ),
    },
    COVER_TOO_SMALL: {
      MAIN_TEXT: __(
        'Choose a bigger image for your story cover',
        'web-stories'
      ),
      HELPER_TEXT: (
        <DashedList>
          <li>
            {sprintf(
              /* translators: %s: image dimensions.  */
              __("Use an image that's at least %s", 'web-stories'),
              `${COVER_DIMENSION_WIDTH_PX}x${COVER_DIMENSION_HEIGHT_PX}px`
            )}
          </li>
          <li>
            {sprintf(
              /* translators: %s: cover dimensions aspect ratio.  */
              __('Maintain a %s aspect ratio', 'web-stories'),
              `${ASPECT_RATIO_LEFT}:${ASPECT_RATIO_RIGHT}`
            )}
          </li>
        </DashedList>
      ),
    },
    COVER_WRONG_ASPECT_RATIO: {
      MAIN_TEXT: __(
        'Choose an image with the correct aspect ratio',
        'web-stories'
      ),
      HELPER_TEXT: (
        <DashedList>
          <li>
            {sprintf(
              /* translators: %s: image dimensions.  */
              __("Use an image that's at least %s", 'web-stories'),
              `${COVER_DIMENSION_WIDTH_PX}x${COVER_DIMENSION_HEIGHT_PX}px`
            )}
          </li>
          <li>
            {sprintf(
              /* translators: %s: cover dimensions aspect ratio.  */
              __('Maintain a %s aspect ratio', 'web-stories'),
              `${ASPECT_RATIO_LEFT}:${ASPECT_RATIO_RIGHT}`
            )}
          </li>
        </DashedList>
      ),
    },
    LOGO_TOO_SMALL: {
      MAIN_TEXT: __('Upload a bigger logo', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
          <li>
            {sprintf(
              /* translators: %s: image dimensions. */
              __("Use an image that's at least %s", 'web-stories'),
              `${PUBLISHER_LOGO_DIMENSION}x${PUBLISHER_LOGO_DIMENSION}px`
            )}
          </li>
          <li>
            {sprintf(
              /* translators: %s: image dimensions. */
              __('Maintain a %s aspect ratio', 'web-stories'),
              `${PUBLISHER_LOGO_RATIO}x${PUBLISHER_LOGO_RATIO}px`
            )}
          </li>
        </DashedList>
      ),
    },
    LINK_ATTACHMENT_CONFLICT: {
      MAIN_TEXT: __(
        'Turn off Page Attachment or remove conflicting links',
        'web-stories'
      ),
      HELPER_TEXT: (
        <DashedList>
          <li>
            {__(
              'Remove the Page Attachment or any links at the bottom of the page, which conflict with the Page Attachment section',
              'web-stories'
            )}
          </li>
        </DashedList>
      ),
    },
    MISSING_VIDEO_POSTER: {
      MAIN_TEXT: __('Add a poster image for every video', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
          <li>
            {__(
              'Ensure a better experience by displaying a poster while users wait for the video to load',
              'web-stories'
            )}
          </li>
        </DashedList>
      ),
    },
  },
  ACCESSIBILITY: {
    LOW_CONTRAST: {
      MAIN_TEXT: __(
        'Adjust contrast between font and background color',
        'web-stories'
      ),
      HELPER_TEXT: (
        <DashedList>
          <li>
            {__(
              'Ensure legibility of text and ease of reading by increasing color contrast',
              'web-stories'
            )}
          </li>
        </DashedList>
      ),
    },
    FONT_TOO_SMALL: {
      MAIN_TEXT: __('Increase font size', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
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
        </DashedList>
      ),
    },
    LOW_IMAGE_RESOLUTION: {
      MAIN_TEXT: __('Select image with higher resolution', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
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
        </DashedList>
      ),
    },
    MISSING_CAPTIONS: {
      MAIN_TEXT: __('Add captions to video', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
          <li>
            {__(
              "Keep the audience engaged even when they can't listen to the audio",
              'web-stories'
            )}
          </li>
        </DashedList>
      ),
    },
    MISSING_VIDEO_DESCRIPTION: {
      MAIN_TEXT: __('Add video description', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
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
        </DashedList>
      ),
    },
    TOO_MANY_LINKS: {
      MAIN_TEXT: __('Reduce number of links', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
          <li>
            {__('Avoid having more than 3 links on one page', 'web-stories')}
          </li>
        </DashedList>
      ),
    },
    LINK_REGION_TOO_SMALL: {
      MAIN_TEXT: __('Increase tappable space for link', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
          <li>
            {__(
              'Make the linked element large enough for users to easily tap it',
              'web-stories'
            )}
          </li>
        </DashedList>
      ),
    },
    MISSING_IMAGE_ALT_TEXT: {
      MAIN_TEXT: __('Add assistive text to image', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
          <li>
            {__(
              'Optimize accessibility and indexability with meaningful text to better assist users',
              'web-stories'
            )}
          </li>
        </DashedList>
      ),
    },
  },
  DISTRIBUTION: {
    MISSING_DESCRIPTION: {
      MAIN_TEXT: __('Add story description', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
          <li>
            {__(
              'Incorporate a brief description for better user experience',
              'web-stories'
            )}
          </li>
        </DashedList>
      ),
    },
  },
  GENERAL_GUIDELINES: {
    STORY_TOO_SHORT: {
      MAIN_TEXT: __('Make story longer', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
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
        </DashedList>
      ),
    },
    STORY_TOO_LONG: {
      MAIN_TEXT: __('Make story shorter', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
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
        </DashedList>
      ),
    },
    STORY_TITLE_TOO_LONG: {
      MAIN_TEXT: __('Make story title shorter', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
          <li>
            {sprintf(
              /* translators: %d: minimum number of story characters. */
              _n(
                'Limit story title to %d character or less',
                'Limit story title to %d characters or less',
                MAX_STORY_TITLE_LENGTH_CHARS,
                'web-stories'
              ),
              MAX_STORY_TITLE_LENGTH_CHARS
            )}
          </li>
        </DashedList>
      ),
    },
  },
  TEXT: {
    TOO_MUCH_PAGE_TEXT: {
      MAIN_TEXT: __('Reduce text on page', 'web-stories'),
      // eslint-disable eslint/no-useless-escape
      HELPER_TEXT: (
        <DashedList>
          <li>
            {sprintf(
              /* translators: %d: maximum number of story characters. */
              _n(
                'Keep text to max %d character per page',
                'Keep text to max %d characters per page',
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
        </DashedList>
      ),
    },
    TOO_LITTLE_TEXT: {
      MAIN_TEXT: __('Increase amount of total text', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
          <li>
            {sprintf(
              /* translators: %d: minimum number of story characters. */
              _n(
                'Make your story text %d character or more',
                'Make your story text %d characters or more',
                MIN_STORY_CHARACTERS,
                'web-stories'
              ),
              MIN_STORY_CHARACTERS
            )}
          </li>
        </DashedList>
      ),
    },
  },
  MEDIA: {
    VIDEO_IMAGE_TOO_SMALL_ON_PAGE: {
      MAIN_TEXT: __('Increase video or image size on the page', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
          <li>
            <a
              href="https://amp.dev/documentation/guides-and-tutorials/start/create_successful_stories/#visual-treat"
              rel="noreferrer"
              target="_blank"
            >
              {__(
                'Use full screen videos and images whenever possible to create a more immersive experience (more info)',
                'web-stories'
              )}
            </a>
          </li>
        </DashedList>
      ),
    },
    LOW_IMAGE_RESOLUTION: {
      MAIN_TEXT: __('Choose an image with higher resolution', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
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
        </DashedList>
      ),
    },
    VIDEO_TOO_LONG: {
      MAIN_TEXT: __('Break video into segments', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
          <li>
            {sprintf(
              /* translators: %d: maximum video length in minutes. */
              _n(
                'Split longer videos into segments of %d minute or less',
                'Split longer videos into segments of %d minutes or less',
                MAX_VIDEO_LENGTH_MINUTES,
                'web-stories'
              ),
              MAX_VIDEO_LENGTH_MINUTES
            )}
          </li>
        </DashedList>
      ),
    },
    VIDEO_FRAME_RATE_TOO_LOW: {
      MAIN_TEXT: __('Increase video frame rate', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
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
        </DashedList>
      ),
    },
    VIDEO_RESOLUTION_TOO_LOW: {
      MAIN_TEXT: __('Increase video resolution', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
          <li>
            {sprintf(
              /* translators: 1: minimum video resolution. */
              __(
                'Ensure your videos has a minimum resolution of %s',
                'web-stories'
              ),
              `${MIN_VIDEO_RESOLUTION}p`
            )}
          </li>
        </DashedList>
      ),
    },
    VIDEO_RESOLUTION_TOO_HIGH: {
      MAIN_TEXT: __('Reduce video resolution', 'web-stories'),
      HELPER_TEXT: (
        <DashedList>
          <li>
            {__(
              "Optimize reach and engagement by accounting for the large number of mobile devices don't support video resolutions larger than 4K",
              'web-stories'
            )}
          </li>
        </DashedList>
      ),
    },
  },
};
