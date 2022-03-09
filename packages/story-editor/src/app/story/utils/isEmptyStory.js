/*
 * Copyright 2022 Google LLC
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
import { shallowEqual } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { DEFAULT_PAGE_BACKGROUND_COLOR } from '../../../elements/utils/createPage';

const isEmptyStory = (pages) => {
  const hasOnlyOnePage = pages.length === 1;
  if (!hasOnlyOnePage) {
    return false;
  }

  const hasNoExtraElements = pages[0].elements?.length === 1;
  if (!hasNoExtraElements) {
    return false;
  }

  const hasNoBackgroundMedia = pages[0].elements[0].isDefaultBackground;
  if (!hasNoBackgroundMedia) {
    return false;
  }

  const hasNoAttachment = pages[0].pageAttachment?.length === 0;
  if (!hasNoAttachment) {
    return false;
  }

  const hasDefaultBackgroundColor = shallowEqual(
    DEFAULT_PAGE_BACKGROUND_COLOR.color,
    pages[0].backgroundColor.color
  );
  if (!hasDefaultBackgroundColor) {
    return false;
  }

  return true;
};

export default isEmptyStory;
