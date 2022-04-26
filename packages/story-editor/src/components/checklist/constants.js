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
import { __, sprintf, _n, TranslateWithMarkup } from '@googleforcreators/i18n';
import { trackClick } from '@googleforcreators/tracking';
import { Link, THEME_CONSTANTS } from '@googleforcreators/design-system';

export const THUMBNAIL_MAX = 4;
export const THUMBNAIL_COUNT_FOR_OVERFLOW = 3;

export const ASPECT_RATIO_LEFT = 3;
export const ASPECT_RATIO_RIGHT = 4;
const IMAGE_SIZE_WIDTH = 828;
const IMAGE_SIZE_HEIGHT = 1792;
const MAX_CHARACTER_PERCENTAGE = 10;
export const MIN_FONT_SIZE = 12;
export const MIN_STORY_CHARACTER_COUNT = 100;
export const MAX_PAGE_CHARACTER_COUNT = 200;
export const MIN_STORY_PAGES = 4;
export const MAX_STORY_PAGES = 30;
export const MAX_STORY_TITLE_LENGTH_WORDS = 10;
export const MAX_STORY_TITLE_LENGTH_CHARS = 70;
export const MAX_VIDEO_LENGTH_SECONDS = 60;
const MAX_VIDEO_LENGTH_MINUTES = Math.floor(MAX_VIDEO_LENGTH_SECONDS / 60);
const MIN_TAP_REGION_WIDTH = 48;
export const MAX_LINKS_PER_PAGE = 3;
const MAX_VIDEO_RESOLUTION = 720;
const MIN_VIDEO_RESOLUTION = 480;
export const MIN_VIDEO_HEIGHT = 480;
export const MIN_VIDEO_WIDTH = 852;
const MIN_VIDEO_FPS = 24;
export const FEATURED_MEDIA_RESOURCE_MIN_WIDTH = 640;
export const FEATURED_MEDIA_RESOURCE_MIN_HEIGHT = 853;
export const PUBLISHER_LOGO_DIMENSION = 96;
const PUBLISHER_LOGO_RATIO = 1;

export const POPUP_ID = 'checklist_companion';

export const CHECKLIST_TITLE = __('Checklist', 'web-stories');

export const ISSUE_TYPES = {
  ACCESSIBILITY: 'accessibility',
  DESIGN: 'design',
  PRIORITY: 'priority',
};

export const CATEGORY_LABELS = {
  [ISSUE_TYPES.ACCESSIBILITY]: __('Accessibility', 'web-stories'),
  [ISSUE_TYPES.DESIGN]: __('Design', 'web-stories'),
  [ISSUE_TYPES.PRIORITY]: __('Priority', 'web-stories'),
};

const DOCS_URL = 'https://wp.stories.google/docs/';

// Event Tracking
const onAmpErrorClick = (evt) => trackClick(evt, 'click_checklist_amp_test');

