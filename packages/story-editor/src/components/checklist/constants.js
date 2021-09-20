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
import { __, sprintf, _n, TranslateWithMarkup } from '@web-stories-wp/i18n';
import { trackClick } from '@web-stories-wp/tracking';
import { Link, THEME_CONSTANTS } from '@web-stories-wp/design-system';

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
    title: sprintf(
      /* translators: %s: minimum image size width x minimum image size height. */
      __('Upload a higher resolution image to at least %s', 'web-stories'),
      `${IMAGE_SIZE_WIDTH}x${IMAGE_SIZE_HEIGHT}px`
    ),
    footer: (
      <>
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
    title: sprintf(
      /* translators: %s: minimum video resolution. */
      __('Increase video resolution to at least %s', 'web-stories'),
      `${MIN_VIDEO_RESOLUTION}p`
    ),
    footer: sprintf(
      /* translators: %s: minimum video resolution. */
      __('Ensure your video has a minimum resolution of %s', 'web-stories'),
      `${MIN_VIDEO_RESOLUTION}p`
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
              href={__('https://wp.stories.google/docs/', 'web-stories')}
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

// https://github.com/ampproject/amphtml/blob/cfb102aafc1543788b77f3ef9bd138c753e13097/validator/validator.proto#L853
export const VALIDATION_ERROR_CODES = {
  UNKNOWN_CODE: 0,
  INVALID_DOCTYPE_HTML: 111,
  MANDATORY_TAG_MISSING: 1,
  TAG_REQUIRED_BY_MISSING: 24,
  WARNING_TAG_REQUIRED_BY_MISSING: 76,
  TAG_EXCLUDED_BY_TAG: 101,
  WARNING_EXTENSION_UNUSED: 79,
  EXTENSION_UNUSED: 84,
  WARNING_EXTENSION_DEPRECATED_VERSION: 80,
  INVALID_EXTENSION_VERSION: 122,
  INVALID_EXTENSION_PATH: 123,
  NON_LTS_SCRIPT_AFTER_LTS: 112,
  LTS_SCRIPT_AFTER_NON_LTS: 113,
  INCORRECT_SCRIPT_RELEASE_VERSION: 119,
  DISALLOWED_AMP_DOMAIN: 121,
  ATTR_REQUIRED_BUT_MISSING: 61,
  DISALLOWED_TAG: 2,
  GENERAL_DISALLOWED_TAG: 51,
  DISALLOWED_SCRIPT_TAG: 88,
  DISALLOWED_ATTR: 3,
  DISALLOWED_STYLE_ATTR: 81,
  INVALID_ATTR_VALUE: 4,
  DUPLICATE_ATTRIBUTE: 94,
  ATTR_VALUE_REQUIRED_BY_LAYOUT: 27,
  MISSING_LAYOUT_ATTRIBUTES: 105,
  IMPLIED_LAYOUT_INVALID: 22,
  SPECIFIED_LAYOUT_INVALID: 26,
  MANDATORY_ATTR_MISSING: 5,
  MANDATORY_ONEOF_ATTR_MISSING: 28,
  MANDATORY_ANYOF_ATTR_MISSING: 104,
  DUPLICATE_DIMENSION: 60,
  DUPLICATE_UNIQUE_TAG: 6,
  DUPLICATE_UNIQUE_TAG_WARNING: 77,
  WRONG_PARENT_TAG: 7,
  STYLESHEET_TOO_LONG: 50,
  STYLESHEET_AND_INLINE_STYLE_TOO_LONG: 102,
  INLINE_STYLE_TOO_LONG: 103,
  INLINE_SCRIPT_TOO_LONG: 118,
  MANDATORY_CDATA_MISSING_OR_INCORRECT: 9,
  CDATA_VIOLATES_DENYLIST: 30,
  NON_WHITESPACE_CDATA_ENCOUNTERED: 82,
  INVALID_JSON_CDATA: 106,
  DEPRECATED_ATTR: 11,
  DEPRECATED_TAG: 12,
  MANDATORY_PROPERTY_MISSING_FROM_ATTR_VALUE: 14,
  INVALID_PROPERTY_VALUE_IN_ATTR_VALUE: 15,
  INVALID_URL: 36,
  DISALLOWED_DOMAIN: 62,
  DISALLOWED_RELATIVE_URL: 49,
  DISALLOWED_PROPERTY_IN_ATTR_VALUE: 16,
  MUTUALLY_EXCLUSIVE_ATTRS: 17,
  UNESCAPED_TEMPLATE_IN_ATTR_VALUE: 18,
  TEMPLATE_PARTIAL_IN_ATTR_VALUE: 19,
  TEMPLATE_IN_ATTR_NAME: 20,
  INCONSISTENT_UNITS_FOR_WIDTH_AND_HEIGHT: 21,
  DISALLOWED_TAG_ANCESTOR: 23,
  MANDATORY_LAST_CHILD_TAG: 89,
  MANDATORY_TAG_ANCESTOR: 31,
  MANDATORY_TAG_ANCESTOR_WITH_HINT: 32,
  ATTR_DISALLOWED_BY_IMPLIED_LAYOUT: 33,
  ATTR_DISALLOWED_BY_SPECIFIED_LAYOUT: 34,
  INCORRECT_NUM_CHILD_TAGS: 56,
  INCORRECT_MIN_NUM_CHILD_TAGS: 85,
  DISALLOWED_CHILD_TAG_NAME: 57,
  DISALLOWED_FIRST_CHILD_TAG_NAME: 58,
  DISALLOWED_MANUFACTURED_BODY: 64,
  CHILD_TAG_DOES_NOT_SATISFY_REFERENCE_POINT: 66,
  MANDATORY_REFERENCE_POINT_MISSING: 67,
  DUPLICATE_REFERENCE_POINT: 68,
  TAG_NOT_ALLOWED_TO_HAVE_SIBLINGS: 87,
  TAG_REFERENCE_POINT_CONFLICT: 69,
  CHILD_TAG_DOES_NOT_SATISFY_REFERENCE_POINT_SINGULAR: 70,
  // TODO(gregable): Fix this spelling error: 'precede'
  BASE_TAG_MUST_PRECEED_ALL_URLS: 78,
  BASE_TAG_MUST_PRECEDE_ALL_URLS: 78,
  MISSING_REQUIRED_EXTENSION: 83,
  ATTR_MISSING_REQUIRED_EXTENSION: 97,
  DOCUMENT_TOO_COMPLEX: 86,
  INVALID_UTF8: 96,
  DOCUMENT_SIZE_LIMIT_EXCEEDED: 108,
  DEV_MODE_ONLY: 109,
  AMP_EMAIL_MISSING_STRICT_CSS_ATTR: 120,
  VALUE_SET_MISMATCH: 110,

  CSS_SYNTAX_INVALID_AT_RULE: 29,
  CSS_SYNTAX_STRAY_TRAILING_BACKSLASH: 38,
  CSS_SYNTAX_UNTERMINATED_COMMENT: 39,
  CSS_SYNTAX_UNTERMINATED_STRING: 40,
  CSS_SYNTAX_BAD_URL: 41,
  CSS_SYNTAX_EOF_IN_PRELUDE_OF_QUALIFIED_RULE: 42,
  CSS_SYNTAX_INVALID_DECLARATION: 43,
  CSS_SYNTAX_INCOMPLETE_DECLARATION: 44,
  CSS_SYNTAX_ERROR_IN_PSEUDO_SELECTOR: 45,
  CSS_SYNTAX_MISSING_SELECTOR: 46,
  CSS_SYNTAX_NOT_A_SELECTOR_START: 47,
  CSS_SYNTAX_UNPARSED_INPUT_REMAINS_IN_SELECTOR: 48,
  CSS_SYNTAX_MISSING_URL: 52,
  CSS_SYNTAX_INVALID_URL: 53,
  CSS_SYNTAX_INVALID_URL_PROTOCOL: 54,
  CSS_SYNTAX_DISALLOWED_DOMAIN: 63,
  CSS_SYNTAX_DISALLOWED_RELATIVE_URL: 55,
  CSS_SYNTAX_INVALID_ATTR_SELECTOR: 59,
  CSS_SYNTAX_INVALID_PROPERTY: 90,
  CSS_SYNTAX_INVALID_PROPERTY_NOLIST: 95,
  CSS_SYNTAX_QUALIFIED_RULE_HAS_NO_DECLARATIONS: 91,
  CSS_SYNTAX_DISALLOWED_QUALIFIED_RULE_MUST_BE_INSIDE_KEYFRAME: 92,
  CSS_SYNTAX_DISALLOWED_KEYFRAME_INSIDE_KEYFRAME: 93,
  CSS_SYNTAX_MALFORMED_MEDIA_QUERY: 98,
  CSS_SYNTAX_DISALLOWED_MEDIA_TYPE: 99,
  CSS_SYNTAX_DISALLOWED_MEDIA_FEATURE: 100,
  CSS_SYNTAX_DISALLOWED_ATTR_SELECTOR: 114,
  CSS_SYNTAX_DISALLOWED_PSEUDO_CLASS: 115,
  CSS_SYNTAX_DISALLOWED_PSEUDO_ELEMENT: 116,
  CSS_SYNTAX_DISALLOWED_PROPERTY_VALUE: 71,
  CSS_SYNTAX_DISALLOWED_IMPORTANT: 117,
  CSS_EXCESSIVELY_NESTED: 107,
};
