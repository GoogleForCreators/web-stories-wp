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
import {
  __,
  sprintf,
  translateToExclusiveList,
  TranslateWithMarkup,
} from '@googleforcreators/i18n';
import { trackClick } from '@googleforcreators/tracking';
import { Link, THEME_CONSTANTS } from '@googleforcreators/design-system';

/**
 * Determine whether a URL is valid and acceptable for hotlinking.
 *
 * Validates that a URL has a valid path segment.
 *
 * @param {string} url URL to validate.
 * @return {boolean} Whether the URL is valid for hotlinking.
 */
export function isValidUrlForHotlinking(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname !== '/';
  } catch {
    return false;
  }
}

export function getErrorMessage(code, description) {
  switch (code) {
    case 'rest_invalid_param':
    case 'rest_invalid_url':
      return __('Invalid link.', 'web-stories');
    case 'rest_invalid_ext':
      return sprintf(
        /* translators: %s is the description with allowed file extensions. */
        __('Invalid link. %s', 'web-stories'),
        description
      );
    default:
      return __(
        'Media failed to load. Please ensure the link is valid and the site allows linking from external sites.',
        'web-stories'
      );
  }
}

export function getHotlinkDescription(allowedFileTypes) {
  let description = __('No file types are currently supported.', 'web-stories');
  if (allowedFileTypes.length) {
    description = sprintf(
      /* translators: %s is a list of allowed file extensions. */
      __('You can insert %s.', 'web-stories'),
      translateToExclusiveList(allowedFileTypes)
    );
  }

  return description;
}

export function CORSMessage() {
  const onDocsClick = (evt) => trackClick(evt, 'click_cors_check_docs');
  const DOCS_URL =
    'https://wp.stories.google/docs/troubleshooting/common-issues/';

  return (
    <TranslateWithMarkup
      mapping={{
        a: (
          <Link
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.MEDIUM}
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onDocsClick}
          />
        ),
      }}
    >
      {__(
        'Unable to load media. Make sure CORS is set up correctly for the file. <a>Learn more</a>.',
        'web-stories'
      )}
    </TranslateWithMarkup>
  );
}

export function checkImageDimensions(
  suppliedWidth,
  suppliedHeight,
  requiredWidth,
  requiredHeight
) {
  if (
    requiredHeight &&
    requiredHeight !== suppliedHeight &&
    requiredWidth &&
    requiredWidth !== suppliedWidth
  ) {
    return sprintf(
      /* translators: 1: image dimensions. 2: required dimensions. */
      __(
        'Image dimensions (%1$s) do not match required image dimensions (%2$s).',
        'web-stories'
      ),
      `${suppliedWidth}x${suppliedHeight}px`,
      `${requiredWidth}x${requiredHeight}px`
    );
  }
  if (requiredHeight && requiredHeight !== suppliedHeight) {
    return sprintf(
      /* translators: 1: supplied height. 2: required height. */
      __(
        'Image height (%1$s) does not match required image height (%2$s).',
        'web-stories'
      ),
      `${suppliedHeight}px`,
      `${requiredHeight}px`
    );
  }
  if (requiredWidth && requiredWidth !== suppliedWidth) {
    return sprintf(
      /* translators: 1: supplied width. 2: required width. */
      __(
        'Image width (%1$s) does not match required image width (%2$s).',
        'web-stories'
      ),
      `${suppliedWidth}px`,
      `${requiredWidth}px`
    );
  }

  return null;
}