// Checklist Copy
export const ACCESSIBILITY_COPY = {
  fontSizeTooSmall: {
    title: sprintf(
      /* translators: %d: minimum font size. */
      __('Increase font size to %s or above', 'web-stories'),
      MIN_FONT_SIZE
    ),
    footer: sprintf(
      /* translators: %d: minimum font size. */
      __(
        'Ensure legibility by selecting text size %d or greater',
        'web-stories'
      ),
      MIN_FONT_SIZE
    ),
  },
  imagesMissingAltText: {
    title: __('Add assistive text to images', 'web-stories'),
    footer: __(
      'Optimize accessibility and indexability with meaningful text to better assist users.',
      'web-stories'
    ),
  },
  linkTappableRegionTooBig: {
    title: __('Reduce link size', 'web-stories'),
    footer: __(
      'Elements with links must not cover most of the page. Decrease the size of elements with links.',
      'web-stories'
    ),
  },
  linkTappableRegionTooSmall: {
    title: sprintf(
      /* translators: %s: minimum tappable region size width x minimum tappable region size height. */
      __('Increase tap area size to at least %s', 'web-stories'),
      `${MIN_TAP_REGION_WIDTH}x${MIN_TAP_REGION_WIDTH}px`
    ),
    footer: __(
      'Optimize accessibility and indexability with meaningful text to better assist users',
      'web-stories'
    ),
  },
  lowContrast: {
    title: __(
      'Increase contrast between text and background color',
      'web-stories'
    ),
    footer: __(
      'Ensure legibility of text and ease of reading by increasing color contrast',
      'web-stories'
    ),
    textPanel: __(
      'This color or font size combination may be hard for some people to read.',
      'web-stories'
    ),
    backgroundPanel: __(
      'This background color may make some text hard to read.',
      'web-stories'
    ),
    warningIcon: __('Low Warning', 'web-stories'),
  },
  videoMissingCaptions: {
    title: __('Add video captions', 'web-stories'),
    footer: __(
      "Keep the audience engaged even when they can't listen to the audio",
      'web-stories'
    ),
  },
  videoMissingTitle: {
    title: __('Add video description', 'web-stories'),
    footer: __(
      'Improves indexability and accessibility (for videos without captions)',
      'web-stories'
    ),
  },
};

