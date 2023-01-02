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
import { shallowEqual } from '@googleforcreators/react';
import { createPage, elementIs } from '@googleforcreators/elements';
import type { Page } from '@googleforcreators/elements';

/**
 * Determine if a page has background or element changes different from the default page.
 *
 * @param page Page object.
 * @return If the page is equivalent to the default page.
 */
const isDefaultPage = (page: Page) => {
  // Check if page has more than just the single default background element
  if (page.elements.length > 1) {
    return false;
  }

  const defaultPage = createPage();

  // Check if background color is different
  if (
    'color' in page.backgroundColor &&
    'color' in defaultPage.backgroundColor &&
    !shallowEqual(page.backgroundColor.color, defaultPage.backgroundColor.color)
  ) {
    return false;
  }

  // Check if background element is not default
  const backgroundElement = page.elements.find(
    (e) => elementIs.backgroundable(e) && e.isBackground
  );
  if (backgroundElement) {
    if (
      !elementIs.defaultBackground(backgroundElement) ||
      !backgroundElement.isDefaultBackground
    ) {
      return false;
    }
  }

  return true;
};

export default isDefaultPage;
