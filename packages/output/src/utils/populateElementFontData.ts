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
import type { FontData, Page } from '@googleforcreators/elements';
import { elementIs, ElementType } from '@googleforcreators/elements';

type Fonts = Record<string, FontData>;
function populateElementFontProperties(
  { elements, ...rest }: Page,
  fonts: Fonts
) {
  if (!fonts) {
    return { elements, ...rest };
  }

  return {
    elements: elements.map((element) => {
      if (
        elementIs.text(element) &&
        element.type === ElementType.Text &&
        Boolean(element.font?.family)
      ) {
        return { ...element, font: fonts[element.font?.family] };
      }
      return element;
    }),
    ...rest,
  };
}

export function populateElementFontData(data: Page[], fonts: Fonts): Page[] {
  return data.map((page) => populateElementFontProperties(page, fonts));
}