export const DESIGN_COPY = {
  storyTooShort: {
    title: sprintf(
      /* translators: %d: maximum number of pages. */
      _n(
        'Make Web Story at least %d page',
        'Make Web Story at least %d pages',
        MIN_STORY_PAGES,
        'web-stories'
      ),
      MIN_STORY_PAGES
    ),
    footer: sprintf(
      /* translators: 1: minimum number of pages. 2: maximum number of pages. */
      __(
        'It is recommended to have between %1$d and %2$d pages in your story',
        'web-stories'
      ),
      MIN_STORY_PAGES,
      MAX_STORY_PAGES
    ),
  },
  storyTooLong: {
    title: sprintf(
      /* translators: %d: minimum number of pages. */
      _n(
        'Make Web Story fewer than %d page',
        'Make Web Story fewer than %d pages',
        MAX_STORY_PAGES,
        'web-stories'
      ),
      MAX_STORY_PAGES
    ),
    footer: sprintf(
      /* translators: 1: minimum number of pages. 2: maximum number of pages. */
      __(
        'It is recommended to have between %1$d and %2$d pages in your story',
        'web-stories'
      ),
      MIN_STORY_PAGES,
      MAX_STORY_PAGES
    ),
  },
  tooLittlePageText: {
    title: __('Add more text to page', 'web-stories'),
    footer: sprintf(
      /* translators: %d: minimum number of story characters. */
      _n(
        'Include at least %d character',
        'Include at least %d characters',
        MIN_STORY_CHARACTER_COUNT,
        'web-stories'
      ),
      MIN_STORY_CHARACTER_COUNT
    ),
  },
  tooMuchPageText: {
    title: __('Reduce text amount on page', 'web-stories'),
    footer: (
      <>
        <li>
          {sprintf(
            /* translators: %d: maximum number of story characters. */
            _n(
              'Include no more than %d character',
              'Include no more than %d characters',
              MAX_PAGE_CHARACTER_COUNT,
              'web-stories'
            ),
            MAX_PAGE_CHARACTER_COUNT
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
      </>
    ),
  },
  tooManyLinksOnPage: {
    title: sprintf(
      /* translators: %s: maximum number of links per page. */
      __('Avoid including more than %s links per page', 'web-stories'),
      MAX_LINKS_PER_PAGE
    ),
    footer: sprintf(
      /* translators: %s: maximum number of links per page. */
      __('Avoid having more than %s links on one page', 'web-stories'),
      MAX_LINKS_PER_PAGE
    ),
  },
  imageResolutionTooLow: {
    title: __('Increase image resolution', 'web-stories'),
    footer: (
      <>
        <li>
          {__(
            'Use larger resolution (2x or 3x) images for best appearance on screens with high pixel density',
            'web-stories'
          )}
        </li>
        <li>
          {sprintf(
            /* translators: %s: minimum image size width x minimum image size height. */
            __(
              'For full-screen images, use a resolution of at least %s',
              'web-stories'
            ),
            `${IMAGE_SIZE_WIDTH}x${IMAGE_SIZE_HEIGHT}px`
          )}
        </li>
      </>
    ),
  },
  videoFrameRateTooLow: {
    title: sprintf(
      /* translators: %d: minimum number of frames per second for video. */
      __('Increase video frame rate to at least %d fps', 'web-stories'),
      MIN_VIDEO_FPS
    ),
    footer: sprintf(
      /* translators: %d: minimum number of frames per second for video. */
      _n(
        'Ensure your video has a minimum of %d frame per second',
        'Ensure your video has a minimum of %d frames per second',
        MIN_VIDEO_FPS,
        'web-stories'
      ),
      MIN_VIDEO_FPS
    ),
  },
  videoResolutionTooLow: {
    title: __('Increase video resolution', 'web-stories'),
    footer: sprintf(
      /* translators: 1: minimum video resolution. 2: minimum video width x minimum video height in pixels. */
      __(
        'Consider using a minimum resolution of %1$s (%2$s) to represent portrait videos',
        'web-stories'
      ),
      `${MIN_VIDEO_RESOLUTION}p`,
      `${MIN_VIDEO_WIDTH}x${MIN_VIDEO_HEIGHT}px`
    ),
  },
  videoTooLong: {
    title: sprintf(
      /* translators: %d: maximum video length in minutes. */
      _n(
        'Split videos into segments of %d minute or less',
        'Split videos into segments of %d minutes or less',
        MAX_VIDEO_LENGTH_MINUTES,
        'web-stories'
      ),
      MAX_VIDEO_LENGTH_MINUTES
    ),
    footer: __('Shorter videos help readers navigate stories', 'web-stories'),
  },
};

export const PRIORITY_COPY = {
  storyMissingDescription: {
    title: __('Add Web Story description', 'web-stories'),
    footer: __(
      'Incorporate a brief description for better user experience',
      'web-stories'
    ),
  },
  storyMissingTitle: {
    title: __('Add Web Story title', 'web-stories'),
    footer: (
      <>
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
      </>
    ),
  },
  storyMissingPoster: {
    title: __('Add poster image', 'web-stories'),
    footer: (
      <>
        <li>{__('Use as a representation of the story', 'web-stories')}</li>
        <li>{__('Avoid images with embedded text', 'web-stories')}</li>
        <li>
          {sprintf(
            /* translators: %s: image dimensions.  */
            __("Use an image that's at least %s", 'web-stories'),
            `${FEATURED_MEDIA_RESOURCE_MIN_WIDTH}x${FEATURED_MEDIA_RESOURCE_MIN_HEIGHT}px`
          )}
        </li>
        <li>
          {sprintf(
            /* translators: %s: aspect ratio.  */
            __('Maintain a %s aspect ratio', 'web-stories'),
            `${ASPECT_RATIO_LEFT}:${ASPECT_RATIO_RIGHT}`
          )}
        </li>
      </>
    ),
  },
  videoMissingPoster: {
    title: __('Add poster image to every video', 'web-stories'),
    footer: __(
      'Ensure a better experience by displaying a poster while users wait for the video to load',
      'web-stories'
    ),
  },
  storyTitleTooLong: {
    title: sprintf(
      /* translators: %d: maximum number of story characters. */
      _n(
        'Shorten title to fewer than %d character',
        'Shorten title to fewer than %d characters',
        MAX_STORY_TITLE_LENGTH_CHARS,
        'web-stories'
      ),
      MAX_STORY_TITLE_LENGTH_CHARS
    ),
    footer: sprintf(
      /* translators: %d: maximum number of story characters. */
      _n(
        'Limit story title to %d character or less',
        'Limit story title to %d characters or less',
        MAX_STORY_TITLE_LENGTH_CHARS,
        'web-stories'
      ),
      MAX_STORY_TITLE_LENGTH_CHARS
    ),
  },
  logoTooSmall: {
    title: sprintf(
      /* translators: %s: image dimensions. */
      __('Increase size of publisher logo to at least %s', 'web-stories'),
      `${PUBLISHER_LOGO_DIMENSION}x${PUBLISHER_LOGO_DIMENSION}px`
    ),
    footer: (
      <>
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
      </>
    ),
  },
  noPublisherLogo: {
    title: __('Add a publisher logo to your story', 'web-stories'),
    footer: (
      <>
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
      </>
    ),
  },
  storyPosterSize: {
    title: sprintf(
      /* translators: %s: image dimensions.  */
      __('Correct poster image aspect ratio to %s', 'web-stories'),
      `${FEATURED_MEDIA_RESOURCE_MIN_WIDTH}x${FEATURED_MEDIA_RESOURCE_MIN_HEIGHT}px`
    ),
    footer: (
      <>
        <li>
          {sprintf(
            /* translators: %s: image dimensions.  */
            __("Use an image that's at least %s", 'web-stories'),
            `${FEATURED_MEDIA_RESOURCE_MIN_WIDTH}x${FEATURED_MEDIA_RESOURCE_MIN_HEIGHT}px`
          )}
        </li>
        <li>
          {sprintf(
            /* translators: %s: aspect ratio.  */
            __('Maintain a %s aspect ratio', 'web-stories'),
            `${ASPECT_RATIO_LEFT}:${ASPECT_RATIO_RIGHT}`
          )}
        </li>
      </>
    ),
  },
  videoNotOptimized: {
    title: __('Optimize videos', 'web-stories'),
    footer: sprintf(
      /* translators: %s: video resolution (720p) */
      __(
        'Videos larger than %s can cause slower loading and higher bandwidth costs.',
        'web-stories'
      ),
      `${MAX_VIDEO_RESOLUTION}p`
    ),
  },
  storyMissingPublisherName: {
    title: __('Add Site Title', 'web-stories'),
  },
  ampValidation: {
    title: __('Compatibility', 'web-stories'),
    footer: (
      <TranslateWithMarkup
        mapping={{
          a: (
            <Link
              href={DOCS_URL}
              rel="noreferrer"
              target="_blank"
              onClick={onAmpErrorClick}
              size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
            />
          ),
        }}
      >
        {__(
          'Your story contains errors that can affect eligibility to appear on Google. Please see <a>our FAQ</a> for more information.',
          'web-stories'
        )}
      </TranslateWithMarkup>
    ),
  },
};

export const PPC_CHECKPOINT_STATE = {
  UNAVAILABLE: 'unavailable',
  ONLY_RECOMMENDED: 'recommended',
  ALL: 'all',
};

export const PANEL_VISIBILITY_BY_STATE = {
  [PPC_CHECKPOINT_STATE.UNAVAILABLE]: [],
  [PPC_CHECKPOINT_STATE.ONLY_RECOMMENDED]: [
    ISSUE_TYPES.ACCESSIBILITY,
    ISSUE_TYPES.DESIGN,
  ],
  [PPC_CHECKPOINT_STATE.ALL]: Object.values(ISSUE_TYPES),
};

export const PANEL_EXPANSION_BY_CHECKPOINT = {
  [PPC_CHECKPOINT_STATE.UNAVAILABLE]: null,
  [PPC_CHECKPOINT_STATE.ONLY_RECOMMENDED]: ISSUE_TYPES.DESIGN,
  [PPC_CHECKPOINT_STATE.ALL]: ISSUE_TYPES.PRIORITY,
};
